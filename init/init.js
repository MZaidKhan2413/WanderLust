const mongoose = require("mongoose");
const Listing = require("../models/listings");
let initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then((res)=>{
    console.log("Connection to DB success");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "65546f99f88febd80b135a4d"}));
    await Listing.insertMany(initData.data);
    console.log("data initialized");
}

initDB();