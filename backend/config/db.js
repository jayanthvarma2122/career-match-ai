import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

export let isDbConnected = false;

/**
 * Resolves MongoDB Atlas SRV URI to direct replicaSet shard connection string.
 * Solves Node.js / c-ares DNS `querySrv ECONNREFUSED` issues on Windows.
 */
function resolveSrvToDirectUri(srvUri) {
  try {
    const urlPattern = /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(?:\/([^?]+))?(?:\?(.*))?$/;
    const match = srvUri.match(urlPattern);
    if (!match) return null;

    const [, user, pass, host, dbName, queryParams] = match;
    const targetDb = dbName || 'careermatch_ai';

    const srvOut = execSync(`nslookup -type=SRV _mongodb._tcp.${host}`, { timeout: 5000 }).toString();
    const txtOut = execSync(`nslookup -type=TXT ${host}`, { timeout: 5000 }).toString();

    const hostnames = [];
    const srvRegex = /svr hostname\s*=\s*([^\s\r\n]+)/gi;
    let sMatch;
    while ((sMatch = srvRegex.exec(srvOut)) !== null) {
      hostnames.push(`${sMatch[1]}:27017`);
    }

    if (hostnames.length === 0) return null;

    let extraParams = 'ssl=true&authSource=admin&retryWrites=true&w=majority';
    const txtRegex = /"([^"]+)"/g;
    let tMatch;
    while ((tMatch = txtRegex.exec(txtOut)) !== null) {
      if (tMatch[1].includes('replicaSet=')) {
        extraParams = `ssl=true&${tMatch[1]}&retryWrites=true&w=majority`;
      }
    }

    return `mongodb://${encodeURIComponent(decodeURIComponent(user))}:${encodeURIComponent(decodeURIComponent(pass))}@${hostnames.join(',')}/${targetDb}?${extraParams}`;
  } catch (e) {
    return null;
  }
}

/**
 * Connect to MongoDB Atlas Database
 * Uses process.env.MONGODB_DIRECT_URI || process.env.MONGODB_URI || process.env.MONGO_URI
 */
export async function connectDB() {
  const directURI = process.env.MONGODB_DIRECT_URI;
  const mongoURI = directURI || process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoURI || mongoURI.includes('YOUR_DATABASE_USER') || mongoURI.includes('YOUR_DATABASE_PASSWORD')) {
    isDbConnected = false;
    console.log('--------------------------------------------------');
    console.warn('⚠️  MongoDB Notice: MONGODB_URI contains default placeholder values in backend/.env');
    console.log('👉 Please replace YOUR_DATABASE_USER, YOUR_DATABASE_PASSWORD, and YOUR_CLUSTER_URL with your actual MongoDB Atlas credentials.');
    console.log('💡 Format: MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/careermatch_ai?retryWrites=true&w=majority');
    console.log('⚡ In-memory demo store is active so you can test features right away.');
    console.log('--------------------------------------------------');
    return;
  }

  let connectionTarget = mongoURI;

  try {
    // Attempt primary connection
    const conn = await mongoose.connect(connectionTarget, {
      serverSelectionTimeoutMS: 5000,
    });

    isDbConnected = true;
    console.log('--------------------------------------------------');
    console.log(`✅ MongoDB Atlas Connected Successfully!`);
    console.log(`📡 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log('--------------------------------------------------');
  } catch (error) {
    // If SRV DNS fails on Windows, automatically fallback to direct shard connection
    if (
      (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEOUT')) &&
      connectionTarget.startsWith('mongodb+srv://')
    ) {
      console.log('🔄 Windows SRV DNS query refused. Resolving Atlas replicaSet directly...');
      const fallbackDirectUri = resolveSrvToDirectUri(connectionTarget);

      if (fallbackDirectUri) {
        try {
          const directConn = await mongoose.connect(fallbackDirectUri, {
            serverSelectionTimeoutMS: 6000,
          });

          isDbConnected = true;
          console.log('--------------------------------------------------');
          console.log(`✅ MongoDB Atlas Connected Successfully (Direct Shard Resolver)!`);
          console.log(`📡 Host: ${directConn.connection.host}`);
          console.log(`🗄️  Database: ${directConn.connection.name}`);
          console.log('--------------------------------------------------');
          return;
        } catch (directErr) {
          console.error(`❌ Direct Shard Connection also failed: ${directErr.message}`);
        }
      }
    }

    isDbConnected = false;
    console.log('--------------------------------------------------');
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    console.log('💡 Verification Checklist:');
    console.log('  1. Check database username and password in backend/.env');
    console.log('  2. Verify Network Access: Allow access from 0.0.0.0/0 in MongoDB Atlas dashboard');
    console.log('  3. Ensure no special characters in password break URI format (URL-encode if necessary)');
    console.log('⚡ In-memory demo store is active as a fallback.');
    console.log('--------------------------------------------------');
  }
}

// Event listeners for connection monitoring
mongoose.connection.on('disconnected', () => {
  isDbConnected = false;
  console.warn('⚠️  MongoDB connection lost. Reconnecting...');
});

mongoose.connection.on('reconnected', () => {
  isDbConnected = true;
  console.log('✅ MongoDB connection re-established.');
});
