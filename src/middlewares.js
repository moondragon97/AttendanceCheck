export const localsMiddleware = (req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.loggedIn = req.session.loggedIn;
    console.log("middleware", res.locals.user);
    next();
}

export const protectNotUser = (req, res, next) => {
    if(!req.session.loggedIn){
        return res.redirect("/login");
    }
    next();
}