const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const AI_SERVER_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyClhi1RbxDSOePDeLRlBmGSQ_JKdwD9kCk';

// Lista de artículos
const articles = [
  {
    id: 1,
    title: "Taladro Inalámbrico",
    description: "Taladro inalámbrico de 210V con dos baterías y maletín de transporte.",
    price: "199.99",
   // image: require("./assets/taladro.png")
  },
  {
    id: 2,
    title: "Juego de Destornilladores",
    description: "Juego de destornilladores de precisión de 12 piezas.",
    price: "19.99",
    image: "https://example.com/destornilladores.jpg"
  },
  {
    id: 3,
    title: "Sierra Circular",
    description: "Sierra circular de 1500W con hoja de 185 mm.",
    price: "79.99",
    image: "https://example.com/sierra.jpg"
  }
];

app.post('/chat', async (req, res) => {
  const { prompt, userDetails } = req.body;

  try {
    console.log('Prompt recibido:', prompt);

    // Filtrar artículos relevantes basados en el prompt del usuario
    const relevantArticles = articles.filter(article => 
      article.title.toLowerCase().includes(prompt.toLowerCase()) || 
      article.description.toLowerCase().includes(prompt.toLowerCase())
    );

    if (relevantArticles.length > 0) {
      const botMessages = relevantArticles.map(article => ({
        text: `Te sugerimos: ${article.title} - ${article.description} - Precio: ${article.price}`,
        image: article.image
      }));
      res.json({ messages: botMessages });
    } else {
      // Si no hay artículos relevantes, enviar el mensaje a la AI
      const aiResponse = await axios.post(AI_SERVER_URL, {
        contents: [{ parts: [{ text: prompt }] }]
      });

      console.log('Respuesta de Google AI:', aiResponse.data);
      let botResponse = aiResponse.data.candidates[0].content.parts[0].text;

      // Personaliza la respuesta basada en userDetails si están disponibles
      if (userDetails) {
        if (prompt.toLowerCase() === 'cómo me llamo?' && userDetails.name) {
          botResponse = `Te llamas ${userDetails.name}.`;
        } else if (prompt.toLowerCase() === 'dónde vivo?' && userDetails.location) {
          botResponse = `Vives en ${userDetails.location}.`;
        } else if (prompt.toLowerCase() === 'cuántos años tengo?' && userDetails.age) {
          botResponse = `Tienes ${userDetails.age} años.`;
        }
      }

      res.json({ messages: [{ text: botResponse }] });
    }

  } catch (error) {
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: 'Error en el servidor al procesar la solicitud' });
  }
});

// Ruta para obtener artículos
app.get('/articles', (req, res) => {
  res.json(articles);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
