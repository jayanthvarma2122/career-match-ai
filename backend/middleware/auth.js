import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'careermatch_secret_jwt_key_2026';

/**
 * Authentication Middleware
 * Verifies JWT token in the Authorization header
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (isDbConnected) {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'User belonging to this token no longer exists.',
          });
        }
        req.user = user;
      } else {
        // Fallback user context for offline session
        req.user = {
          _id: decoded.id || 'demo_student_id_101',
          name: decoded.name || 'Rahul Sharma',
          email: decoded.email || 'rahul.cse@college.edu',
          college: decoded.college || 'National Institute of Technology',
          education: decoded.education || 'B.Tech in Computer Science (2nd Year)',
          skills: decoded.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'Data Structures', 'SQL'],
          careerInterests: decoded.careerInterests || ['Software Development Engineer', 'Frontend Developer'],
        };
      }

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please sign in again.',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Authentication error.' });
  }
}

// Aliases for route flexibility
export const protect = authenticate;
export default authenticate;
