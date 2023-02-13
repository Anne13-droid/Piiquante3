const Sauces = require("../models/Sauces");

exports.createLike = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((likeObject) => {
            console.log(likeObject);

            switch (req.body.like) {
                case 1: //  like = 1
                    if (
                        !likeObject.usersLiked.includes(req.body.userId) &&
                        req.body.like === 1
                    ) {
                        console.log("les instructions seront exécutées");

                        Sauces.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: 1 },
                                $push: { usersLiked: req.body.userId },
                            }
                        )
                            .then(() =>
                                res.status(201).json({ message: "Like + 1" })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;

                case -1:
                    // dislike = 1
                    if (
                        !likeObject.usersDisliked.includes(req.body.userId) &&
                        req.body.like === -1
                    ) {
                        console.log(
                            "userId est dans usersDisliked et like = 1"
                        );

                        Sauces.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: 1 },
                                $push: { usersDisliked: req.body.userId },
                            }
                        )
                            .then(() =>
                                res
                                    .status(201)
                                    .json({ message: "Dislike = + 1 " })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;

                case 0:
                    // like = 0
                    if (likeObject.usersLiked.includes(req.body.userId)) {
                        console.log("userId est dans userLiked et like = 0");

                        Sauces.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId },
                            }
                        )
                            .then(() =>
                                res.status(201).json({ message: "Like 0" })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }

                    // dislike = 0
                    if (likeObject.usersDisliked.includes(req.body.userId)) {
                        console.log(
                            "userId est dans usersDisliked et like = 0"
                        );

                        Sauces.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId },
                            }
                        )
                            .then(() =>
                                res.status(201).json({ message: "dislike = 0" })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;
            }
        })
        .catch((error) => res.status(404).json({ error }));
};
