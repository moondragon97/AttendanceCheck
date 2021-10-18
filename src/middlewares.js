import multer from "multer";
import cron from "node-cron";
import User from "./models/User";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedInUser = req.session.user || {};
    res.locals.siteName = "Lab";
    res.locals.loggedIn = req.session.loggedIn;
    next();
}

export const protectNotUser = (req, res, next) => {
    if(!req.session.loggedIn){
        return res.redirect("/login");
    }
    next();
}

export const protectUser = (req, res, next) => {
    if(req.session.loggedIn){
        return res.redirect("/");
    }
    next();
}

export const protectSocialUser = (req, res, next) => {
    if(req.session.user.socialOnly){
        return res.redirect("/");
    }
    next();
}

export const uploadFiles = multer({dest:"uploads/"});

export const initAttendance = async (req, res, next) =>{
    cron.schedule("0 48 21 * * *", () => {
        console.log(req.session.user);
        const {_id} = req.session.user;

        const userUpdate = User.findByIdAndUpdate(_id, {
            attendance: false,
        });
        req.session.user = userUpdate;
        console.log(req.session.user);
    });
    next();
}