const passwordValidator = require("password-validator");
const passwordSchema = new passwordValidator();

//  Le schema doit respecter le mot de passe
passwordSchema
    .is()
    .min(5) // Minimum 5 caractères
    .is()
    .max(100) // Maximum 100 caractères
    .has()
    .uppercase() // Au moins une lettre majuscule
    .has()
    .lowercase() // Au moins une lettre minuscule
    .has()
    .digits(2) // Doit avoir au moins 2 chiffre
    .has()
    .not()
    .spaces() // Pas d'espace autorisé
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(400).json({
            error: `Le mot de passe n'est pas assez fort ${passwordSchema.validate(
                "req.body.password",
                { list: true }
            )}`,
        });
    }
};
