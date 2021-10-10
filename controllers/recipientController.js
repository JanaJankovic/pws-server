var RecipientModel = require('../models/recipientModel.js');
var PlantModel = require('../models/plantModel.js');
var UserModel = require('../models/userModel.js');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * recipientController.js
 *
 * @description :: Server-side logic for managing recipients.
 * 
 */
module.exports = {
    /**
     * recipientController.create()
     */
    create: function (req, res, next) {
        
        if ( typeof req.body.relay_pin == 'undefined' && !req.body.relay_pin &&
        typeof req.body.moisture_pin == 'undefined' && !req.body.moisture_pin &&
        typeof req.body.byte_address == 'undefined' && !req.body.byte_address &&
        typeof req.body.plant._id == 'undefined' && !req.body.plant._id){

            var err = new Error('Wrong body');
            err.status = 401;
            return next(err);
           
       }

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

            PlantModel.findOne({ _id: req.body.plant._id }, function (err, plant) {
                if (err) {
                    err.message = 'Error when getting the plant';
                    err.status = 500;
                    return next(err);
                }

                if (!plant) {
                    var err = new Error('No such plant');
                    err.status = 404;
                    return next(err);
                }

                RecipientModel.findOne(
                    {
                        user_id: user._id, 
                        plant_id:plant._id, 
                        relay_pin:req.body.relay_pin,
                        moisture_pin: req.body.moisture_pin,  
                        byte_address: req.body.byte_address

                    }, function (err, recipient) {
                    if (err) {
                        err.message = 'Error when getting the recipient';
                        err.status = 500;
                        return next(err);
                    }
        
                    if (!recipient) {
                        var rec = new RecipientModel({
                            plant_id: ObjectId(plant._id),
                            user_id: ObjectId(user._id),
                            relay_pin: req.body.relay_pin,
                            moisture_pin: req.body.moisture_pin,  
                            byte_address: req.body.byte_address,
                            water_log : []  
                        });

                        rec.save(function (err) {
                            if (err) {
                                err.message = 'Error when creating the recipient';
                                err.status = 500;
                                return next(err);
                            }
                            
                            return next();
                        });

                    } else {
                        var err = new Error('Recipient already exists');
                        err.status = 401;
                        return next(err);
                    }

                });

            });
            
        });
    },

    /**
     * recipientController.update()
     */
    update: function (req, res, next) {
        var id = req.params.id;

        RecipientModel.findOne({_id: id}, function (err, recipient) {
            if (err) {
                err.message = 'Error when getting the recipient';
                err.status = 500;
                return next(err);
            }

            if (!recipient) {
                var err = new Error('No such recipient');
                err.status = 404;
                return next(err);
            }

			recipient.plant_id = typeof req.body.plant != 'undefined' && req.body.plant._id ? req.body.plant._id : recipient.plant_id;
            recipient.path = req.body.path ? req.body.path : recipient.path;
			recipient.byte_address = req.body.byte_address ? req.body.byte_address : recipient.byte_address;
			recipient.relay_pin = req.body.relay_pin ? req.body.relay_pin : recipient.relay_pin;
            recipient.moisture_pin = req.body.moisture_pin ? req.body.moisture_pin : recipient.moisture_pin;
            recipient.water_log = req.body.water_log ? req.body.water_log : recipient.water_log;
            if(req.body.date_time){
                recipient.water_log.push(req.body.date_time);
            }

            RecipientModel.findOne(
            {
                plant_id: recipient.plant_id,
                relay_pin: recipient.relay_pin,
                moisture_pin: recipient.moisture_pin,  
                byte_address: recipient.byte_address,
                user_id: ObjectId(req.params.user_id)
            }, function (err, r){
                if (err) {
                    err.message = 'Error when getting the recipient';
                    err.status = 500;
                    return next(err);
                }

                if(r && r._id != recipient._id){
                    r.water_log = recipient.water_log;
                    r.path = recipient.path;
                }    
                else 
                    r = recipient;
                
                r.save(function (err) {
                    if (err) {
                        err.message = 'Error when updating the recipient';
                        err.status = 500;
                        return next(err);
                    }
                    
                    return next();
                });

            });
        });
    },

    /**
     * recipientController.remove()
     */
    remove: function (req, res, next) {
        var id = req.params.id;

        RecipientModel.findOne({_id: id}, function (err, recipient) {
            if (err) {
                err.message = 'Error when getting the recipient';
                err.status = 500;
                return next(err);
            }

            if (!recipient) {
                var err = new Error('No such recipient');
                err.status = 404;
                return next(err);
            }

            PlantModel.deleteOne({_id: recipient.plant_id, customized: true}, function (err) {
                if (err) {
                    err.message = 'Error when deleting customized plant';
                    err.status = 500;
                    return next(err);
                }
            });

        });

        RecipientModel.findByIdAndRemove(id, function (err, recipient) {
            if (err) {
                err.message = 'Error when deleting the recipient';
                err.status = 500;
                return next(err);
            }

            return next();

        });
    }
};
