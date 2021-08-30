import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    return res.render("join", {titleName: "회원가입"});
};

export const postJoin = async (req, res) => {
    const {userId, password, passwordConfirmation, name, email} = req.body;
    if(password !== passwordConfirmation){
        return res.status(400).render("join", {titleName: "회원가입", errorMessage: "비밀번호가 일치하지 않습니다."});
    }
    const exists = await User.exists({$or: [{userId}, {email}]});
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
        return res.redirect("/login");
    }catch(error){
        return res.status(400).render("join", {titleName: "회원가입", errorMessage: error,})
    }
};


// /login render
export const getLogin = (req, res) => {
    return res.render("login", {titleName: "로그인"});
};

// 로그인 검사 및 처리
export const postLogin = async (req, res) => {
    const {userId, password} = req.body;
    const user = await User.findOne({userId});
    if(!user){
        return res.status(400).render("login", {titleName: "로그인", errorMessage: "해당 아이디가 존재하지 않습니다."});
    }
    
    const accord = await bcrypt.compare(password, user.password);
    if(!accord){
        return res.status(400).render("login", {titleName: "로그인", errorMessage: "해당 아이디와 비밀번호가 일치하지 않습니다."});
    }
    req.session.loggedIn = true;
    req.session.loggedInUser = user;
    return res.redirect("/");
}

// 로그아웃 처리
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}

export const getAttendance = (req, res) => {
    const {loggedInUser} = req.session;
    if(!req.session.loggedIn){
        return res.redirect("/login");
    }
    return res.render("attendance", {titleName: "출석체크", user:loggedInUser});
}

export const postAttendance = async (req, res) => {
    const {loggedInUser: {_id}} = req.session;
    const user = await User.findByIdAndUpdate(_id, {attendance: true});
    user.attendance = true;
    req.session.loggedInUser = user;
    return res.redirect("/user/attendance");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const config = {
        client_id: process.env.GITHUB_CLIENTID,
        allow_signup: true,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GITHUB_CLIENTID,
        client_secret: process.env.GITHUB_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const data = await fetch(finalUrl, {
        method:"POST"
    })
    const json = await data.json();
};