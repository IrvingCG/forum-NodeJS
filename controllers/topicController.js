const Topic = require('../models/Topic');
const User = require('../models/User');


exports.renderTopic = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      const successMsg = req.query.successMsg;
      const errorMsg = req.query.errorMsg;
      res.render('topic', { user, successMsg, errorMsg }); // Pasar el objeto user y mensajes a la vista
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error de servidor');
    }
  };
  exports.createTopic = async (req, res) => {
    const { title, content, lang } = req.body;
    const userId = req.user.id; // Obtenemos el ID del usuario desde el token JWT
  
    try {
      // Verificar si el usuario existe
      const user = await User.findById(userId);
      if (!user) {
        return res.redirect('/api/create-topic?errorMsg=Usuario no encontrado');
      }
  
      // Verificar si ya existe un tema con el mismo título para el usuario
      const existingTopic = await Topic.findOne({ title, user: userId });
      if (existingTopic) {
        return res.redirect('/api/create-topic?errorMsg=Ya existe un tema con este título');
      }
  
      // Crear un nuevo tema
      const newTopic = new Topic({
        title,
        content,
        lang,
        user: userId // Asignamos el ID del usuario
      });
  
      // Guardar el nuevo tema en la base de datos
      await newTopic.save();
  
      // Redirigir al formulario de creación de temas con un mensaje de éxito
      res.redirect('/api/create-topic?successMsg=Tema registrado correctamente');
    } catch (err) {
      console.error(err.message);
      res.redirect('/api/create-topic?errorMsg=Error de servidor');
    }
  };
  exports.getTopics = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const successMsg = req.query.successMsg;
        const errorMsg = req.query.errorMsg;

        // Obtener todos los temas desde la base de datos, poblados con los detalles del usuario
        const topics = await Topic.find().populate('user', 'name surname');

        // Verificar si se obtuvieron temas y renderizar la vista correspondiente
        if (topics && topics.length > 0) {
            res.render('vertopic', { user, topics, successMsg, errorMsg });
        } else {
            res.render('vertopic', { user, errorMsg: 'No hay temas registrados' });
        }
    } catch (err) {
        console.error('Error al obtener temas:', err);
        res.status(500).send('Error de servidor al obtener temas');
    }
};
// Función para eliminar un tema por su ID
exports.deleteTopic = async (req, res) => {
    const topicId = req.params.topicId;

    try {
        // Buscar y eliminar el tema por su ID
        const deletedTopic = await Topic.findByIdAndDelete(topicId);

        if (!deletedTopic) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        // Redirigir a la página de temas con un mensaje de éxito
        res.redirect('/api/get-topics?successMsg=Tema eliminado correctamente');
    } catch (err) {
        console.error('Error al eliminar tema:', err);
        res.redirect('/api/get-topics?errorMsg=Error al eliminar el tema');
    }
};