import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedInUser = req.session.user || {};
    res.locals.siteName = "Lab";
    res.locals.loggedIn = req.session.loggedIn;
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

export const uploadImage = multer({dest:"uploads/images"});

// export const dateFormat = (date) => {
//     const _date = date.toISOString().split('T')[0];
//    // console.log(_date);
//     return _date;
// }