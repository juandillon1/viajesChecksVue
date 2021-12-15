// Declaro variables principales
var express = require('express');
var app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
bodyParser =  require('body-parser'),
methodOverride = require('method-override'),
mongoose = require('mongoose');

// Defino estructura que usara express
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(methodOverride());

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Conecto la BD
mongoose.connection.openUri('mongodb+srv://admin:123321@cluster0.tdysj.mongodb.net/Viajes?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Base de Datos: Online')
})
.catch((err) => {
    console.log('Ocurrió un error al conectar a BD: ', err);
});

const Viaje = require('./models/Viajes');
app.get('/', function(req, res) {
    Viaje.find({})
            .exec(
                (err, Viajes) => {
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Ocurrió un error al recuperar los viajes',
                            errors: err
                        });
                    }
                    Viaje.countDocuments({}, (err, conteo) => {
                        return res.status(200).json({
                            ok: true,
                            viajes: Viajes,
                            total: conteo
                        })
                    });
                }
            )
});

app.post('/', (req, res) => {
    let body = req.body;
    let viaje = new Viaje({
        idViaje: body.idViaje,
        titulo: body.titulo,
        descripcion: body.descripcion,
        tipo: body.tipo,
        precio: body.precio,
        url: body.url,
        img: body.img,
    });
    viaje.save((err, viajeGuardado)=> {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear el viaje',
                errors: err,
            });
        }
        res.status(201).json({
            ok: true,
            viaje: viajeGuardado,
        });
    });
});

app.delete('/:id', (req, res) => {
    const id = req.params.id;
    Viaje.findByIdAndRemove(id, (err, viajeBorrado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar viaje',
                errors: err
            });
        }
        if (!viajeBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un viaje con esa Id: ' + id,
                errors: { message: 'No existe un viaje con esa Id: ' + id }
            });
        }
        res.status(200).json({
            ok: true,
            viaje: viajeBorrado
        });
    })
});

app.put('/:id', (req, res) => {
    const id = req.params.id;
    let body = req.body;
    let newViaje = new Viaje({
        idViaje: body.idViaje,
        titulo: body.titulo,
        descripcion: body.descripcion,
        tipo: body.tipo,
        precio: body.precio,
        url: body.url,
        img: body.img,
    });
    Viaje.findById(id, (err, viaje) => {
        viaje.idViaje = (newViaje.idViaje) ? newViaje.idViaje: viaje.idViaje;
        viaje.titulo = (newViaje.titulo) ? newViaje.titulo: viaje.titulo;
        viaje.descripcion = (newViaje.descripcion) ? newViaje.descripcion: viaje.descripcion;
        viaje.tipo = (newViaje.tipo) ? newViaje.tipo: viaje.tipo;
        viaje.precio = (newViaje.precio) ? newViaje.precio: viaje.precio;
        viaje.url = (newViaje.url) ? newViaje.url: viaje.url;
        viaje.img = (newViaje.img) ? newViaje.img: viaje.img;
        // viaje = newViaje
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar viajes',
                errors: err
            });
        }
        if (!viaje) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El viaje con el id ' + id + ' no existe',
                errors: { message: 'No existe un viaje con ese ID' }
            });
        }
        viaje.save((err, viajeGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar viaje',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Proyecto actualizado con éxito',
                viaje: viajeGuardado
            });
        });
    });
});





