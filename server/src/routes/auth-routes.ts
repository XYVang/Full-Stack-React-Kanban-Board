import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login attempt received:', req.body); // Add logging for incoming request

    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        success: false,
        message: 'Credentials not found' 
      });
    }

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // If user doesn't exist or password is invalid
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid credentials for user:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // JWT token
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    // Ensure a complete JSON response
    console.log('Login successful for user:', username);
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Detailed login error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const router = Router();

// Login a user
router.post('/login', login);

export default router;