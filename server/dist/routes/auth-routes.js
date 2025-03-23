import { Router } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        // Find the user by username
        const user = await User.findOne({ where: { username } });
        // If user doesn't exist return error msg
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check valid password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // JWT token
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
        // Return token
        return res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
const router = Router();
// POST /login - Login a user
router.post('/login', login);
export default router;
