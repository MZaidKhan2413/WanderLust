const express = require("express");
const router = new express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const {reviewSchema} = require("../schema");
const {isLoggedIn, isReviewAuthor} = require("../middleware");
const ReviewController = require("../controllers/reviews.js");

const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Post Review Route
router.post("/", validateReview, isLoggedIn, wrapAsync(ReviewController.postReview)); 

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.destroyReview));

module.exports = router;
