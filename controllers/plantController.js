var PlantModel = require('../models/plantModel.js');
var RecipientModel = require('../models/recipientModel.js');

/**
 * plantController.js
 *
 * @description :: Server-side logic for managing plants.
 */
module.exports = {

    /**
     * plantController.list()
     */
    list: function (req, res) {
        PlantModel.find(function (err, plants) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting plant.',
                    error: err
                });
            }

            return res.json(plants);
        });
    },

    /**
     * plantController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PlantModel.findOne({_id: id}, function (err, plant) {
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

            return res.json(plant);
        });
    },

    /**
     * plantController.create()
     */
    create: function (req, res) {
        var plant = new PlantModel({
			common_name : req.body.common_name,
			latin_name : req.body.latin_name,
			light : req.body.light,
			humidity : req.body.humidity,
			temperature : req.body.temperature,
			moisture : req.body.moisture,
			frequency : req.body.frequency,
			moisture_modifier : req.body.moisture_modifier,
            frequency_modifier : req.body.frequency_modifier,
            growth_month : req.body.growth_month,
            hibernation_month : req.body.hibernation_month,
            customized : false
        });

        plant.save(function (err, plant) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating plant',
                    error: err
                });
            }

            return res.status(201).json(plant);
        });
    },

    /**
     * plantController.update()
     */
    update: function (req, res, next) {
        var id = req.params.id;

        PlantModel.findOne(
            {
                common_name : req.body.common_name,
                latin_name : req.body.latin_name,
                light : req.body.light,
                humidity : req.body.humidity,
                temperature : req.body.temperature,
                moisture : req.body.moisture,
                frequency : req.body.frequency,
                moisture_modifier : req.body.moisture_modifier,
                frequency_modifier : req.body.frequency_modifier,
                growth_month : req.body.growth_month,
                hibernation_month : req.body.hibernation_month,
                customized : true
        }, function (err, plant) {
            if (err) {
                err.message = 'Error when getting the plant';
                err.status = 500;
                return next(err);
            }

            if (!plant) {
                var p = new PlantModel({
                    common_name : req.body.common_name,
                    latin_name : req.body.latin_name,
                    light : req.body.light,
                    humidity : req.body.humidity,
                    temperature : req.body.temperature,
                    moisture : req.body.moisture,
                    frequency : req.body.frequency,
                    moisture_modifier : req.body.moisture_modifier,
                    frequency_modifier : req.body.frequency_modifier,
                    growth_month : req.body.growth_month,
                    hibernation_month : req.body.hibernation_month,
                    customized : true
                });
        
                p.save(function (err, plant) {
                    if (err) {
                        err.message = 'Error when creating the plant';
                        err.status = 500;
                        return next(err);
                    }
        
                    RecipientModel.findOne({_id: req.params.recipient_id}, function (err, recipient) {
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
        
                        recipient.plant_id = plant._id;
        
                        recipient.save(function (err) {
                            if (err) {
                                err.message = 'Error when updating the recipient';
                                err.status = 500;
                                return next(err);
                            }
                            
                            return next();
                        });
                    });
                });
            } else {
                plant.moisture = req.body.moisture ? req.body.moisture : plant.moisture;
                plant.frequency = req.body.frequency ? req.body.frequency : plant.frequency;
                plant.moisture_modifier = req.body.moisture_modifier ? req.body.moisture_modifier : plant.moisture_modifier;
                plant.frequency_modifier = req.body.frequency_modifier ? req.body.frequency_modifier : plant.frequency_modifier;
                
                plant.save(function (err) {
                    if (err) {
                        err.message = 'Error when updating the plant';
                        err.status = 500;
                        return next(err);
                    }
    
                    return next();
                });
            }
        });
    },

    /**
     * plantController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PlantModel.findByIdAndRemove(id, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the plant.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
