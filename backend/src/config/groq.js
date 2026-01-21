import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default groq;
