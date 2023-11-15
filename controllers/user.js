const User = require("../models/user");

module.exports.renderSignUp = (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.postSignUp = async (req, res)=>{
    try {
        let {username, email, password} = req.body;
        const newUser = new User ({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome To WanderLust');
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.postLogin = async (req, res)=>{
    let REDIRECT_URL = res.locals.redirectUrl || "/listings";
    req.flash('success', 'Welcome Back to WanderLust');
    res.redirect(REDIRECT_URL);
};

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash('success', 'You Logged Out Successfully');
        res.redirect("/listings");
    })
};