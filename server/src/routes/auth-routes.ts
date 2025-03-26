import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log('===== LOGIN REQUEST =====');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('Request Headers:', JSON.stringify(req.headers, null, 2));

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.error('Missing credentials');
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }

    // Find the user by username
    const user = await User.findOne({ 
      where: { username },
      raw: true 
    });

    console.log('User lookup result:', user ? 'User found' : 'No user found');

    if (!user) {
      console.error('No user found with username:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' 
      });
    }

    // Password validation
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', isPasswordValid ? 'Successful' : 'Failed');

    if (!isPasswordValid) {
      console.error('Invalid password for user:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    console.log('===== LOGIN SUCCESSFUL =====');
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('===== LOGIN ERROR =====');
    console.error('Detailed error:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const router = Router();

// Login route
router.post('/login', login);

export default router;