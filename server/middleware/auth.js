import jwt from 'jsonwebtoken';

export const requireAuth = (req,res,next) => {
    try {
        const header = req.headers.authorization;
        if(!header || !header.startsWith("Bearer ")){
            res.status(401).json({message : "Authentication required"});
            return;
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded;
        next();
        
    } catch (error) {
        
    }
}