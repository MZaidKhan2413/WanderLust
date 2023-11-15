if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methpdOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const path = require("path");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const listingRouter = require("./routes/listings");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/user");
const port = 8080;

const MONGO_URL = process.env.ATLASDB_URL;

main().then((res)=>{
    console.log("Connection to DB success");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methpdOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);


const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24*3600,
})

store.on("error", ()=>{
    console.log("Error in MONGO SESSSION STORE: ",err);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware
app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});


// Routers
app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.get("/terms", (req, res)=>{
    let message = "No Terms for now!"
    res.render("information.ejs", {message});
})
app.get("/privacy", (req, res)=>{
    let message = "No Privacy Terms for now!"
    res.render("information.ejs", {message});
})

// Error Handeling Middleware
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found !"));
})

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
})

// App listener
app.listen(port, ()=>{
    console.log("App listening at port: "+port);
})