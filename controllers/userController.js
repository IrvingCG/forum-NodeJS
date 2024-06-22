const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.renderIndex = (req, res) => {
  res.render('index');
};
exports.renderRegistro = (req, res) => {
  res.render('register');
};
exports.renderLogin = (req, res) => {
  res.render('login');
};
exports.renderHome = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.render('home', { user }); // Pasar el objeto user a la vista
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error de servidor');
  }
};
exports.renderProfileU = async(req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.render('updateU', { user }); // Pasar el objeto user a la vista
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error de servidor');
  }
};
exports.logout = (req, res) => {
  // Aquí puedes limpiar cualquier cookie, sesión, o datos de usuario de la sesión
  res.clearCookie('token'); // Elimina la cookie llamada 'token' (si la tienes)
  res.redirect('/api/index'); // Redirige a la página de inicio (index.ejs en tu caso)
};
exports.register = async (req, res) => {
  const { name, surname, email, password} = req.body; // Incluir profilePic en los datos del formulario
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).render('register', { error: 'El usuario ya se encuentra registrado' });
    }

    user = new User({
      name,
      surname,
      email,
      password: await bcrypt.hash(password, 10)
    });

    await user.save();
    res.render('register', { success: 'Se registró correctamente al usuario' });
  } catch (err) {
    console.error(err.message);
    res.status(500).render('register', { error: 'Error de servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render('login', { error: 'Las credenciales son inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('login', { error: 'Las credenciales son inválidas' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error(err.message);
          return res.status(500).render('login', { error: 'Error de servidor' });
        }
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/api/home');
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).render('login', { error: 'Error de servidor' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name surname email'); // Selecciona los campos que deseas mostrar
    if (!user) {
      return res.status(404).render('perfil', { error: 'Usuario no encontrado' });
    }
    res.render('perfil', { user });
  } catch (err) {
    console.error(err.message);
    res.status(500).render('perfil', { error: 'Error de servidor' });
  }
};
exports.updateUser = async (req, res) => {
  const { name, surname, email } = req.body;
  const userId = req.user.id; // Suponemos que el ID del usuario se obtiene del token JWT

  try {
    // Verificar si el usuario existe
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).render('userU', { error: 'Usuario no encontrado' });
    }

    // Actualizar los campos solo si se proporcionan en la solicitud
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) user.email = email;

    // Guardar el usuario actualizado en la base de datos
    await user.save();

   

    // Volver a buscar el usuario actualizado con los campos seleccionados
    user = await User.findById(userId).select('name surname email');

    // Renderizar la vista de perfil con los datos actualizados
    res.render('updateU', { user, successMsg: 'Perfil actualizado correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).render('updateU', { error: 'Error de servidor' });
  }
};