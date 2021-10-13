var UserModel = require('../models/userModel.js');
var RecipientModel = require('../models/recipientModel.js');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */


module.exports = {
    /**
     * userController.show()
     */
    showUser: function (req, res, next) {
        var id = req.params.user_id;

        UserModel.findOne({_id: id}, function (error, user) {
            if (error) {
                err.message = 'Error when getting the user';
                err.status = 500;
                return next(err);
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
                    return res.status(201).json({message : "Logged out"});
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
        UserModel.findOne({email : req.body.email}, function (error, user) {
            if (error) {
                err.message = 'Error when getting the user';
                err.status = 500;
                return next(err);
            }

            if (user) {
                err.message = 'Email already in use';
                err.status = 400;
                return next(err);
            }

            var user = new UserModel({
                email : req.body.email,
                password : req.body.password,
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

            return next();
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

        if ( typeof req.body.title == 'undefined' && !req.body.title &&
            typeof req.body.type == 'undefined' && !req.body.type &&
            typeof req.body.note == 'undefined' && !req.body.note &&
            typeof req.body.date_time == 'undefined' && !req.body.date_time){

                var err = new Error('Wrong body');
                err.status = 400;
                return next(err);
               
           }

        UserModel.findOne({_id: id}, function (err, user) {
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
                title : req.body.title,
                type : req.body.type,
                note : req.body.note,
                date_time : req.body.date_time, 
                read : false
                
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

        UserModel.findOne({_id: id}, function (err, user) {
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

            UserModel.findOne({email: user.email}, function (err, user){
                if (err) {
                    err.message = 'Error when getting the user';
                    err.status = 500;
                    return next(err);
                }
    
                if (user) {
                    err.message = 'Email already in use';
                    err.status = 400;
                    return next(err);
                }

                user.email = req.body.email &&  req.body.email !== 'undefined' ? req.body.email : user.email;
                user.password = req.body.password &&  req.body.password !== 'undefined' ? req.body.password : user.password;
                            
                user.save(function (err) {
                    if (err) {
                        err.message = 'Error when updating the user';
                        err.status = 500;
                        return next(err);
                    }
                    
                    return next();
                });

            });
        });
    },


    updateNotification: function (req, res, next) {
        var id = req.params.user_id;
        var notification_id = req.params.notification_id;

        UserModel.findOne({_id: id}, function (err, user) {
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

            
            for(var i in user.notifications){
                if(user.notifications[i]._id.equals(ObjectId(notification_id))){
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

        RecipientModel.deleteMany({user_id: ObjectId(id)}, function (err) {
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

        UserModel.findOne({_id: id}, function (err, user) {
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
