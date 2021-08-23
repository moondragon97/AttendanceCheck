import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    userId: {type: String, require: true, unique: true},
    password: {type: String},
    name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    attendance: Boolean,
});

userSchema.pre('save', async function() {
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, 5);
    console.log(this.password);
});

const User = mongoose.model("User", userSchema);
export default User;