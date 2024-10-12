require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importar cors
const sequelize = require('./config/database');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
app.use(cors()); // Usar cors
app.use(express.json());
app.use('/api', todoRoutes);

// Sincronizar base de datos
sequelize.sync().then(() => {
  console.log('Base de datos sincronizada');
}).catch(error => console.log('Error al sincronizar la base de datos', error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
