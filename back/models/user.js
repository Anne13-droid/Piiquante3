const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// modèle de base de donnée pour le signup et le login
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);
