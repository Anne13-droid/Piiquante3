const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// hachage des mots de passe et enregistrement sur le site
exports.signup = (req, res, next) => {
    console.log("contenu signup: req.body.email");
    console.log(req.body.email);
    console.log("contenu signup: req.body.password");
    console.log(req.body.password);
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() =>
                    res.status(201).json({ message: "Utilisateur créé !" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// trouver si le login existe et connexion avec identifiant et mot de passe
exports.login = (req, res, next) => {
    console.log("contenu login: req.body.email");
    console.log(req.body.email);
    console.log("contenu login: req.body.password");
    console.log(req.body.password);

    // si mail user n'existe pas
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                res.status(401).json({
                    message: "Paire identifiant/mot de passe incorrecte",
                });
            } else {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        console.log(valid);
                        if (!valid) {
                            res.status(401).json({
                                message:
                                    "Paire identifiant/mot de passe incorrecte",
                            });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.TOKEN,
                                    { expiresIn: "24h" }
                                ),
                            });
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({ error });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};
