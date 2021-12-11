import Posting from "../models/Posting";

export const board = async (req, res) => {
    const postings = await Posting.find({}).sort({createdAt:"desc"}).populate("owner");
    return res.render("board", {titleName: "게시판", postings});
};

export const search = async (req, res) => {
    const {keyword} = req.body;
    let postings = [];
    if(keyword){
        postings = await Posting.find({
            title:{
                $regex: new RegExp(`${keyword}`, "i"),
            }
        }).populate("owner");
    }
    return res.render("board", {titleName: "게시판", postings});
}

export const getEnroll = (req, res) => {
    return res.render("posting-enroll", {titleName: "게시물 등록"});
};

export const postEnroll = async (req, res) => {
    const {title, content} = req.body;
    const {_id} = req.session.user;
    try {
        await Posting.create({
            title,
            content,
            owner: _id,
            createdAt: new Date().toISOString().replace('T', ' ').replace(/\..+/, ''),
        });
        return res.redirect("/board");    
    }catch(error){
        return res.render("posting-enroll", {titleName: "게시물 작성", errorMessage: error});    
    }
};

export const read = async (req, res) => {
    const {id} = req.params;
    const posting = await Posting.findById(id);

    return res.render("posting-read", {titleName: posting.title, posting})
};

export const getEdit = async (req, res) => {
    const {id} = req.params;
    const {user} = req.session;
    const sessionId = user._id; 

    const posting = await Posting.findById(id).populate("owner");

    if(posting.owner !== null){
        const postingOwnerId = posting.owner.id;
        if(sessionId == postingOwnerId){
            return res.render("posting-edit", {titleName: "게시물 수정", posting});
        }
    }
    if(user.admin){
        return res.render("posting-edit", {titleName: "게시물 수정", posting});
    }

    return res.redirect("/board");

};

export const postEdit = async (req, res) => {
    const {title, content} = req.body;
    const {id} = req.params;
    await Posting.findByIdAndUpdate(id, {
        title,
        content,
    });
    return res.redirect(`/board/${id}`);
};

export const remove = async (req, res) => {
    const {id} = req.params;
    const {user} = req.session;
    const sessionId = user._id; 

    const posting = await Posting.findById(id).populate("owner");
    if(posting.owner !== null){
        const postingOwnerId = posting.owner.id;
        if(sessionId == postingOwnerId){
            await Posting.findByIdAndRemove(id);
            return res.redirect("/board");
        }
    }
    if(user.admin){
        await Posting.findByIdAndRemove(id);
    }
    return res.redirect("/board");
};