import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, IconButton, Box } from '@mui/material';
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import './App.css';

const SERVER_URL = 'http://192.168.0.9:5001'; 

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [articles, setArticles] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    handleUserDetails();
    fetchArticles(); // Llama a la función para obtener artículos al cargar la página
  }, []);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    try {
      const prompt = userName ? `${input} (Usuario: ${userName})` : input;

      const response = await axios.post(`${SERVER_URL}/chat`, { prompt, userDetails: { name: userName, age: userAge, location: userLocation } });

      const botMessages = response.data.messages;

      botMessages.forEach(msg => {
        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: msg.text, image: msg.image }]);
      });

      fetchArticles(); // Actualiza la lista de artículos después de recibir los mensajes

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

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/articles`);
      setArticles(response.data); // Establece los artículos obtenidos del servidor
    } catch (error) {
      console.error('Error al obtener artículos del servidor:', error);
    }
  };

  const handleAddToCart = (articleId) => {
    // Implementa la lógica para agregar artículo al carrito
    console.log(`Artículo ${articleId} agregado al carrito`);
  };

  const handleRemoveArticle = (articleId) => {
    // Implementa la lógica para eliminar artículo de la lista
    setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
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
        {articles.map(article => (
          <Card key={article.id} className="articleCard">
            <CardMedia
              component="img"
              height="140"
              image={article.image}
              alt={article.title}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                {article.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${article.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {article.freeShipping && 'Envío gratis'}
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
        ))}
      </div>
    </div>
  );
}

export default App;
