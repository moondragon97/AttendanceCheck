import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    userId: {type: String, require: true, unique: true},
    password: {type: String},
    name: {type: String, require: true},
    email: {type: String, require: true},
    snum: Number,
    socialOnly: {type: Boolean, default: false},
    avatarUrl: String,
    admin: {type: Boolean, default: false},
    manager: {type: Boolean, default: false},
    penalty: {type: Number, default: 0},
    fee: {type: Number, default: 0},
});

userSchema.pre('save', async function() {
    // 패스워드 해싱
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 5);
    }
});

const User = mongoose.model("User", userSchema);
export default User;