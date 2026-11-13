import Chat from '../models/Chat.js';
import { isDbConnected } from '../config/db.js';
import { chatWithCareerAssistant } from '../services/geminiService.js';

// In-memory chat store for offline/demo sessions
const localChats = new Map();

/**
 * Fallback response generator if Gemini key is missing or offline
 */
function getOfflineCareerAdvice(query) {
  const q = query.toLowerCase();
  if (q.includes('improve') || q.includes('resume')) {
    return `Here are the top 4 ways to improve your resume for software engineering internships:
1. **Use Action Verbs & Metrics**: Phrased with the Google X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]".
2. **Feature 2 Solid Projects**: Include GitHub repositories, live deployment links (Vercel/Render), and a list of tech stack components.
3. **Keep it 1 Page**: Use clean, single-column ATS-friendly formatting without fancy columns or graphics.
4. **Highlight Core CS Concepts**: Showcase Data Structures, OOPs, DBMS, and Web Dev competencies.`;
  }
  if (q.includes('interview') || q.includes('prepare')) {
    return `For tech internship interviews as a 2nd/3rd-year student:
1. **Data Structures & Algorithms**: Master Arrays, Strings, Hash Maps, Linked Lists, Trees, and Two-pointer approaches on LeetCode/GeeksforGeeks.
2. **Core Subjects**: Revise OOPs (Polymorphism, Inheritance, Encapsulation), DBMS (SQL queries, Normalization), and OS fundamentals (Threads vs Processes).
3. **Project Deep-Dive**: Be ready to explain why you chose your tech stack, challenges faced, and how your database schema is structured.
4. **STAR Method**: For behavioral questions, prepare stories outlining Situation, Task, Action, and Result.`;
  }
  if (q.includes('frontend') || q.includes('skill')) {
    return `Top skills to learn for a high-impact Frontend Developer internship:
1. **Core Web Fundamentals**: HTML5 Semantic markup, Modern CSS3 (Flexbox, Grid, Tailwind CSS), and modern ES6+ JavaScript.
2. **React Ecosystem**: Functional components, React Hooks (\`useState\`, \`useEffect\`, \`useContext\`), React Router, and state management.
3. **API Integration**: RESTful architecture, \`fetch\` / \`axios\`, handling asynchronous states (loading, error, empty).
4. **Tooling & Version Control**: Git/GitHub, Vite/Webpack, Chrome DevTools debugging.`;
  }
  if (q.includes('2nd-year') || q.includes('second year') || q.includes('college')) {
    return `As a 2nd-year CSE student, your focus should be:
1. **Build 2 Full-Stack Projects**: An end-to-end CRUD application with authentication (like this CareerMatch AI or an E-Commerce / Task manager).
2. **Coding Practice**: Solve 100-150 medium DSA questions across Arrays, HashMaps, and Binary Trees.
3. **Open Source & Hackathons**: Participate in college hackathons or contribute documentation/bug-fixes on GitHub.
4. **Networking**: Keep an updated LinkedIn profile and reach out to alumni for internship referral opportunities.`;
  }
  return `Great question! When targeting developer roles:
- Focus on demonstrating demonstrable hands-on skills with clean, readable code on GitHub.
- Practice explaining technical trade-offs (e.g., why MongoDB vs PostgreSQL, or React vs vanilla JS).
- Make sure your projects solve a genuine problem with measurable features.
Feel free to ask more specific questions about resume bullet points, interview questions, or project architecture!`;
}

/**
 * POST /api/chat/message
 * Send a message to the AI career assistant
 */
export async function sendMessage(req, res) {
  try {
    const { message } = req.body;
    const userId = req.user._id || req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.',
      });
    }

    let existingMessages = [];

    // Load existing conversation
    if (isDbConnected) {
      const chatDoc = await Chat.findOne({ userId });
      if (chatDoc) {
        existingMessages = chatDoc.messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
      }
    } else {
      existingMessages = localChats.get(String(userId)) || [];
    }

    // Append new user message
    const conversation = [...existingMessages, { role: 'user', content: message.trim() }];

    let aiReply = '';
    try {
      aiReply = await chatWithCareerAssistant(conversation, req.user);
    } catch (aiErr) {
      console.warn('Gemini chat warning, using offline advice:', aiErr.message);
      aiReply = getOfflineCareerAdvice(message);
    }

    const newAssistantMessage = {
      role: 'assistant',
      content: aiReply,
      timestamp: new Date(),
    };

    // Save conversation
    if (isDbConnected) {
      let chatDoc = await Chat.findOne({ userId });
      if (!chatDoc) {
        chatDoc = new Chat({ userId, messages: [] });
      }
      chatDoc.messages.push({ role: 'user', content: message.trim() });
      chatDoc.messages.push(newAssistantMessage);
      await chatDoc.save();

      return res.json({
        success: true,
        reply: aiReply,
        messages: chatDoc.messages,
      });
    } else {
      const updatedList = [
        ...existingMessages,
        { role: 'user', content: message.trim(), timestamp: new Date() },
        newAssistantMessage,
      ];
      localChats.set(String(userId), updatedList);

      return res.json({
        success: true,
        reply: aiReply,
        messages: updatedList,
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to communicate with Career Assistant.',
      error: error.message,
    });
  }
}

/**
 * GET /api/chat/history
 * Fetch previous chat messages
 */
export async function getChatHistory(req, res) {
  try {
    const userId = req.user._id || req.user.id;

    if (isDbConnected) {
      const chatDoc = await Chat.findOne({ userId });
      return res.json({
        success: true,
        messages: chatDoc ? chatDoc.messages : [],
      });
    } else {
      const messages = localChats.get(String(userId)) || [];
      return res.json({
        success: true,
        messages,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch chat history.' });
  }
}

/**
 * DELETE /api/chat/clear
 * Clear chat history
 */
export async function clearChatHistory(req, res) {
  try {
    const userId = req.user._id || req.user.id;

    if (isDbConnected) {
      await Chat.findOneAndDelete({ userId });
    } else {
      localChats.delete(String(userId));
    }

    return res.json({
      success: true,
      message: 'Chat history cleared successfully.',
      messages: [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear chat history.' });
  }
}

