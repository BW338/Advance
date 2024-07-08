const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const articles = require('./articles');

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const AI_SERVER_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyClhi1RbxDSOePDeLRlBmGSQ_JKdwD9kCk';

console.log('Títulos de los artículos:', articles.map(article => article.title));

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

    // Verificar si algún título de artículo completo se menciona en la respuesta de la IA
    const matchedTitles = articles.filter(article => botResponse.includes(article.title.toLowerCase()));

    console.log('Artículos relevantes encontrados:', matchedTitles);

    const botMessages = [{ text: botResponse }];
   {/*  if (matchedTitles.length > 0) {
      matchedTitles.forEach(article => {
        botMessages.push({
          text: `Te sugerimos: ${article.title} - ${article.description} - Precio: ${article.price}`,
          image: article.image
        });
      });
    } else {
      botMessages.push({ text: 'No se encontraron artículos relevantes.' });
    }
*/}
    res.json({ messages: botMessages, articles: matchedTitles });

  } catch (error) {
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: 'Error en el servidor al procesar la solicitud' });
  }
});

app.get('/articles', (req, res) => {
  res.json(articles);
});

app.listen(5001, () => {
  console.log('Servidor escuchando en el puerto 5001');
});
