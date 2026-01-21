import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';

// Asegurar que las variables de entorno estén cargadas
dotenv.config();

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Configuración Google OAuth
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectUri =
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';

let googleClient = null;
if (googleClientId && googleClientSecret) {
  googleClient = new OAuth2Client(googleClientId, googleClientSecret, googleRedirectUri);
}

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// @desc    Login usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario y incluir password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (name) user.name = name;

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Ese email ya está en uso' });
      }
      user.email = email;
    }

    if (typeof avatar === 'string') {
      user.avatar = avatar;
    }

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar || '',
      token: generateToken(updated._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

// @desc    Eliminar cuenta del usuario
// @route   DELETE /api/auth/me
// @access  Private
export const deleteMe = async (req, res) => {
  try {
    const userId = req.user._id;

    // Eliminar tareas asociadas
    await Task.deleteMany({ userId });

    // Eliminar usuario
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la cuenta', error: error.message });
  }
};

// @desc    Subir/actualizar avatar del usuario
// @route   POST /api/auth/avatar
// @access  Private
export const uploadAvatarController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ninguna imagen' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const relativePath = `/uploads/avatars/${path.basename(req.file.path)}`;
    user.avatar = relativePath;
    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar || '',
      token: generateToken(updated._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir avatar', error: error.message });
  }
};

// @desc    Redirigir a Google OAuth
// @route   GET /api/auth/google
// @access  Public
export const googleAuthRedirect = async (req, res) => {
  try {
    if (!googleClient) {
      return res
        .status(500)
        .json({ message: 'Google OAuth no está configurado en el servidor' });
    }

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    const url = googleClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
    });

    return res.redirect(url);
  } catch (error) {
    res.status(500).json({ message: 'Error al redirigir a Google', error: error.message });
  }
};

// @desc    Callback de Google OAuth
// @route   GET /api/auth/google/callback
// @access  Public
export const googleAuthCallback = async (req, res) => {
  try {
    if (!googleClient) {
      return res
        .status(500)
        .json({ message: 'Google OAuth no está configurado en el servidor' });
    }

    const { code } = req.query;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (!code) {
      // Si el usuario cancela en Google o no se envía código,
      // redirigimos silenciosamente al login del frontend.
      return res.redirect(`${frontendUrl}/login`);
    }

    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const profile = await response.json();

    if (!profile || !profile.email) {
      return res
        .status(400)
        .json({ message: 'No se pudo obtener la información del usuario de Google' });
    }

    // Buscar o crear usuario
    let user = await User.findOne({ email: profile.email });

    if (!user) {
      const randomPassword =
        Math.random().toString(36).slice(2) + Date.now().toString(36).slice(2);

      user = await User.create({
        name: profile.name || profile.given_name || 'Usuario Google',
        email: profile.email,
        password: randomPassword,
        avatar: profile.picture || '',
        googleId: profile.id,
      });
    } else {
      // Si el usuario ya existía, sincronizamos algunos datos con Google
      user.googleId = user.googleId || profile.id;
      if (profile.name || profile.given_name) {
        user.name = profile.name || profile.given_name;
      }
      if (profile.picture) {
        user.avatar = profile.picture;
      }
      await user.save();
    }

    const token = generateToken(user._id);

    const redirectUrl = `${frontendUrl}/google-callback?token=${encodeURIComponent(token)}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error en callback de Google:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/login`);
  }
};
