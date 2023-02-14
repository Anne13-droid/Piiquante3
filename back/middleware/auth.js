const jwt = require("jsonwebtoken");
const validator = require("email-validator");

// package pour utiliser les variable d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

validator.validate("test@email.com");
// requête d'autentification
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, `${process.env.TOKEN}`);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
