const jwt = require('jsonwebtoken');

const auth = (role)=>{
return (req, res, next) => 
    
    {
    const tokenHeader = req.header('Authorization');  
    if (!tokenHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = tokenHeader.replace('Bearer ', '').trim();

    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 

           if (role) {
                if (decoded.role === role) {
                    return next();
                } else {
                    return res.status(403).json({ message: 'Unauthorized access' });
                }
            }

            return next();
       
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired, please log in again' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};
}
module.exports = { auth };
