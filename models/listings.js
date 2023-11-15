const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    description: String,
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: [
            "mountains", "beach", "rooms", "tents", "farms", "arctic", "historical", "boats", "resorts", "lakes"
        ],
        lowecase: true,
    }
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;