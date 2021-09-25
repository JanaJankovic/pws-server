var CommandModel = require('../models/commandModel.js');

/**
 * commandController.js
 *
 * @description :: Server-side logic for managing commands.
 */
module.exports = {

    /**
     * commandController.list()
     */
    list: function (req, res) {
        CommandModel.find(function (err, commands) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting command.',
                    error: err
                });
            }

            return res.json(commands);
        });
    },

    /**
     * commandController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CommandModel.findOne({_id: id}, function (err, command) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting command.',
                    error: err
                });
            }

            if (!command) {
                return res.status(404).json({
                    message: 'No such command'
                });
            }

            return res.json(command);
        });
    },

    /**
     * commandController.create()
     */
    create: function (req, res) {
        var command = new CommandModel({
			water : req.body.water,
			user_id : req.body.user_id,
			pin : req.body.pin
        });

        command.save(function (err, command) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating command',
                    error: err
                });
            }

            return res.status(201).json(command);
        });
    },

    /**
     * commandController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CommandModel.findOne({_id: id}, function (err, command) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting command',
                    error: err
                });
            }

            if (!command) {
                return res.status(404).json({
                    message: 'No such command'
                });
            }

            command.water = req.body.water ? req.body.water : command.water;
			command.user_id = req.body.user_id ? req.body.user_id : command.user_id;
			command.pin = req.body.pin ? req.body.pin : command.pin;
			
            command.save(function (err, command) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating command.',
                        error: err
                    });
                }

                return res.json(command);
            });
        });
    },

    /**
     * commandController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CommandModel.findByIdAndRemove(id, function (err, command) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the command.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
