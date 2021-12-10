import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const isHeroku = process.env.NODE_ENV === "production";
console.log(isHeroku);
export const localsMiddleware = (req, res, next) => {
    res.locals.loggedInUser = req.session.user || {};
    res.locals.siteName = "Lab";
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.isHeroku = isHeroku
    next();
};

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    }
});

const s3AvatarUploader = multerS3({
    s3: s3,
    bucket: "lab3floor/avatar",
    acl: "public-read",
});

console.log(isHeroku);
export const s3AvatarRemove = (req, res, next) => {
    const userAvatarUrl = req.session.user.avatarUrl
    if(req.file && userAvatarUrl && isHeroku){
        s3.deleteObject({
            Bucket: "lab3floor/avatar",
            Key: userAvatarUrl.split('/')[4],
        },
        (err, data)=>{
            if(err){
                throw err;
            }
        })
    }
    next();
};


export const protectNotUser = (req, res, next) => {
    if(!req.session.loggedIn){
        return res.redirect("/login");
    }
    next();
};

export const protectUser = (req, res, next) => {
    if(req.session.loggedIn){
        return res.redirect("/");
    }
    next();
};

export const protectNotManager = (req, res, next) => {
    if(!req.session.user.manager){
        return res.redirect("/");
    }
    next();
}

export const protectNotAdmin = (req, res, next) => {
    if(!req.session.user.admin){
        return res.redirect("/");
    }
    next();
};

export const protectSocialUser = (req, res, next) => {
    if(req.session.user.socialOnly){
        return res.redirect("/");
    }
    next();
};

export const uploadImage = multer({
    dest:"uploads/images/",
    limits: {
        fileSize: 3000000,
    },
    storage: isHeroku ? s3AvatarUploader : undefined,
});