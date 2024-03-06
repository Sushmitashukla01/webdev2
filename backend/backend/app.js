//import modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');

//create app
const app = express();

//create mongoose connectuon
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/StudentHelp')
    .then(() => console.log('Connected to MongoDB!'));

//import models
const User = require('./models/user');
const Event = require('./models/event');

//initialize app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'Chinmayi',
    resave: true,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

//user routes
app.post('/signup', async (req, res) => { 
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password
        });
        const saved = await user.save();
        req.session.loggedUser = { _id: saved._id, email: saved.email };
        res.status(200);
        res.header('Content-Type', 'application/json');
        res.json({
            success: true,
            data: {
                user: req.session.loggedUser,
                message: 'Created successfully!'
            }
        })
    } catch (err) { 
        console.log('Error occured while saving user', err);
        res.status(200);
        res.header('Content-Type', 'application/json');
        res.json({
            success: false,
            data: {
                error: err
            }
        })
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && user.password === req.body.password) {
            req.session.loggedUser = { _id: user._id, email: req.body.email };
            res.status(200);
            res.header('Content-Type', 'application/json');
            res.json({
                success: true,
                data: {
                    user: req.session.loggedUser,
                    message: 'User logged in successfully!'
                }
            });
        } else {
            req.session.loggedUser = null;
            res.status(200);
            res.header('Content-Type', 'application/json');
            res.json({
                success: false,
                data: {
                    message: 'Invalid email or password!'
                }
            });
        }
        console.log(req.session.loggedUser);
    } catch (err) {
        console.log('Error occured while logging in', err);
        res.status(404);
        res.header('Content-Type', 'application/json');
        res.json({
            success: false,
            data: {
                error: err
            }
        })
    }
});

app.get('/logout', (req, res) => {
    console.log(req.session.loggedUser);
    if (req.session.loggedUser) {
        req.session.loggedUser = null;
        res.status(200);
        res.header('Content-Type', 'application/json');
        res.json({
            success: true,
            data: {
                message: 'User logged out!'
            }
        })
    } else {
        res.status(200);
        res.header('Content-Type', 'application/json');
        res.json({
            success: false,
            data: {
                message: 'User is not logged in!'
            }
        });
    }
});

//events routes
app.get('/api/events', async (req, res) => { 
    try {
        const events = await Event.find({ scheduledBy: req.session.loggedUser._id });
        res.status(200);
        res.header('Content-Type', 'application/json');
        res.json({
            success: true,
            data: {
                events: events
            }
        });
    } catch {
        res.status(200);
        res.header('Content-Type', 'application/json');
        res.json({
            success: false,
            data: {
                message: 'An error occured!'
            }
        })
    }
});

app.post('/api/events', async (req, res) => {
    console.log('Called');
    //try {
        const new_event = new Event({
            title: req.body.title,
            description: req.body.description,
            semester: req.body.semester,
            due: req.body.due,
            scheduledBy: req.session.loggedUser._id
        });
        const saved = await new_event.save();
        console.log(saved);
        const events = await Event.find({ scheduledBy: req.session.loggedUser._id });
        res.status(200);
        res.header('Content-Type', 'application/json');
        res.json({
            success: true,
            data: {
                message: 'Successfully created event',
                events: events
            }
        })
    // } catch(err) {
    //     res.status(200);
    //     res.header('Content-Type', 'application/json');
    //     res.json({
    //         success: false,
    //         data: {
    //             message: 'Error creating event',
    //             error: err
    //         }
    //     });
    // }
})

module.exports = app;