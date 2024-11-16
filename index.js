require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importar cors
const sequelize = require('./config/database');
const todoRoutes = require('./routes/todoRoutes');
const WebSocket = require('ws'); // Importar WebSocket

const app = express();

// Configuración de CORS para permitir solo el frontend autorizado https://app-todo-three-nu.vercel.app/
app.use(cors({
  origin: 'https://app-todo-three-nu.vercel.app' // Reemplaza con la URL de tu frontend
}));

app.use(express.json());
app.use('/api', todoRoutes);

// Crear un servidor WebSocket en el mismo puerto o en otro puerto
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Nuevo cliente WebSocket conectado');
  
  // Enviar un mensaje inicial como JSON válido
  ws.send(JSON.stringify({ message: 'Conectado al servidor de todos' }));

  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);
  });

  ws.on('error', (error) => {
    console.error('Error en WebSocket:', error);
  });

  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
  });
});

// Hacer que Express maneje las conexiones WebSocket
app.server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor Express corriendo en el puerto ${process.env.PORT || 3000}`);
});

// Usar WebSocket con el servidor de Express
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Sincronizar base de datos
sequelize.sync().then(() => {
  console.log('Base de datos sincronizada');
}).catch(error => console.log('Error al sincronizar la base de datos', error));

// Notificar a todos los clientes WebSocket cuando se actualicen los todos
function notifyClientsAboutTodoUpdate() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('Todos have been updated');
    }
  });
}

module.exports = { wss, notifyClientsAboutTodoUpdate };
