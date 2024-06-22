const express = require('express');
const router = express.Router();
const { createTopic, renderTopic ,getTopics,deleteTopic} = require('../controllers/topicController');
const { renderHome } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/home', authMiddleware, renderHome); // Renderizar la página de inicio para usuarios autenticados
router.get('/create-topic', authMiddleware, renderTopic); // Renderizar el formulario de creación de temas
router.post('/create-topic', authMiddleware, createTopic); // Procesar la creación de un nuevo tema
router.get('/get-topic', authMiddleware, getTopics);
router.delete('/delete-topic/:topicId', authMiddleware, deleteTopic); // Ruta para eliminar temas


module.exports = router;
