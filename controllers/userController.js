var UserModel = require('../models/userModel.js');
var RecipientModel = require('../models/recipientModel.js');
var validator = require("email-validator");
const formatter = require('date-and-time');
var sun = require('sun-time');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */

function isNight(){
    var rise = sun.rise('Maribor');
    var set = sun.set('Maribor');
    var hour = new Date().getHours();

    
    var s = parseInt(set.split(":")[0], 10);
    var r = parseInt(rise.split(":")[0], 10);
    console.log(r, s, hour);
    if((hour >= 0 && hour < r) || (hour > s && hour <= 23))
        return true;
    return false;

}


module.exports = {
    /**
     * userController.show()
     */
    showUser: function (req, res, next) {
        var id = req.params.user_id;

        UserModel.findOne({ _id: id }, function (error, user) {
            if (error) {
                error.message = 'Error when getting the user';
                error.status = 500;
                return next(error);
            }

            if (!user) {
                var err = new Error('No such user');
                err.status = 404;
                return next(err);
            }

            return next();
        });
    },

    /**
        LOGIN USER
     
        body :
        { 
            "email" : String,
            "password" : String
        }
    */

    loginUser: function (req, res, next) {
        UserModel.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error || !user) {
                var error = new Error('Wrong email or password.');
                error.status = 401;
                return next(error);
            } else {
                return res.status(200).json(user);
            }
        })
    },


    /*
        LOGOUT USER
     
    */

    logoutUser: function (req, res, next) {
        if (req.session) {
            req.session.destroy(function (err) {
                if (err) {
                    return next(err);
                } else {
                    return res.status(201).json({ message: "Logged out" });
                }
            });
        }
    },

    /**
        CREATE USER
     
        body :
        { 
            "email" : String,
            "password" : String
        }
    */
    createUser: function (req, res) {
        UserModel.findOne({ email: req.body.email }, function (error, user) {
            if (error) {
                return res.status(500).json({
                    message: 'Error when getting the user',
                    error: error
                });
            }

            if (user) {
                return res.status(400).json({
                    message: 'Email already in use'
                });
            }

            if (validator.validate(req.body.email)) {
                var user = new UserModel({
                    email: req.body.email,
                    password: req.body.password,
                    notifications: []
                });

                user.save(function (err, user) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating user',
                            error: err
                        });
                    }

                    return res.status(201).json(user);
                });
            } else {
                return res.status(400).json({
                    message: 'Invalid email format'
                });
            }
        });
    },

    /* 
    CREATE NOTIFICATION BODY

    body :
    { 
        "title" : String,
        "type" : String,
        "note" : String,
        "date_time" : String
    }
    
    */

    createNotification: function (req, res, next) {
        var id = req.params.user_id;

        if (typeof req.body.title == 'undefined' && !req.body.title &&
            typeof req.body.type == 'undefined' && !req.body.type &&
            typeof req.body.note == 'undefined' && !req.body.note) {

            var err = new Error('Wrong body');
            err.status = 400;
            return next(err);

        } else {
            
            if(req.body.title.substr(0, 5) == "Light" && isNight()){
                var err = new Error('Its nighttime');
                    err.status = 400;
                    return next(err);
            }

            UserModel.findOne({ _id: id }, function (err, user) {
                if (err) {
                    err.message = 'Error when getting the user';
                    err.status = 500;
                    return next(err);
                }

                if (!user) {
                    var err = new Error('No such user');
                    err.status = 404;
                    return next(err);
                }

                var newNotification = {
                    title: req.body.title,
                    type: req.body.type,
                    note: req.body.note,
                    date_time: formatter.format(new Date(), 'DD/MM/YYYY HH:mm:ss'),
                    read: false

                }

                user.notifications.push(newNotification);

                user.save(function (err) {
                    if (err) {
                        err.message = 'Error when getting the user';
                        err.status = 500;
                        return next(err);
                    }

                    return next();
                });
            });
        }
    },

    /*

    USER UPDATE
    body : {
        "email" : String,
        "password" : String
    }
      
     */
    updateUser: function (req, res, next) {
        var id = req.params.user_id;

        UserModel.findOne({ _id: id }, function (err, user) {
            if (err) {
                err.message = 'Error when getting the user';
                err.status = 500;
                return next(err);
            }

            if (!user) {
                var err = new Error('No such user');
                err.status = 404;
                return next(err);
            }

            if (req.body.email && req.body.email !== 'undefined') {
                UserModel.findOne({ email: req.body.email }, function (err, u) {
                    if (err) {
                        err.message = 'Error when getting the user';
                        err.status = 500;
                        return next(err);
                    }

                    if (u) {
                        var err = new Error('Email already in use');
                        err.status = 400;
                        return next(err);
                    }

                    if (!validator.validate(req.body.email)) {
                        var err = new Error('Incorrect email format');
                        err.status = 400;
                        return next(err);
                    }
                });
            }

            user.email = req.body.email && req.body.email !== 'undefined' ? req.body.email : user.email;
            user.password = req.body.password && req.body.password !== 'undefined' ? req.body.password : user.password;
            user.save(function (err) {
                if (err) {
                    err.message = 'Error when updating the user';
                    err.status = 500;
                    return next(err);
                }

                return next();
            });
        });
    },


    updateNotification: function (req, res, next) {
        var id = req.params.user_id;
        var notification_id = req.params.notification_id;

        UserModel.findOne({ _id: id }, function (err, user) {
            if (err) {
                err.message = 'Error when getting the user';
                err.status = 500;
                return next(err);
            }

            if (!user) {
                var err = new Error('No such user');
                err.status = 404;
                return next(err);
            }


            for (var i in user.notifications) {
                if (user.notifications[i]._id.equals(ObjectId(notification_id))) {
                    user.notifications[i].read = true;
                    break;
                }
            }

            user.save(function (err) {
                if (err) {
                    err.message = 'Error when updating the user';
                    err.status = 500;
                    return next(err);
                }

                return next();
            });
        });
    },

    /*
        DELETE USER

    */
    removeUser: function (req, res) {
        var id = req.params.user_id;

        RecipientModel.deleteMany({ user_id: ObjectId(id) }, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting recipients.',
                    error: err
                });
            }

            UserModel.findByIdAndRemove(id, function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the user.',
                        error: err
                    });
                }

                return res.status(204).json();
            });

        });

    },

    /*
        DELETE NOTIFICATION

    */

    removeNotification: function (req, res, next) {
        var id = req.params.user_id;
        var notification_id = req.params.notification_id;

        UserModel.findOne({ _id: id }, function (err, user) {
            if (err) {
                err.message = 'Error when getting the user';
                err.status = 500;
                return next(err);
            }

            var newNotifications = user.notifications.filter((value) => {
                return value._id.toString() != notification_id;
            });

            user.notifications = newNotifications;

            user.save(function (err) {
                if (err) {
                    err.message = 'Error when updating the user';
                    err.status = 500;
                    return next(err);
                }

                return next();

            });
        });
    },
};
