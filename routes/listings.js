const express = require("express");
const router = new express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const { isLoggedIn, isOwner } = require("../middleware");
const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listings");

// Validation Using JOI
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

router.route("/")
    .get(wrapAsync(ListingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.postNewListing));

router.get("/new", isLoggedIn, ListingController.renderNewForm);

router.get("/results", ListingController.search);

router.route("/:id")
    .get(wrapAsync(ListingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing))

router.get("/:id/edit", isLoggedIn, wrapAsync(ListingController.renderEditForm));

router.get("/filter/:filterId", ListingController.filters);

module.exports = router;