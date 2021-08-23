import User from "../models/User"

export const getJoin = (req, res) => {
    return res.render("join", {titleName: "회원가입"});
};

export const postJoin = async (req, res) => {
    const {userId, password, passwordConfirmation, name, email} = req.body;
    if(password !== passwordConfirmation){
        return res.status(400).render("join", {titleName: "회원가입", errorMessage: "비밀번호가 일치하지 않습니다."});
    }
    const exists = await User.exists({$or: [{name}, {email}]});
    if(exists){
        return res.status(400).render("join", {titleName: "회원가입", errorMessage: "이미 일치하는 아이디나 이메일이 있습니다."});
    }
    try{
        const user = await User.create({
            userId,
            password,
            name,
            email,
        });
        console.log(user);
        return res.redirect("/login");
    }catch(error){
        return res.status(400).render("join", {titleName: "회원가입", errorMessage: error,})
    }
};

export const getLogin = async (req, res) => {
    return res.render("login", {titleName: "로그인"});
};

export const postLogin = async (req, res) => {

    return res.redirect("/");
}