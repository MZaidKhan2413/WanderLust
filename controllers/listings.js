const Listing = require("../models/listings");

module.exports.index = async (req, res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.postNewListing = async (req, res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.image = {url, filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'New Listing Added');
    res.redirect("/listings");
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash('error', 'Listing You Requested For Does Not Exists!');
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash('error', 'Listing You Requested For Does Not Exists!');
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res)=>{
    let { id } = req.params;
    let listing = req.body.listing;
    let updatedListing =  await Listing.findByIdAndUpdate(id, {...listing});
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url, filename};
        await updatedListing.save();
    }
    req.flash('success', 'Listing Updated');
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success', 'Listing Deleted');
    res.redirect("/listings");
};

module.exports.search = async (req, res)=>{
    let {location} = req.query;
    let queryObject = {};
    if(location) {
       queryObject.location = { $regex: location , $options: "i" };
    }
    let searchedListings = await Listing.find(queryObject);
    res.render("listings/index.ejs", {allListings: searchedListings});
};

module.exports.filters = async (req, res)=>{
    let {filterId} = req.params;
    let filterListing = await Listing.find({category: filterId});
    res.render("listings/index.ejs", {allListings: filterListing});

};