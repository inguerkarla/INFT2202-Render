import express from 'express';
import {AuthGuard, UserDisplayName} from "../utils/index";

const router = express.Router();
import User from '../models/user'
import * as Events from "events";
import passport from "passport";


/***TOP LEVEL ROUTES ***/
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: ''});
});

router.get('/home', function(req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: ''});
});

router.get('/portfolio', function(req, res, next) {
    res.render('index', { title: 'Portfolio', page: 'portfolio', displayName: '', projects:
            [
                {title: "Tech for All", image: "/assets/image/project-1.jpg", description: "This inclusive initiative is designed to bridge the digital divide, offering a range of technology resources and training for community members. From basic digital literacy classes to advanced tech workshops."},
                {title: "Green Harmony Garden", image: "/assets/image/project-2.jpg", description: "A serene haven where nature and sustainability intertwine seamlessly. This eco-conscious oasis is a living testament to our commitment to environmental stewardship."},
                {title: "Code Connect", image: "/assets/image/project-3.jpg", description: "\"Code Connect\" Is a dynamic initiative aimed at making coding accessible to individuals of all ages and backgrounds. Whether you're a curious beginner or looking to enhance your programming skills."},
    ]});
});

router.get('/services', function(req, res, next) {
    res.render('index', { title: 'Services', page: 'services', displayName: ''});
});

router.get('/team', function(req, res, next) {
    res.render('index', { title: 'Team', page: 'team', displayName: ''});
});

router.get('/blog', function(req, res, next) {
    res.render('index', { title: 'Blog', page: 'blog', displayName: ''});
});

router.get('/contact', function(req, res, next) {
    res.render('index', { title: 'Contact US', page: 'contact', displayName: ''});
});
router.get('/events', function(req, res, next) {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
    res.render('index', { title: 'Events', page: 'events', displayName: '', events: [
            { title: 'Event 1', date: '2024-04-15', time: '10:00 AM', description: 'Description 1' },
            { title: 'Event 2', date: '2024-04-16', time: '11:00 AM', description: 'Description 2' },
        ]});
    } else {
        // Redirect to the login page if not authenticated
        res.redirect('/login');
    }
});

router.get('/gallery', function(req, res, next) {
    res.render('index', { title: 'Gallery', page: 'gallery', displayName: '', galleryImages: [
            { description: "Description 1", imageUrl: "gallery-1.jpg", alt: "description after" },
            { description: "Description 2", imageUrl: "gallery-2.jpg", alt: "description after" },
            { description: "Description 3", imageUrl: "gallery-3.jpg", alt: "description after" }
        ]});
});
router.get('/privacy-policy', function(req, res, next) {
    res.render('index', { title: 'Privacy Policy', page: 'privacy-policy', displayName: ''});
});
router.get('/terms', function(req, res, next) {
    res.render('index', { title: 'Terms of Service', page: 'terms', displayName: ''});
});


/*** AUTHENTICATION ROUTES***/
router.get('/login', function(req, res, next) {
    if(!req.user){
        res.render('index', { title: 'Login', page: 'login',
            messages: req.flash('loginMessage'), displayName: UserDisplayName (req)});
    }
    return res.redirect('/events');
});

router.post('/login', function (req, res, next){

    passport.authenticate('local', function (err: Error, user: Express.User, info: String){

        //check if there was an error during the authentication
        if(err){
            console.error(err);
            res.end();
        }
        //if no user is returned, authentication failed
        if(!user){
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login'); //Status 300-399 ---302
        }
        req.login(user, function (err){

            if(err){
                console.error(err);
                res.end();
            }
            //on successful login redirect the user to the contact-list
            res.redirect('/events');
        });

    })(req, res, next);

});

router.get('/register', function(req, res, next) {
    if(!req.user){
        res.render('index', { title: 'Register', page: 'register',
            messages: req.flash('registerMessage'), displayName: UserDisplayName (req)});
    }
    return res.redirect('/events');
});

router.post('/register', function(req, res, next){

    let newUser = new User (
        {

            username:req.body.username,
            EmailAddress: req.body.emailAdress,
            DisplayName: req.body.firstName + " " + req.body.lastName

        }
    );

    console.log("username: " + req.body.username);
    console.log("email:" + req.body.emailAddress);
    console.log("password:" + req.body.password);

    User.register(newUser, req.body.password, function (err){
        if(err){
            let errorMessage = "Server Error"
            if(err.name == 'UserExistsAlready'){

                console.error("Error: User Exists Already");
                errorMessage = "Registration Error";
            }
            req.flash('registerMessage', errorMessage);
            res.redirect('/register');
        }
        return passport.authenticate('local')(req, res, function (){
            return res.redirect('/events');

        });

    });

});

router.get('/logout', function (req, res, next){

    //attempt to log out the current logged-in user
    req.logout(function (err){
        if(err){
            console.error(err);
            res.end();
        }
        res.redirect('/login');
    })

});




/***  (SECURE) ROUTES ***/

router.get('/statistics', function(req, res, next) {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
        // Render the statistics page
        res.render('index', { title: 'Statistics', page: 'statistics', displayName: ''});
    } else {
        // Redirect to the login page if not authenticated
        res.redirect('/login');
    }
});


export default router;
