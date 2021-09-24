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
    }
};
