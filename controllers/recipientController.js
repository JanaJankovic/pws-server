var RecipientModel = require('../models/recipientModel.js');
var PlantModel = require('../models/plantModel.js');
var UserModel = require('../models/userModel.js');
const formatter = require('date-and-time');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;



function isWinterSeason(currentMonth, growMonth, winterMonth) {
    if (winterMonth == 0)
        return false;

    if (growMonth > winterMonth)
        return currentMonth >= winterMonth && currentMonth < growMonth;
    else
        return !(currentMonth >= growMonth && currentMonth < winterMonth);
}


function isWateringTime(id, res, frequency, frequency_modifier, counter, growth_month, hibernation_month) {
    var f = isWinterSeason(new Date().getMonth() + 1, growth_month, hibernation_month) ? frequency - frequency_modifier : frequency;
    var date = new Date();
    var interval = Math.floor(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() / f);
    var last = counter * interval;
    var current = new Date().getDate();

    if (current <= last) {
        setToZero(id, res);
    } else {
        console.log(f, counter, interval, current, last);
        if (current % interval == 0 && current != last)
            return true;
    }

    return false;
}

function setToZero(id, res) {
    RecipientModel.findOne({ _id: id }, function (err, recipient) {
        if (err) {
            return res.status(500).json({
                message: 'Error when getting the recipient',
                error: err
            });
        }

        if (!recipient) {
            return res.status(404).json({
                message: 'Recipient not found'
            });
        }

        recipient.counter = 0;
        recipient.save(function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when saving the recipient',
                    error: err
                });
            }
        });
    });
}

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

        if (typeof req.body.relay_pin == 'undefined' && !req.body.relay_pin &&
            typeof req.body.moisture_pin == 'undefined' && !req.body.moisture_pin &&
            typeof req.body.byte_address == 'undefined' && !req.body.byte_address &&
            typeof req.body.plant._id == 'undefined' && !req.body.plant._id) {

            var err = new Error('Wrong body');
            err.status = 400;
            return next(err);

        }

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
                        plant_id: plant._id,
                        relay_pin: req.body.relay_pin,
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
                                counter: 0,
                                water_log: []
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
                            err.status = 400;
                            return next(err);
                        }

                    });

            });

        });
    },

    addDateLog: function (req, res) {
        var id = req.params.id;
        RecipientModel.findOne({ _id: id }, function (err, recipient) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting the recipient',
                    error: err
                });
            }

            if (!recipient) {
                return res.status(404).json({
                    message: 'Recipient not found'
                });
            }

            recipient.water_log.push(formatter.format(new Date(), 'DD/MM/YYYY HH:mm:ss'));
            var date = new Date();
            recipient.counter = (recipient.counter + 1) % (new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());

            recipient.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when saving the recipient',
                        error: err
                    });
                }

                return res.status(200).json({ message: "Updated" });
            });

        });

    },

    list: function (req, res) {
        var id = req.params.user_id;
        var address = req.params.byte_address;

        RecipientModel.aggregate([
            {
                $match: {
                    "user_id": ObjectId(id),
                    "byte_address": address,
                }
            },
            {
                $lookup:
                {
                    from: "plants",
                    localField: "plant_id",
                    foreignField: "_id",
                    as: "plant"
                }
            },
            { $unwind: "$plant" },
            {
                $project: {
                    _id: 1,
                    byte_address: 1,
                    relay_pin: 1,
                    moisture_pin: 1,
                    counter: 1,
                    plant: "$plant.common_name",
                    light: "$plant.light",
                    humidity: "$plant.humidity",
                    temperature: "$plant.temperature",
                    moisture: "$plant.moisture",
                    frequency: "$plant.frequency",
                    moisture_modifier: "$plant.moisture_modifier",
                    frequency_modifier: "$plant.frequency_modifier",
                    growth_month: "$plant.growth_month",
                    hibernation_month: "$plant.hibernation_month",
                }
            },
        ]).exec(function (err, rs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting the short recipients',
                    error: err
                });
            }

            var recipients = [];
            for (var i = 0; i < rs.length; i++) {
                var isWater = isWateringTime(rs[i]._id, res, rs[i].frequency, rs[i].frequency_modifier, rs[i].counter, rs[i].growth_month, rs[i].hibernation_month);
                
                var r = {
                    _id: rs[i]._id,
                    byte_address: rs[i].byte_address,
                    relay_pin: rs[i].relay_pin,
                    moisture_pin: rs[i].moisture_pin,
                    plant: rs[i].plant,
                    light: rs[i].light,
                    humidity: rs[i].humidity,
                    temperature: rs[i].temperature,
                    moisture: isWinterSeason(new Date().getMonth() + 1, rs[i].growth_month, rs[i].hibernation_month) ? rs[i].moisture - rs[i].moisture_modifier : rs[i].moisture,
                    water: isWater
                }

                recipients.push(r);
            }

            return res.status(200).json(recipients);

        });

    },

    /**
     * recipientController.update()
     */
    update: function (req, res, next) {
        var id = req.params.id;

        RecipientModel.findOne({ _id: id }, function (err, recipient) {
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

            RecipientModel.findOne(
                {
                    plant_id: recipient.plant_id,
                    relay_pin: recipient.relay_pin,
                    moisture_pin: recipient.moisture_pin,
                    byte_address: recipient.byte_address,
                    user_id: ObjectId(req.params.user_id)
                }, function (err, r) {
                    if (err) {
                        err.message = 'Error when getting the recipient';
                        err.status = 500;
                        return next(err);
                    }

                    if (r && r._id != recipient._id) {
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

        RecipientModel.findOne({ _id: id }, function (err, recipient) {
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

            PlantModel.deleteOne({ _id: recipient.plant_id, customized: true }, function (err) {
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
