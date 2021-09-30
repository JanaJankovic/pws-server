var PlantModel = require('../models/plantModel.js');

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
    update: function (req, res) {
        var id = req.params.id;

        PlantModel.findOne({_id: id}, function (err, plant) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting plant',
                    error: err
                });
            }

            if (!plant) {
                return res.status(404).json({
                    message: 'No such plant'
                });
            }

			plant.moisture = req.body.moisture ? req.body.moisture : plant.moisture;
			plant.frequency = req.body.frequency ? req.body.frequency : plant.frequency;
			plant.moisture_modifier = req.body.moisture_modifier ? req.body.moisture_modifier : plant.moisture_modifier;
            plant.frequency_modifier = req.body.frequency_modifier ? req.body.frequency_modifier : plant.frequency_modifier;
			
            plant.save(function (err, plant) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating plant.',
                        error: err
                    });
                }

                return res.json(plant);
            });
        });
    },

    /**
     * plantController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PlantModel.findByIdAndRemove(id, function (err, plant) {
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
