import mongoose from "mongoose";

const postingSchema = new mongoose.Schema({
    title: {type: String, require: true},
    content: {type: String, require: true},
    imageUrl: [{type: String}],
    createAt: {type: Date, default: Date.now},
    meta: {
        views: {type:Number, default: 0, required: true},
        rating: {type:Number, default: 0, required: true},
    },
    owner: {type:mongoose.Schema.Types.ObjectId, require: true, ref: "User"},
});

const Posting = mongoose.model("Posting", postingSchema);
export default Posting;