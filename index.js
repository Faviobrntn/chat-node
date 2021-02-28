const path = require('path');
const express = require('express');
const app = express();
const SocketIO = require("socket.io");

// Configuraciones
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'public'));

app.use(express.static(path.join(__dirname, 'public'))); //defino la carpeta publica para css/js/imagenes/etc..

//Rutas
app.get('/.*$/', (req, res) => {
    res.sendFile(app.get('views'));
});


//Puesta en marcha del servidor
const servidor = app.listen(app.get('port'), () => {
    console.log("Servidor corriendo en http://localhost:" + app.get('port'));
});


//Sockets
const io = SocketIO(servidor); // TAMBIÉN PUEDE DEFINIRSE: const io = SocketIO.listen(servidor);
var conectados = [];

io.on('connection', (socket) => {
    console.log("Conectado al Socket: ", socket.id);

    
    io.emit('chat:usuario', {
        id: socket.id
    });
    
    socket.on('chat:ingreso', (datos) => {
        conectados.push({id: socket.id, nombre: datos.nombre});
        // socket.broadcast.emit('chat:ingreso', conectados);
        io.emit('chat:ingreso', conectados.map(function(obj){
            var rObj = {};
            rObj["nombre"] = obj.nombre;
            return rObj;
        }));
    });

    socket.on('chat:mensaje', (datos) => {
        io.emit('chat:mensaje', {
            id: socket.id,
            nombre: datos.nombre,
            mensaje: datos.mensaje
        });
    });
    
    socket.on('chat:escribiendo', (datos) => {
        socket.broadcast.emit('chat:escribiendo', datos);
    });
    
    
    socket.on("disconnect", (reason) => {
        console.log("Desconectado el Socket: ", socket.id);
        console.log("Razón:", reason); // "ping timeout"

        let id = conectados.findIndex((obj) => {
            return obj.id == socket.id;
        });
        conectados.splice(id, 1);

        io.emit('chat:ingreso', conectados.map(function(obj){
            var rObj = {};
            rObj["nombre"] = obj.nombre;
            return rObj;
        }));
    });
});
