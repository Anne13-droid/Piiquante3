const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");
const path = require("path");

app.use(express.json());

mongoose.set("strictQuery", false);

// connexion à MongoDB
mongoose
    .connect(
        "mongodb+srv://Anne_P6:GydovO5FPS6vnrAh@cluster0.altqyqb.mongodb.net/?retryWrites=true&w=majority",

        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

// routes d'autentification
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

//  indique à Express de gérer la ressource images de manière statique
app.use("/images", express.static(path.join(__dirname, "images")));

// export d'app pour pouvoir y accéder à partir d'autres fichiers
module.exports = app;
