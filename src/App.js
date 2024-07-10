import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

import AppToolbar from './components/Toolbar';
import ArticlesList from './components/ArticlesList';
import ChatBox from './components/ChatBox';
import CartModal from './components/CartModal';

import './App.css';

const SERVER_URL = 'http://192.168.0.9:5001';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [relevantArticles, setRelevantArticles] = useState([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  useEffect(() => {
    handleUserDetails();
    askForLocationPermission();
  }, []);

  const askForLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation(`Lat: ${latitude}, Lon: ${longitude}`);
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
    setIsInputDisabled(true);

    try {
      const conversationHistory = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
      const prompt = `${conversationHistory}\nUsuario: ${input}`;

      const response = await axios.post(`${SERVER_URL}/chat`, { prompt, userDetails: { name: userName, age: userAge, location: userLocation } });

      const botMessages = response.data.messages;
      setRelevantArticles(response.data.articles || []);

      botMessages.forEach(msg => {
        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: msg.text, image: msg.image }]);
      });

    } catch (error) {
      console.error('Error al enviar solicitud al servidor:', error);
    }

    setIsInputDisabled(false);
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

  const handleAddToCart = (article) => {
    setCartItems(prevItems => [...prevItems, article]);
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const handleRemoveArticle = (articleId) => {
    setRelevantArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
  };

  const toggleCartModal = () => {
    setIsCartModalOpen(prevOpen => !prevOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppToolbar cartItemsCount={cartItems.length} toggleCartModal={toggleCartModal} />
      <Box sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden' }}>
        <ChatBox
          messages={messages}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isInputDisabled={isInputDisabled}
        />
        <Box className="articlesContainer" sx={{ flex: 1, overflowX: { xs: 'auto', md: 'hidden' }, overflowY: { xs: 'hidden', md: 'auto' }, padding: '10px' }}>
          {relevantArticles.length > 0 ? (
            <ArticlesList
              articles={relevantArticles}
              handleAddToCart={handleAddToCart}
              handleRemoveArticle={handleRemoveArticle}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No se encontraron artículos relevantes.
            </Typography>
          )}
        </Box>
      </Box>
      <CartModal
        open={isCartModalOpen}
        handleClose={toggleCartModal}
        cartItems={cartItems}
        handleRemoveFromCart={handleRemoveFromCart}
      />
    </Box>
  );
}

export default App;
