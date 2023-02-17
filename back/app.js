const express = require("express");
const mongoose = require("mongoose");
const app = express();
const rateLimit = require("express-rate-limit");
const sanitize = require("express-mongo-sanitize");
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");
const path = require("path");

// utilisation du limiteur de connexion
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limiter chaque IP à 100 requêtes par `window` (ici, par 15 minutes )
    standardHeaders: true, // Renvoie les informations de limite de débit dans les en-têtes `RateLimit-*`
    legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*`
});

// Applique le middleware de limitation de débit à toutes les requêtes
app.use(limiter);

app.use(express.json());

mongoose.set("strictQuery", false);

// connexion à MongoDB
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_ADDRESS}.mongodb.net/?retryWrites=true&w=majority`,

        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));
console.log(mongoose);
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

// utilisation de express mongo sanitize
app.use(sanitize());

// routes d'autentification
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

//  indique à Express de gérer la ressource images de manière statique
app.use("/images", express.static(path.join(__dirname, "images")));

// export d'app pour pouvoir y accéder à partir d'autres fichiers
module.exports = app;
