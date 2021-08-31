import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    userId: {type: String, require: true, unique: true},
    password: {type: String},
    name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    attendance: {type: Boolean, default: false},
    socialOnly: {type: Boolean, default: false},
    avatarUrl: String,
});

userSchema.pre('save', async function() {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 5);
    }
});

const User = mongoose.model("User", userSchema);
export default User;