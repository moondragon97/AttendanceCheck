import multer from "multer";

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

export const protectSocialUser = (req, res, next) => {
    if(req.session.user.socialOnly){
        return res.redirect("/");
    }
    next();
}

export const uploadFiles = multer({dest:"uploads/"});