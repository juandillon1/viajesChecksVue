var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var ViajeSchema = new Schema({
    idViaje: {type: String},
    titulo: {type: String},
    descripcion: {type: String},
    tipo: {type: String},
    subtipo: {type: String},
    precio: {type: Number},
    url: {type: String},
    img: {type: String},
});
module.exports = Mongoose.model('Viaje', ViajeSchema, 'viajes');