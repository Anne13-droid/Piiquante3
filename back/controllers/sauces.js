const Sauces = require("../models/Sauces");
const fs = require("fs");

// Créer une sauce
exports.createSauces = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject);

    // supprimer l'id car il va être automatiquement généré par la base de donnée
    delete sauceObject._id;
    // userId (personne qui a crée l'objet) à la place on va utiliser le token d'authentification du userId
    delete sauceObject.userId;
    const sauce = new Sauces({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    });

    sauce
        .save()
        .then(() => res.status(201).json({ message: "Object enregistré" }))
        .catch((error) => res.status(400).json({ error }));
};

// Modifier une sauce
exports.modifySauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauces) => {
            console.log(sauces);
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({ message: "Non autorisé !" });
            } else {
                let sauceObject;
                if (req.file) {
                    const filename = sauces.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${filename}`, (error) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                    sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get(
                            "host"
                        )}/images/${req.file.filename}`,
                    };
                } else {
                    sauceObject = { ...req.body };
                }
                console.log("contenu de sauceObject this.modifySauces");
                console.log(sauceObject);

                delete sauceObject._userId;

                Sauces.updateOne(
                    { _id: req.params.id },
                    { ...sauceObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: "Objet modifié !" })
                    )
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// supprimer une sauce
exports.deleteSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauces) => {
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({ message: "Non autorisé" });
            } else {
                const filename = sauces.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    sauces
                        .deleteOne({ _id: req.params.id })
                        .then(() =>
                            res.status(200).json({ message: "Objet suprimé !" })
                        )
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

exports.getOneSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(400).json({ error }));
};
