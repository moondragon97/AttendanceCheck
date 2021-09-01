import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    userId: {type: String, require: true, unique: true},
    password: {type: String},
    name: {type: String, require: true},
    email: {type: String, require: true},
    attendance: {type: Boolean, default: false},
    socialOnly: {type: Boolean, default: false},
    avatarUrl: String,
});

userSchema.pre('save', async function() {
    console.log("pre", this.password);
    if(this.isModified("password")){
        console.log("hashing");
        this.password = await bcrypt.hash(this.password, 5);
    }
    console.log("afther", this.password);
});

const User = mongoose.model("User", userSchema);
export default User;