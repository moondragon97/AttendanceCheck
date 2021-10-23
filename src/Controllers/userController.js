import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import Calendar from "../models/Calendar";

// 회원가입 GET
export const getJoin = (req, res) => {
    return res.render("join", {titleName: "회원가입"});
};

// 회원가입 POST
export const postJoin = async (req, res) => {
    const {userId, password, passwordConfirmation, name, email, snum} = req.body;
    if(password !== passwordConfirmation){
        return res.status(400).render("join", {titleName: "회원가입", errorMessage: "비밀번호가 일치하지 않습니다."});
    }
    const exists = await User.exists({userId});
    if(exists){
        return res.status(400).render("join", {titleName: "회원가입", errorMessage: "해당 아이디는 이미 존재합니다."});
    }
    try{
        await User.create({
            userId,
            password,
            name,
            snum,
            email,
        });
        return res.redirect("/login");
    }catch(error){
        return res.status(400).render("join", {titleName: "회원가입", errorMessage: error,})
    }
};


// 로그인 GET
export const getLogin = (req, res) => {
    return res.render("login", {titleName: "로그인"});
};

// 로그인 POST
export const postLogin = async (req, res) => {
    const {userId, password} = req.body;
    const user = await User.findOne({userId, socialOnly: false});
    if(!user){
        return res.status(400).render("login", {titleName: "로그인", errorMessage: "해당 아이디가 존재하지 않습니다."});
    }
    
    const accord = await bcrypt.compare(password, user.password);
    if(!accord){
        return res.status(400).render("login", {titleName: "로그인", errorMessage: "해당 아이디와 비밀번호가 일치하지 않습니다."});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

// 로그아웃 처리
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

// 출석체크 GET
export const getAttendance = async (req, res) => {
    const {_id} = req.session.user;
    const todayDate = new Date().toLocaleDateString();
    const todayDataObject = await Calendar.findOne({date: todayDate}).populate("user");
    
    // 당일날의 데이터 객체 배열이 생성이 되어 있는지
    if(!todayDataObject){
        return res.render("attendance", {titleName: "출석체크", isAttendanceCheck: false});
    }
    
    const user = todayDataObject.attendance.find(i=>i.user==_id);
    
    // 유저가 당일날 출석체크 했는지
    if(!user){
        return res.render("attendance", {titleName: "출석체크", isAttendanceCheck: false});
    }

    const attendanceTime = user.time
    return res.render("attendance", {titleName: "출석체크", isAttendanceCheck: true, attendanceTime});
};

// 출석체크 POST
export const postAttendance = async (req, res) => {
    const {_id} = req.session.user;
    const todayDate = new Date().toLocaleDateString();
    const todayDataObject = await Calendar.findOne({date: todayDate}).populate("user");
    const attendance = {user: _id, time: new Date().toLocaleTimeString()};

    // 당일 정보의 출석 데이터 객체 배열이 생성이 안 되어 있으면 생성
    if(!todayDataObject){
        await Calendar.create({
            date: todayDate,
            attendance: attendance,
        });
    }else{
        const index = todayDataObject.attendance.find(i=>i.user==_id);
        
        // 출석 데이터 객체 배열에 해당 객체가 이미 존재하면 해당 링크로 다시 돌려 보낸다.
        if(index){
            return res.redirect("/user/attendance");    
        }

        // 출석 완료
        todayDataObject.attendance.push(attendance);
        todayDataObject.save();
    }
    return res.redirect("/user/attendance");
};

export const getAttendanceCheck = async (req, res) => {
    const attendanceDatas = await Calendar.find({}).populate("attendance.user");
    return res.render("check-attendance", {titleName: "출석현황", attendanceDatas});
};

// 깃허브에 계정의 접근을 요청하기 위해 해당 URL로 이동한다.
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
    
    // 깃허브로 로그인하기 위해 토큰이 필요하다.
    // 밑의 코드는 토큰을 받기 위한 URL이다. 
    const finalUrl = `${baseUrl}?${params}`;

    // 밑의 코드는 위의 URL로 fetch를 통해 토큰을 요청했고, 그 토큰 정보들을 json화 시켰다.
    const tokenRequest = await (await fetch(finalUrl, {
        method:"POST",
        headers: {
            Accept: "application/json",
        },
    })
    ).json();

    // 토큰을 받았는지
    if("access_token" in tokenRequest){
        const apiUrl = "https://api.github.com";
        const {access_token} = tokenRequest;
        // https://api.github.com/user로 해당 토큰을 통해서 요청을 한다. 그리고 josn화 시켜서 userRequest 오브젝트에 유저의 정보가 저장된다.
        const userData = await (await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            }
        })).json();
        const emailData = await (await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            }
        })).json();
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
        
        let user = await User.findOne({userId: `${userData.login}@github.com`});
        if (!user) {
            user = await User.create({
                userId: `${userData.login}@github.com`,
                password: "",
                name: userData.name ? userData.name : userData.login,
                email: emailObj.email,
                socialOnly: true,
                snum: 1651008,
                avatarUrl: userData.avatar_url,               
                });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }else{
        return res.redirect("/login");
    }
};

// 프로필 GET
export const getProfile = async (req, res) => {
    return res.render("profile", {titleName: "프로필"});
};

// 프로필 수정 GET
export const getProfileEdit = (req, res) => {
    const {_id} = req.session.user;
    const paramId = req.params.id;
    if(_id != paramId){
        return res.redirect("/");
    }
    return res.render("edit-profile", {titleName: "정보수정"});
};

// 프로필 수정 POST
export const postProfileEdit = async (req, res) => {
    const {body:{name, email, snum}, file} = req;
    const {_id, avatarUrl} = req.session.user;
    const updateUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        email,
        name,
        snum, 
    }, {new: true});
    console.log(updateUser);
    req.session.user = updateUser;
    return res.redirect(`/user/${_id}`);
};

// 비밀번호 수정 GET
export const getPasswordEdit = (req, res) => {
    const {_id} = req.session.user;
    const paramId = req.params.id;
    if(_id != paramId){
        return res.redirect("/");
    }
    return res.render("edit-password", {titleName: "비민번호 변경"});
};

// 비밀번호 수정 POST
export const postPasswordEdit = async (req, res) => {
    const {_id} = req.session.user;
    const {oldPassword, newPassword, passwordConfirmation} = req.body;

    const userData = await User.findById(_id);
    const same = bcrypt.compare(oldPassword, userData.password)
    if(!same){
        return res.render("edit-password", {titleName: "비민번호 변경", errorMessage: "입력한 비밀번호가 기존의 비밀번호와 일치합니다."});
    }

    if(newPassword !== passwordConfirmation){
        return res.render("edit-password", {titleName: "비민번호 변경", errorMessage: "비밀번호가 일치하지 않습니다."});
    }
    
    userData.password = newPassword;
    await userData.save();

    req.session.destroy();
    return res.redirect("/");
};

// 회원탈퇴
export const leave = async (req, res) => {
    const {_id} = req.session.user;
    const paramId = req.params.id;
    if(_id != paramId){
        return res.redirect("/");
    }
    await User.findByIdAndRemove(_id);
    req.session.destroy();
    return res.redirect("/");
};