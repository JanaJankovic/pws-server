var GraphDataModel = require('../models/graphDataModel.js');
const formatter = require('date-and-time');

/**
 * graph_dataController.js
 *
 * @description :: Server-side logic for managing graph_datas.
 */
module.exports = {

    /**
     * graph_dataController.list()
     */
    list: function (req, res) {
        GraphDataModel.find(function (err, graph_datas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting graph_data.',
                    error: err
                });
            }

            return res.json(graph_datas);
        });
    },

    /**
     * graph_dataController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        GraphDataModel.findOne({_id: id}, function (err, graph_data) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting graph_data.',
                    error: err
                });
            }

            if (!graph_data) {
                return res.status(404).json({
                    message: 'No such graph_data'
                });
            }

            return res.json(graph_data);
        });
    },

    /**
     * graph_dataController.create()
     */
    create: function (req, res) {
        var graph_data = new GraphDataModel({
			recipient_id : req.body.recipient_id,
			light : req.body.light,
			temp : req.body.temp,
			humidity : req.body.humidity,
			moisture : req.body.moisture,
			date_posted : formatter.format(new Date(), 'DD/MM/YYYY HH:mm:ss')
        });

        graph_data.save(function (err, graph_data) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating graph_data',
                    error: err
                });
            }

            return res.status(201).json(graph_data);
        });
    },

    /**
     * graph_dataController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        GraphDataModel.findOne({_id: id}, function (err, graph_data) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting graph_data',
                    error: err
                });
            }

            if (!graph_data) {
                return res.status(404).json({
                    message: 'No such graph_data'
                });
            }

            graph_data.recipient_id = req.body.recipient_id ? req.body.recipient_id : graph_data.recipient_id;
			graph_data.light = req.body.light ? req.body.light : graph_data.light;
			graph_data.temp = req.body.temp ? req.body.temp : graph_data.temp;
			graph_data.humidity = req.body.humidity ? req.body.humidity : graph_data.humidity;
			graph_data.moisture = req.body.moisture ? req.body.moisture : graph_data.moisture;
			graph_data.date_posted = req.body.date_posted ? req.body.date_posted : graph_data.date_posted;
			
            graph_data.save(function (err, graph_data) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating graph_data.',
                        error: err
                    });
                }

                return res.json(graph_data);
            });
        });
    },

    /**
     * graph_dataController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        GraphDataModel.findByIdAndRemove(id, function (err, graph_data) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the graph_data.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
