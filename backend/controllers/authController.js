import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import { isDbConnected } from '../config/db.js';
import { JWT_SECRET } from '../middleware/auth.js';

// In-memory demo user cache for when MongoDB is not connected
const localUsers = new Map();

/**
 * Auto-seeds or retrieves the primary demo student account & sample resume.
 * Ensures 1-Click Quick Demo Access works 100% reliably in both MongoDB and offline modes.
 */
export async function ensureDemoAccount() {
  const demoEmail = 'demo.student@college.edu';
  const defaultUserFields = {
    name: 'Rahul Sharma',
    email: demoEmail,
    college: 'National Institute of Technology',
    education: 'B.Tech in Computer Science and Engineering (2nd Year)',
    skills: ['JavaScript', 'React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'MongoDB', 'Python', 'C++', 'Git', 'SQL'],
    careerInterests: ['Software Development Engineer', 'Frontend Developer', 'Full Stack Developer'],
  };

  if (isDbConnected) {
    try {
      let demoUser = await User.findOne({ email: demoEmail });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('demo123456', salt);

      if (!demoUser) {
        demoUser = await User.create({
          ...defaultUserFields,
          password: hashedPassword,
        });
        console.log('✅ Demo student account auto-seeded in MongoDB Atlas: demo.student@college.edu');
      }

      // Check if demo user has a resume seeded
      const resumeCount = await Resume.countDocuments({ userId: demoUser._id });
      if (resumeCount === 0) {
        await Resume.create({
          userId: demoUser._id,
          filename: 'Resume For My Interview.pdf',
          fileSize: 89088,
          extractedText: `Rahul Sharma
Computer Science Engineering Student | National Institute of Technology
Email: demo.student@college.edu | GitHub: github.com/rahulsharma | LinkedIn: linkedin.com/in/rahulsharma

EDUCATION:
B.Tech in Computer Science and Engineering (2024 - 2028)
CGPA: 8.7/10 | Coursework: Data Structures, Algorithms, Object Oriented Programming, DBMS, Web Development

TECHNICAL SKILLS:
Languages: JavaScript (ES6+), Python, C++, HTML5, CSS3, SQL
Frameworks & Libraries: React.js, Tailwind CSS, Node.js, Express.js, Redux Toolkit
Databases & Tools: MongoDB, Git, GitHub, Postman, Vite, VS Code

PROJECTS:
1. CareerMatch AI - Resume & Job Matching Portal (React, Node.js, Tailwind, MongoDB)
- Developed an intelligent ATS resume analyzer evaluating resumes with 11-point rubric checks.
- Engineered job matching engine comparing candidate profiles against custom company requirements.
- Integrated modern monochrome dashboard UI with real-time scoring.

2. E-Commerce Web Application (React, Express, MongoDB)
- Built complete user shopping flow with JWT authentication, cart state management, and product search.
- Designed responsive interfaces with Tailwind CSS and optimized backend REST API latency.`,
          resumeScore: 80,
          skills: {
            technical: ['JavaScript', 'React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'MongoDB', 'Git', 'Python', 'SQL'],
            soft: ['Problem Solving', 'Team Collaboration', 'Communication', 'Time Management'],
            tools: ['VS Code', 'GitHub', 'Postman', 'Vite'],
            missing: ['TypeScript', 'Docker', 'AWS / Cloud Deployment', 'Unit Testing (Jest)']
          },
          strengths: [
            'Strong full-stack project experience featuring React.js and Node.js',
            'Solid foundational CS coursework with verified Data Structures and DBMS knowledge',
            'Clean, modern technical stack aligned with entry-level and internship expectations'
          ],
          weaknesses: [
            'Add TypeScript and Docker to demonstrate production-readiness',
            'Include quantified performance metrics in project descriptions'
          ],
          educationAnalysis: 'Enrolled in B.Tech Computer Science with an 8.7 CGPA. Foundational CS subjects are strong.',
          experienceAnalysis: 'Strong portfolio of hands-on full stack web applications demonstrating end-to-end architecture.',
          projectAnalysis: 'Projects demonstrate real-world proficiency with React, Node.js, REST APIs, and database integration.',
          atsCompatibility: {
            score: 82,
            suggestions: [
              'Maintain standard single-column layout for highest ATS parse accuracy',
              'Feature GitHub and live deployment links prominently'
            ]
          },
          suggestions: [
            'Learn TypeScript to upgrade project repositories',
            'Add unit tests using Jest or React Testing Library'
          ]
        });
        console.log('✅ Demo resume "Resume For My Interview.pdf" auto-seeded in MongoDB Atlas.');
      }

      return demoUser;
    } catch (e) {
      console.warn('⚠️ Demo account auto-seeding warning:', e.message);
    }
  }

  // Fallback in-memory demo user object
  return {
    _id: 'demo_student_id_101',
    ...defaultUserFields,
  };
}

/**
 * Helper to generate JWT token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      college: user.college,
      education: user.education,
      skills: user.skills,
      careerInterests: user.careerInterests,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}


/**
 * POST /api/auth/register
 * Register a new user
 */
export async function register(req, res) {
  try {
    const { name, email, password, college, education, skills, careerInterests } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isDbConnected) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        college: college || '',
        education: education || 'B.Tech in Computer Science and Engineering',
        skills: Array.isArray(skills) ? skills : [],
        careerInterests: Array.isArray(careerInterests) ? careerInterests : ['Software Development'],
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          education: user.education,
          skills: user.skills,
          careerInterests: user.careerInterests,
        },
      });
    } else {
      // Offline / In-memory fallback
      if (localUsers.has(email.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const localUser = {
        _id: `user_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        college: college || 'National Institute of Technology',
        education: education || 'B.Tech in Computer Science (2nd Year)',
        skills: skills || ['JavaScript', 'React', 'Node.js', 'Python'],
        careerInterests: careerInterests || ['Software Development', 'Frontend Engineer'],
      };

      localUsers.set(email.toLowerCase(), localUser);
      const token = generateToken(localUser);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully (Local Session)!',
        token,
        user: localUser,
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
}

/**
 * POST /api/auth/login
 * Sign in existing user
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected) {
      let user = await User.findOne({ email: normalizedEmail });

      // Special auto-provisioning for Quick Demo Access: guaranteed 1-click access
      if (normalizedEmail === 'demo.student@college.edu') {
        if (!user) {
          user = await ensureDemoAccount();
        } else if (password === 'demo123456') {
          // Ensure demo password matches demo123456
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash('demo123456', salt);
            await user.save();
          }
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch && normalizedEmail !== 'demo.student@college.edu') {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      // Ensure demo account always has a pre-analyzed sample resume in MongoDB
      if (normalizedEmail === 'demo.student@college.edu') {
        await ensureDemoAccount();
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'Logged in successfully!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          education: user.education,
          skills: user.skills,
          careerInterests: user.careerInterests,
        },
      });
    } else {
      // Local fallback
      if (normalizedEmail === 'demo.student@college.edu') {
        const demoUser = await ensureDemoAccount();
        return res.json({
          success: true,
          message: 'Logged in as Demo Student!',
          token: generateToken(demoUser),
          user: demoUser,
        });
      }

      const localUser = localUsers.get(normalizedEmail);
      if (localUser) {
        const isMatch = await bcrypt.compare(password, localUser.password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        return res.json({
          success: true,
          message: 'Logged in successfully (Local)!',
          token: generateToken(localUser),
          user: localUser,
        });
      }

      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
}

/**
 * POST /api/auth/demo
 * 1-Click Instant Demo Access endpoint
 */
export async function demoAccess(req, res) {
  try {
    const demoUser = await ensureDemoAccount();
    const token = generateToken(demoUser);

    return res.json({
      success: true,
      message: '1-Click Demo Access granted!',
      token,
      user: {
        id: demoUser._id || demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        college: demoUser.college,
        education: demoUser.education,
        skills: demoUser.skills,
        careerInterests: demoUser.careerInterests,
      },
    });
  } catch (error) {
    console.error('Demo access error:', error);
    res.status(500).json({ success: false, message: 'Failed to initialize demo session.' });
  }
}


/**
 * GET /api/auth/profile
 * Get current authenticated user profile
 */
export async function getProfile(req, res) {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving profile.' });
  }
}

/**
 * PUT /api/profile
 * Update current user profile
 */
export async function updateProfile(req, res) {
  try {
    const { name, college, education, skills, careerInterests } = req.body;
    const userId = req.user._id || req.user.id;

    if (isDbConnected) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (name) user.name = name;
      if (college !== undefined) user.college = college;
      if (education !== undefined) user.education = education;
      if (Array.isArray(skills)) user.skills = skills;
      if (Array.isArray(careerInterests)) user.careerInterests = careerInterests;

      await user.save();

      return res.json({
        success: true,
        message: 'Profile updated successfully!',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          education: user.education,
          skills: user.skills,
          careerInterests: user.careerInterests,
        },
      });
    } else {
      // Local update
      const updated = {
        ...req.user,
        name: name || req.user.name,
        college: college !== undefined ? college : req.user.college,
        education: education !== undefined ? education : req.user.education,
        skills: Array.isArray(skills) ? skills : req.user.skills,
        careerInterests: Array.isArray(careerInterests) ? careerInterests : req.user.careerInterests,
      };

      return res.json({
        success: true,
        message: 'Profile updated successfully!',
        user: updated,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile.' });
  }
}

