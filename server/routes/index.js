"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../utils/index");
const router = express_1.default.Router();
const user_1 = __importDefault(require("../models/user"));
const passport_1 = __importDefault(require("passport"));
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: '' });
});
router.get('/home', function (req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: '' });
});
router.get('/portfolio', function (req, res, next) {
    res.render('index', { title: 'Portfolio', page: 'portfolio', displayName: '', projects: [
            { title: "Tech for All", image: "/assets/image/project-1.jpg", description: "This inclusive initiative is designed to bridge the digital divide, offering a range of technology resources and training for community members. From basic digital literacy classes to advanced tech workshops." },
            { title: "Green Harmony Garden", image: "/assets/image/project-2.jpg", description: "A serene haven where nature and sustainability intertwine seamlessly. This eco-conscious oasis is a living testament to our commitment to environmental stewardship." },
            { title: "Code Connect", image: "/assets/image/project-3.jpg", description: "\"Code Connect\" Is a dynamic initiative aimed at making coding accessible to individuals of all ages and backgrounds. Whether you're a curious beginner or looking to enhance your programming skills." },
        ] });
});
router.get('/services', function (req, res, next) {
    res.render('index', { title: 'Services', page: 'services', displayName: '' });
});
router.get('/team', function (req, res, next) {
    res.render('index', { title: 'Team', page: 'team', displayName: '' });
});
router.get('/blog', function (req, res, next) {
    res.render('index', { title: 'Blog', page: 'blog', displayName: '' });
});
router.get('/contact', function (req, res, next) {
    res.render('index', { title: 'Contact US', page: 'contact', displayName: '' });
});
router.get('/events', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render('index', { title: 'Events', page: 'events', displayName: '', events: [
                { title: 'Event 1', date: '2024-04-15', time: '10:00 AM', description: 'Description 1' },
                { title: 'Event 2', date: '2024-04-16', time: '11:00 AM', description: 'Description 2' },
            ] });
    }
    else {
        res.redirect('/login');
    }
});
router.get('/gallery', function (req, res, next) {
    res.render('index', { title: 'Gallery', page: 'gallery', displayName: '', galleryImages: [
            { description: "Description 1", imageUrl: "gallery-1.jpg", alt: "description after" },
            { description: "Description 2", imageUrl: "gallery-2.jpg", alt: "description after" },
            { description: "Description 3", imageUrl: "gallery-3.jpg", alt: "description after" }
        ] });
});
router.get('/privacy-policy', function (req, res, next) {
    res.render('index', { title: 'Privacy Policy', page: 'privacy-policy', displayName: '' });
});
router.get('/terms', function (req, res, next) {
    res.render('index', { title: 'Terms of Service', page: 'terms', displayName: '' });
});
router.get('/login', function (req, res, next) {
    if (!req.user) {
        res.render('index', { title: 'Login', page: 'login',
            messages: req.flash('loginMessage'), displayName: (0, index_1.UserDisplayName)(req) });
    }
    return res.redirect('/events');
});
router.post('/login', function (req, res, next) {
    passport_1.default.authenticate('local', function (err, user, info) {
        if (err) {
            console.error(err);
            res.end();
        }
        if (!user) {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.login(user, function (err) {
            if (err) {
                console.error(err);
                res.end();
            }
            res.redirect('/events');
        });
    })(req, res, next);
});
router.get('/register', function (req, res, next) {
    if (!req.user) {
        res.render('index', { title: 'Register', page: 'register',
            messages: req.flash('registerMessage'), displayName: (0, index_1.UserDisplayName)(req) });
    }
    return res.redirect('/events');
});
router.post('/register', function (req, res, next) {
    let newUser = new user_1.default({
        username: req.body.username,
        EmailAddress: req.body.emailAdress,
        DisplayName: req.body.firstName + " " + req.body.lastName
    });
    console.log("username: " + req.body.username);
    console.log("email:" + req.body.emailAddress);
    console.log("password:" + req.body.password);
    user_1.default.register(newUser, req.body.password, function (err) {
        if (err) {
            let errorMessage = "Server Error";
            if (err.name == 'UserExistsAlready') {
                console.error("Error: User Exists Already");
                errorMessage = "Registration Error";
            }
            req.flash('registerMessage', errorMessage);
            res.redirect('/register');
        }
        return passport_1.default.authenticate('local')(req, res, function () {
            return res.redirect('/events');
        });
    });
});
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            console.error(err);
            res.end();
        }
        res.redirect('/login');
    });
});
router.get('/statistics', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render('index', { title: 'Statistics', page: 'statistics', displayName: '' });
    }
    else {
        res.redirect('/login');
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map