export const getJoin = (req, res) => {
    return res.render("join", {titleName: "회원가입"});
};

export const postJoin = (req, res) => {
    console.log(req.body);

    // 유저의 정보를 데이터베이스에 등록
    return res.redirect("/");
}