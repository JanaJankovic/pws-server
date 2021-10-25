var RecipientModel = require('../models/recipientModel.js');
var UserModel = require('../models/userModel.js');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;



function isWinterSeason(currentMonth, growMonth, winterMonth) {
    if(winterMonth == 0)
    return false;

    if(growMonth >  winterMonth)
        return currentMonth >= winterMonth && currentMonth < growMonth;
    else
        return !(currentMonth >= growMonth && currentMonth < winterMonth);
}

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
                    path: 1,
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
                    notifications : user.notifications,
                    recipients: recipients
                });
    
                return res.status(200).json(completeUser);

            });
        });
    }, 

    aggregateShortRecipients: function(req, res){
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
                    byte_address: 1,
                    relay_pin: 1,
                    moisture_pin: 1,
                    plant : "$plant.common_name",
                    light :"$plant.light",
                    humidity : "$plant.humidity",
                    temperature :"$plant.temperature",
                    moisture : "$plant.moisture",
                    frequency :"$plant.frequency",
                    moisture_modifier : "$plant.moisture_modifier",
                    frequency_modifier : "$plant.frequency_modifier",
                    growth_month : "$plant.growth_month",
                    hibernation_month : "$plant.hibernation_month",                  
                }
            },
        ]).exec(function(err, rs){
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting the short recipients',
                    error: err
                });
            }

            var recipients = []
            for(i in rs){
                var m = isWinterSeason(new Date().getMonth() + 1, rs[i].growth_month, rs[i].hibernation_month) ? rs[i].moisture - rs[i].moisture_modifier: rs[i].moisture;
                var f = isWinterSeason(new Date().getMonth() + 1, rs[i].growth_month, rs[i].hibernation_month) ? rs[i].frequency - rs[i].frequency_modifier: rs[i].frequency;

                var r = {
                    _id: rs[i]._id,
                    byte_address: rs[i].byte_address,
                    relay_pin: rs[i].relay_pin,
                    moisture_pin: rs[i].moisture_pin,
                    plant : rs[i].plant,
                    light : rs[i].light,
                    humidity : rs[i].humidity,
                    temperature : rs[i].temperature,
                    moisture : m,
                    frequency : f,
                }

                recipients.push(r);
            }

            return res.status(200).json(recipients);

        });
    }
}