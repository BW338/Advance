const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const hardwareStore = require('./hardwareStore');
const constructionMaterials = require('./constructionMaterials');
const metalItems = require('./metalItems');
const services = require('./services');

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const AI_SERVER_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyClhi1RbxDSOePDeLRlBmGSQ_JKdwD9kCk';

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    console.log('Prompt recibido:', prompt);

    // Enviar mensaje a la IA
    const aiResponse = await axios.post(AI_SERVER_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    console.log('Respuesta de Google AI:', aiResponse.data);
    const botResponse = aiResponse.data.candidates[0].content.parts[0].text.toLowerCase();

    // Combinar todos los artículos en un solo array
    const allArticles = [...hardwareStore, ...constructionMaterials, ...metalItems, ...services];
    const matchedTitles = allArticles.filter(article => botResponse.includes(article.title.toLowerCase()));

    console.log('Artículos relevantes encontrados:', matchedTitles);

    const botMessages = [{ text: botResponse }];
    if (matchedTitles.length > 0) {
      matchedTitles.forEach(article => {
        botMessages.push({
          text: `Te sugerimos: ${article.title} - ${article.description} - Precio: ${article.price}`,
          image: article.image
        });
      });
    } else {
      botMessages.push({ text: 'No se encontraron artículos relevantes.' });
    }

    res.json({ messages: botMessages, articles: matchedTitles });

  } catch (error) {
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: 'Error en el servidor al procesar la solicitud' });
  }
});

app.get('/hardwareStore', (req, res) => {
  res.json(hardwareStore);
});

app.get('/constructionMaterials', (req, res) => {
  res.json(constructionMaterials);
});

app.get('/metalItems', (req, res) => {
  res.json(metalItems);
});

app.get('/services', (req, res) => {
  res.json(services);
});

app.listen(5001, () => {
  console.log('Servidor escuchando en el puerto 5001');
});
