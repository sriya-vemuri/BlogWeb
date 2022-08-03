const express = require('express');
const passport = require('passport');
const router = express.Router();
const {ensureAuth,ensureGuest} = require('../middleware/auth');
const Blog = require('../models/Blog');


// @desc login/landing page
// @route GET /
router.get('/',ensureGuest,(req,res) => {
    console.log(req.user);
    res.render('login',{
    layout: 'login'
    });
});

//router.get('/private',ensureAuth);

// @desc dashboard 
// @route GET /dashboard
router.get('/dashboard',ensureAuth, async(req,res) => {
    //console.log(req.user);\
    try{
        const blogs = await Blog.find({user: req.user.id}).lean();
        res.render('dashboard',{
            name: req.user.firstName,
            blogs 
        });
    }
    catch(err){
        console.error(err);
        res.render('error/500');
    }
    
});


module.exports=router;