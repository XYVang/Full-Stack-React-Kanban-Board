import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
    // Get authorization header
    const authHeader = req.headers['authorization'];
    // Extract the token
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        // Check the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add user data
        req.user = decoded;
        next();
        return;
    }
    catch (error) {
        // If token invalid return error msg
        return res.status(403).json({ message: 'Invalid token.' });
    }
};
