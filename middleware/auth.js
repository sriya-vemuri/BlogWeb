module.exports = {
    ensureAuth: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        else{
            //console.log("YESS");
            res.redirect('/');
        }
    },
    ensureGuest: function(req,res,next){    
        if(!req.isAuthenticated()){
            return next();
        }
        else{
            res.redirect('/dashboard');
        }
    }
};