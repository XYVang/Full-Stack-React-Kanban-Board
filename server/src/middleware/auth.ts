import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get authorization header
  const authHeader = req.headers['authorization'];
  
  // Extract the token
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Check the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // Add user data
    req.user = decoded;
    
    next();
    return;
  } catch (error) {
    // If token invalid return error msg
    return res.status(403).json({ message: 'Invalid token.' });
  }
};