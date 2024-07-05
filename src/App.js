import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const SERVER_URL = 'http://192.168.0.9:5001'; // Asegúrate de utilizar la IP correcta de tu servidor Node.js

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [articles, setArticles] = useState([]);
  const scrollViewRef = useRef();

  const handleSend = async () => {
    if (input.trim() === '') return;
  
    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(''); // Limpia el campo de entrada después de enviar el mensaje
  
    try {
      // Incluir el nombre del usuario en el mensaje enviado al servidor si está disponible
      const prompt = userName ? `${input} (Usuario: ${userName})` : input;
  
      // Enviar mensaje al servidor
      const response = await axios.post(`${SERVER_URL}/chat`, { prompt, userDetails: { name: userName, age: userAge, location: userLocation } });
      
      response.data.messages.forEach(msg => {
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: msg.text, image: msg.image }]);
      });
  
      // Enviar datos a Google Tag Manager (GTM)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'userMessageSent',
        message: input, // Envía el mensaje del usuario como parte de los datos
      });
  
      // Obtener artículos sugeridos
      const relevantArticles = await axios.get(`${SERVER_URL}/articles`);
      setArticles(relevantArticles.data.filter(article => 
        article.title.toLowerCase().includes(input.toLowerCase()) || 
        article.description.toLowerCase().includes(input.toLowerCase())
      ));
  
    } catch (error) {
      console.error('Error al enviar solicitud al servidor:', error);
    }
  
    // Esperar un poco antes de hacer scroll al final
    setTimeout(() => {
      scrollViewRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  

  // Función para manejar los detalles del usuario y enviarlos a GTM
  const handleUserDetails = () => {
    // Leer cookies y establecer estados correspondientes
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    cookies.forEach(cookie => {
      const [key, value] = cookie.split('=');
      if (key.trim() === 'user_name') setUserName(value);
      if (key.trim() === 'user_age') setUserAge(value);
      if (key.trim() === 'user_location') setUserLocation(value);
    });

    // Enviar datos a GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'userDetails',
      name: userName,
      age: userAge,
      location: userLocation,
    });

    // Manejar detalles del usuario para personalizar el mensaje
    if (userName) {
      const userMessage = `Hola ${userName}, ¿en qué puedo ayudarte?`;
      const botMessage = { sender: 'bot', text: userMessage };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  // Llamar a handleUserDetails cuando se monta el componente y cuando cambian los datos del usuario
  useEffect(() => {
    handleUserDetails();
  }, []);

  return (
    <div className="container">
      <div className="chatBox">
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
          placeholder="Escribe tu mensaje..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()} // Para enviar el mensaje al presionar "Enter"
        />
        <button className="sendButton" onClick={handleSend}>
          Enviar
        </button>
      </div>
      <div className="articlesContainer">
        {articles.map((article) => (
          <div key={article.id} className="articleCard">
            <img src={article.image} alt={article.title} className="articleImage" />
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <p className="articlePrice">${article.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
  
  
}

export default App;
