import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import Calendar from "../models/Calendar";
//import { dateFormat } from "../middlewares";

// 회원가입 GET
export const getJoin = (req, res) => {
    return res.render("join", {titleName: "회원가입"});
};

// 회원가입 POST
export const postJoin = async (req, res) => {
    const {userId, password, passwordConfirmation, name, email, snum, birthDay} = req.body;
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
            birthDay,
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
    const todayDate = new Date().toLocaleDateString('ko-KR', {timeZone: "Asia/Seoul"});
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
    var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
    const {_id} = req.session.user;
    const todayDate = new Date().toLocaleDateString('ko-KR', {timeZone: "Asia/Seoul"});
    const todayDataObject = await Calendar.findOne({date: todayDate}).populate("user");
    const attendance = {user: _id, time: new Date().toLocaleTimeString('ko-KR', {timeZone: "Asia/Seoul"})};

    // 당일 정보의 출석 데이터 객체 배열이 생성이 안 되어 있으면 생성
    if(!todayDataObject){
        await Calendar.create({
            date: todayDate,
            attendance: attendance,
        });
        return res.redirect("/user/attendance");
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

// 전체 출석현황 GET
export const getAttendanceCheck = async (req, res) => {
    const attendanceDatas = await Calendar.find({}).sort({'date': -1}).populate("attendance.user");
    // for (let i = 0; i < attendanceDatas.length; i++) {
    //     const dates = await dateFormat(attendanceDatas[i].date);
    // }
    return res.render("check-attendance", {titleName: "출석현황", attendanceDatas});
};

// 출석날짜 제거(데이터 정리를 위함)
export const deleteAttendance = async (req, res) => {
    const {id} = req.params;
    await Calendar.findByIdAndRemove(id);
    return res.redirect("/user/attendance/check");
};

// 개인 출석현황
export const getAttendanceEachCheck = async (req, res) => {
    const _id = req.params.id;

    const userAttendanceDatas = await Calendar.find({attendance : {$elemMatch : {user: _id}}}).sort({'date': -1}).populate("attendance.user");

    let userName;
    for(let i = 0; i < userAttendanceDatas[0].attendance.length; i++){
        if(userAttendanceDatas[0].attendance[i].user != null){
            if(userAttendanceDatas[0].attendance[i].user._id == _id){
                userName = userAttendanceDatas[0].attendance[i].user.name;
            } 
        }
    }
    return res.render('attendance-each', {titleName: `${userName}학생의 출석정보`, userAttendanceDatas, _id});
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
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
        return res.redirect("/");
    }
    return res.render("profile", {titleName: `${user.name}학생의 프로필`, user});
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
    const {body:{name, email, snum, birthDay}, file} = req;
    const {_id, avatarUrl} = req.session.user;
    const isHeroku = process.env.NODE_ENV === "production";
    let changeAvataUrl = avatarUrl;

    if(file != undefined){
        if(isHeroku){
            changeAvataUrl = file.location;
        }else{
            changeAvataUrl = file.path;
        }
    }
    // if(file!=undefined)
    //     changeAvataUrl = file.location;
    const updateUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: changeAvataUrl,
        email,
        name,
        snum,
        birthDay,
    }, {new: true});
 
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
    const {user} = req.session;
    const {_id} = user;
    const paramId = req.params.id;

    // 관리자가 본인일 때 삭제 X
    if(user.admin && _id == paramId){
        return res.redirect("/user/check-data");
    }
    
    // 본인이거나, 관리자일 때
    if(_id == paramId || user.admin){
        await User.findByIdAndRemove(paramId);
    }

    // 관리자가 아닐 시 실행
    if(!user.admin){
        req.session.destroy();
        return res.redirect("/");
    }

    return res.redirect("/user/check-data");
};

// 유저 정보들 체크
export const checkData = async (req, res) => {
    const users = await User.find({npc: false}).sort({'joinAt': -1});
    return res.render("check-userdata", {titleName: "가입된 학생들", users});
};

// 회비 관리 GET
export const getManageFee = async (req, res) => {
    const users = await User.find({npc: false}).sort({'joinAt': -1});
    const npc = await User.findOne({npc: true});

    return res.render("manage-fee", {titleName: "회비관리", users, npc});
};

export const manageFee = async (req, res) => {
    const {id} = req.params; 
    const {fee, penalty, submitPenalty, submitFee} = req.body;
    
    const user = await User.findById(id);
    const npcFee = await User.findOne({npc: true});
    
    user.fee = fee;
    user.penalty = penalty;
    user.totalPenalty += submitPenalty;
    npcFee.totalPenalty += submitFee + submitPenalty;
    user.save();
    npcFee.save();
};

export const updateTotalFee = async (req, res) => {
    const npc = await User.findOne({npc: true});
    const {updateValue} = req.body;
    npc.totalPenalty = updateValue;
    npc.save();
}

// 총무 임명
export const grantManager = async (req, res) => {
    const {id} = req.params;
    const {user} = req.session;
    const {_id} = user;
    if(!user.admin){
        return res.redirect("/");
    }
    await User.findByIdAndUpdate({_id: id}, {manager: true});
    if(_id == id){
        req.session.user.manager = true;
    }
    return res.redirect("/user/check-data");
};

export const revokeManager = async (req, res) => {
    const {id} = req.params;
    const {user} = req.session;
    const {_id} = user;
    if(!user.admin){
        return res.redirect("/");
    }
    await User.findByIdAndUpdate({_id: id}, {manager: false});
    if(_id == id){
        req.session.user.manager = false;
    }
    return res.redirect("/user/check-data");
}

// 관리자 위임
export const grantAdmin = async (req, res) => {
    const paramId = req.params.id;
    const {user} = req.session;
    
    if(!user.admin || paramId == user._id){
        return res.redirect("/");
    }

    const adminUser = await User.findById(user._id);
    const targetUser = await User.findById(paramId);
    
    adminUser.admin = false;
    adminUser.manager = false;
    targetUser.admin = true;
    targetUser.manager = true;

    await adminUser.save();
    await targetUser.save();

    req.session.user = adminUser;

    return res.redirect("/");
};