const checkSession = (req, res, next) => {
    if (req.session.role === 'admin') {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

const isLogin = (req, res, next) => {
    if (req.session.admin) {
        res.redirect('/admin/dashboard');
    } else {
        next() 
    }
}

const isLogout = (req, res) => {
    if (req.session.admin) {
        req.session.admin = null;
        req.session.role = null; 
        res.redirect('/admin/login');
    } else {
        res.redirect('/admin/login'); 
    }
};

const redirectIfLoggedIn = (req, res, next) => {
    if (req.session.role === 'user') {
        return res.redirect('/user/home');
    } else if (req.session.role === 'admin') {
        return res.redirect('/admin/dashboard');
    }
    next();  
}

const preventUserFromAdminPage = (req, res, next) => {
    if (req.session.role === 'user') {
        return res.redirect('/user/home'); 
    }
    next();
}

const preventAdminFromUserPage = (req, res, next) => {
    if (req.session.role === 'admin') {
        return res.redirect('/admin/dashboard'); 
    }
    next();
}




module.exports = {
    checkSession,
    isLogin,
    isLogout,
    redirectIfLoggedIn,
    preventUserFromAdminPage,
    preventAdminFromUserPage
}