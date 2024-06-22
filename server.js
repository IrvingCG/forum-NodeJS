require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Conectar a la base de datos
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method')); // Añadir method-override


// Rutas
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/topicRoutes'));
app.use('/api', require('./routes/commentRoutes'));

// Ruta base
app.get('/', (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
