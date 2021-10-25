var ArduinorequestModel = require('../models/arduinoRequestModel.js');
var RecipientModel = require('../models/recipientModel.js');

function validatePins(byteAddress, moisturePin, relayPin){
    return /^([0-1]{4})$/.test(byteAddress) &&
           /^(A[0-9])$/.test(moisturePin) &&
           (relayPin > 20 && relayPin < 54)
}

module.exports = {

    /**
     * arduinoRequestController.show()
     */
    show: function (req, res) {
        var uid = req.params.user_id;

        ArduinorequestModel.findOne({user_id: uid, completed: false}, function (err, arduinoRequest) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting arduinoRequest.',
                    error: err
                });
            }

            if (!arduinoRequest) {
                return res.status(404).json({
                    message: 'No such arduinoRequest'
                });
            }

            return res.json(arduinoRequest);
        });
    },

    /**
     * arduinoRequestController.create()
     */
    create: function (req, res) {
        if(validatePins(req.body.byte_address, req.body.moisture_pin, req.body.relay_pin)){
            RecipientModel.findOne(
                {
                    byte_address: req.body.byte_address,
                    relay_pin: req.body.relay_pin,
                    moisture_pin: req.body.moisture_pin
                    
                }, function (err, recipient) {
                
                    if (err) {
                        return res.status(404).json({
                            message: 'Error when getting the recipient',
                        });
                    }
    
                    if (!recipient) {
                        return res.status(404).json({
                            message: 'No such recipient',
                        });
                    }

                    var arduinoRequest = new ArduinorequestModel({
                        user_id : req.body.user_id,
                        byte_address : req.body.byte_address,
                        moisture_pin : req.body.moisture_pin,
                        relay_pin : req.body.relay_pin,
                        activate_pump : req.body.activate_pump,
                        fetch_data : req.body.fetch_data,
                        completed: false
                    });
            
                    arduinoRequest.save(function (err, arduinoRequest) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when creating arduinoRequest',
                                error: err
                            });
                        }
            
                        return res.status(201).json(arduinoRequest);
                    });
    
            });

        } else {
            return res.status(400).json({
                message: 'Invalid body'
            });
        }
    },

    /**
     * arduinoRequestController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ArduinorequestModel.findByIdAndRemove(id, function (err, arduinoRequest) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the arduinoRequest.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
