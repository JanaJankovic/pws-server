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
			modifier : req.body.modifier
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

            plant.common_name = req.body.common_name ? req.body.common_name : plant.common_name;
			plant.latin_name = req.body.latin_name ? req.body.latin_name : plant.latin_name;
			plant.light = req.body.light ? req.body.light : plant.light;
			plant.humidity = req.body.humidity ? req.body.humidity : plant.humidity;
			plant.temperature = req.body.temperature ? req.body.temperature : plant.temperature;
			plant.moisture = req.body.moisture ? req.body.moisture : plant.moisture;
			plant.frequency = req.body.frequency ? req.body.frequency : plant.frequency;
			plant.modifier = req.body.modifier ? req.body.modifier : plant.modifier;
			
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
