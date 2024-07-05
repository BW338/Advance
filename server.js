app.post('/chat', async (req, res) => {
  const { prompt, userDetails } = req.body;

  try {
    console.log('Prompt recibido:', prompt);

    // Usar compromise para extraer palabras clave
    const doc = nlp(prompt);
    const keywords = doc.match('#Noun').out('array');
    console.log('Palabras clave extraídas:', keywords);

    // Filtrar artículos relevantes basados en las palabras clave
    const relevantArticles = articles.filter(article => 
      keywords.some(keyword => 
        article.title.toLowerCase().includes(keyword.toLowerCase()) || 
        article.description.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    let botMessages = [];

    if (relevantArticles.length > 0) {
      botMessages = relevantArticles.map(article => ({
        text: `Te sugerimos: ${article.title} - ${article.description} - Precio: ${article.price}`,
        image: article.image
      }));
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

      botMessages.push({ text: botResponse });

      // Verificar si la respuesta del AI contiene palabras clave relevantes
      const aiKeywords = nlp(botResponse).match('#Noun').out('array');
      const additionalArticles = articles.filter(article =>
        aiKeywords.some(keyword =>
          article.title.toLowerCase().includes(keyword.toLowerCase()) ||
          article.description.toLowerCase().includes(keyword.toLowerCase())
        )
      );

      if (additionalArticles.length > 0) {
        additionalArticles.forEach(article => {
          botMessages.push({
            text: `Además, te sugerimos: ${article.title} - ${article.description} - Precio: ${article.price}`,
            image: article.image
          });
        });
      }
    }

    res.json({ messages: botMessages });

  } catch (error) {
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: 'Error en el servidor al procesar la solicitud' });
  }
});
