const express = require("express");
const router = new express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const UserController = require("../controllers/user");

router.get("/", UserController.root);

router.route("/signup")
    .get(UserController.renderSignUp)
    .post(wrapAsync(UserController.postSignUp));

router.route("/login")
    .get(UserController.renderLogin)
    .post(saveRedirectUrl, passport.authenticate('local', {failureRedirect: "/login", failureFlash: true}), UserController.postLogin);

router.get("/logout", UserController.logout);

module.exports = router;