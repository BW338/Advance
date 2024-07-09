import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, IconButton, Box, Grid } from '@mui/material';
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import './App.css';

const SERVER_URL = 'http://192.168.0.9:5001';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [relevantArticles, setRelevantArticles] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    handleUserDetails();
    askForLocationPermission();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const askForLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation(`Lat: ${latitude}, Lon: ${longitude}`);
          // Enviar la ubicación al servidor si es necesario
          console.log(`Ubicación del usuario: Lat: ${latitude}, Lon: ${longitude}`);
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    } else {
      console.error('Geolocalización no soportada por este navegador');
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    try {
      const conversationHistory = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
      const prompt = userName ? `${conversationHistory}\nUsuario: ${input}` : `${conversationHistory}\n${input}`;

      const response = await axios.post(`${SERVER_URL}/chat`, { prompt, userDetails: { name: userName, age: userAge, location: userLocation } });

      const botMessages = response.data.messages;
      setRelevantArticles(response.data.articles || []);

      botMessages.forEach(msg => {
        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: msg.text, image: msg.image }]);
      });

    } catch (error) {
      console.error('Error al enviar solicitud al servidor:', error);
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleUserDetails = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    cookies.forEach(cookie => {
      const [key, value] = cookie.split('=');
      if (key.trim() === 'user_name') setUserName(value);
      if (key.trim() === 'user_age') setUserAge(value);
      if (key.trim() === 'user_location') setUserLocation(value);
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'userDetails',
      name: userName,
      age: userAge,
      location: userLocation,
    });

    if (userName) {
      const userMessage = `Hola ${userName}, ¿en qué puedo ayudarte?`;
      const botMessage = { sender: 'bot', text: userMessage };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }
  };

  const handleAddToCart = (articleId) => {
    // Implementa la lógica para agregar artículo al carrito
    console.log(`Artículo ${articleId} agregado al carrito`);
  };

  const handleRemoveArticle = (articleId) => {
    // Implementa la lógica para eliminar artículo de la lista
    setRelevantArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
  };

  return (
    <div className="container">
      <div className="chatBox">
        <div className="messagesContainer">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === 'user' ? 'userMessage' : 'botMessage'}>
              <p className="messageText">{msg.text}</p>
              {msg.image && <img src={msg.image} alt="Artículo sugerido" className="messageImage" />}
            </div>
          ))}
          <div ref={scrollViewRef}></div>
        </div>
        <div className="inputContainer">
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe algo..."
          />
          <button className="sendButton" onClick={handleSend}>Enviar</button>
        </div>
      </div>
      <div className="articlesContainer">
        {relevantArticles.length > 0 ? (
          <Box sx={{ overflowX: 'auto', overflowY: { xs: 'initial', md: 'auto' } }}>
            <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'nowrap', flexDirection: { xs: 'row', md: 'column' } }}>
              {relevantArticles.map(article => (
                <Grid item key={article.id} xs={12} sm={6} md={4} lg={3} sx={{ minWidth: '300px' }}>
                  <Card className="articleCard">
                    <CardMedia
                      component="img"
                      height="140"
                      image={'https://images.adsttc.com/media/images/638a/2c19/026c/6a01/70fd/b28f/large_jpg/guia-de-equipamiento-para-la-construccion-herramientas-equipos-y-maquinarias_30.jpg?1669999681'}
                      // image={article.image}
                      alt={article.title}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {article.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Precio: ${article.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Vendedor: {article.seller}
                      </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px 16px 16px' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => handleAddToCart(article.id)}
                      >
                        Agregar al Carrito
                      </Button>
                      <IconButton
                        color="secondary"
                        onClick={() => handleRemoveArticle(article.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No se encontraron artículos relevantes.
          </Typography>
        )}
      </div>
    </div>
  );
}

export default App;
