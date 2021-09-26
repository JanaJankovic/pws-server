var UserModel = require('../models/userModel.js');
var PlantModel = require('../models/plantModel.js');
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
    showUser: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    showRecipients: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user.recipients);
        });
    },

    showNotifications: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user.notifications);
        });
    },

    /**
        CREATE USER
     
        body :
        { 
            "email" : String,
            "password" : String,
            "ip" : String
        }
    */
    createUser: function (req, res) {
        var user = new UserModel({
			email : req.body.email,
			password : req.body.password,
            ip : req.body.ip,
            recipients: [], 
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
    },

    /* 
    CREATE RECIPIENT BODY

    body :
    { 
        "latin_name" : String,
        "pin" : Number,
        "mac_address" : String
    }
     
    */
    createRecipient: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            if ( typeof req.body.pin == 'undefined' && !req.body.pin &&
             typeof req.body.mac_address == 'undefined' && !req.body.mac_address &&
             typeof req.body.latin_name == 'undefined' && !req.body.latin_name){

                return res.status(500).json({
                    message: 'Incorrect body'
                });
                
            }
                                
            for(var i in user.recipients){
                if(user.recipients[i].pin == req.body.pin && user.recipients[i].mac_address == req.body.mac_address){
                    return res.status(500).json({
                        message: 'Recipient already exists'
                    });
                }
            }

            PlantModel.findOne({ latin_name: req.body.latin_name }, function (err, plant) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting plant.',
                        error: err
                    });
                }
                if (!plant) {
                    return res.status(404).json({
                        message: 'No such plant'
                    });
                }

                var recipient = {
                    pin : req.body.pin,
                    mac_address : req.body.mac_address,
                    watering_log : [], 
                    plant_id: ObjectId(plant._id)
                    
                }

                user.recipients.push(recipient);
                
                user.save(function (err, user) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating user.',
                            error: err
                        });
                    }

                    return res.json(user);
                });

            });
            
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

    createNotification: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            if ( typeof req.body.title == 'undefined' && !req.body.title &&
            typeof req.body.type == 'undefined' && !req.body.type &&
            typeof req.body.note == 'undefined' && !req.body.note &&
            typeof req.body.date_time == 'undefined' && !req.body.date_time){

               return res.status(500).json({
                   message: 'Incorrect body'
               });
               
           }

            var newNotification = {
                title : req.body.title,
                type : req.body.type,
                note : req.body.note,
                date_time : req.body.date_time, 
                read : false
                
            }

			user.notifications.push(newNotification);
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /*

    USER UPDATE
    body : {
        "email" : String,
        "password" : String
        "ip": String
    }
      
     */
    updateUser: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.email = req.body.email ? req.body.email : user.email;
			user.password = req.body.password ? req.body.password : user.password;
            user.ip = req.body.ip ? req.body.ip : user.ip;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /* 
    UPDATE RECIPIENT BODY

    body :
    { 
        "latin_name" : String,
        "pin" : Number,
        "date_time" : String, 
        "mac_address" : String
    }
    
    */

    updateRecipient: function (req, res) {
        var id = req.params.id;
        var recipient_id = req.params.recipient_id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            for(var i in user.recipients){
                if(user.recipients[i]._id == recipient_id){
                    user.recipients[i].pin = req.body.pin ? req.body.pin : user.recipients[i].pin;
                    user.recipients[i].mac_address = req.body.mac_address ? req.body.mac_address : user.recipients[i].mac_address;
                    
                    if(typeof req.body.latin_name != 'undefined' && req.body.latin_name){
                        PlantModel.findOne({ latin_name: req.body.latin_name }, function (err, plant) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when getting plant.',
                                    error: err
                                });
                            }
                            if (!plant) {
                                return res.status(404).json({
                                    message: 'No such plant'
                                });
                            }

                            user.recipients[i].plant_id = ObjectId(plant._id);
            
                        });
                    }

                    if(typeof req.body.date_time != 'undefined' && req.body.date_time){
                        user.recipients[i].watering_log.push(req.body.date_time);
                    }
                }

                break;
            }
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    updateNotification: function (req, res) {
        var id = req.params.id;
        var notification_id = req.params.notification_id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            for(var i in user.notifications){
                if(user.notifications[i]._id = notification_id){
                    user.notifications[i].read = true;
                }
                break;
            }
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /*
        DELETE USER

    */
    removeUser: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    /*
        DELETE RECIPIENT
    */

    removeRecipient: function (req, res) {
        var id = req.params.id;
        var recipient_id = req.params.recipient_id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the recipient.',
                    error: err
                });
            }

            var recipients = user.recipients.filter((value) => {
                return value._id.toString() != recipient_id;
            });

            user.recipients = recipients;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /*
        DELETE NOTIFICATION

    */

    removeNotification: function (req, res) {
        var id = req.params.id;
        var notification_id = req.params.notification_id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the notification.',
                    error: err
                });
            }

            var newNotifications = user.notifications.filter((value) => {
                return value._id.toString() != notification_id;
            });

            user.notifications = newNotifications;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    }
};
