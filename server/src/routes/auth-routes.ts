import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Received login request:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));

    const { username, password } = req.body;

    if (!username || !password) {
      console.error('Missing credentials');
      return res.status(400).json({ 
        success: false,
        message: 'Credentials not found' 
      });
    }

    // Find the user by username
    const user = await User.findOne({ 
      where: { username },
      raw: true 
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.error('No user found with username:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', isPasswordValid);

    if (!isPasswordValid) {
      console.error('Invalid password for user:', username);
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

    console.log('Login successful, sending response');
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Detailed login error:', error);
    res.status(500).json({ 
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