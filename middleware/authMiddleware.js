const jwt = require("jsonwebtoken")


const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
        res.status(400).json({ message: "Not authorized , No token" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded  
        next()
    }
    catch (error) {
        res.status(401).json({ message: "Token Invalid" })
    }
}

module.exports=protect