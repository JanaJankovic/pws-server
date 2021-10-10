var RecipientModel = require('../models/recipientModel.js');
var UserModel = require('../models/userModel.js');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    aggregateUser: function(req, res){
        var id = req.params.user_id;

        RecipientModel.aggregate([
            { 
                $match: { "user_id" : ObjectId(id) }
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
            { $unwind : "$plant" }, 
            {
                $project : {
                    _id: 1,
                    base64_picture: 1,
                    byte_address: 1,
                    relay_pin: 1,
                    moisture_pin: 1,
                    water_log: 1,
                    plant: {
                        _id: "$plant._id",
                        common_name : "$plant.common_name",
                        latin_name : "$plant.latin_name",
                        light :"$plant.light",
                        humidity : "$plant.humidity",
                        temperature :"$plant.temperature",
                        moisture : "$plant.moisture",
                        frequency :"$plant.frequency",
                        moisture_modifier : "$plant.moisture_modifier",
                        frequency_modifier : "$plant.frequency_modifier",
                        growth_month : "$plant.growth_month",
                        hibernation_month : "$plant.hibernation_month",
                        customized : "$plant.customized"
                    }
                    
                }
            },
        ]).exec(function(err, recipients){
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting the complete user',
                    error: err
                });
            }

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
    
                var completeUser = ({
                    _id: user._id,
                    email : user.email,
                    password : user.password,
                    ip : user.ip,
                    notifications : user.notifications,
                    recipients: recipients
                });
    
                return res.status(200).json(completeUser);

            });
        });
    }
}