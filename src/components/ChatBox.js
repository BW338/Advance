// src/components/ChatBox.js

import React, { useRef, useEffect } from 'react';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeInOut = keyframes`
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
`;

const Dot = styled.span`
  animation: ${fadeInOut} 1s infinite;
  &:nth-of-type(1) { animation-delay: 0s; }
  &:nth-of-type(2) { animation-delay: 0.33s; }
  &:nth-of-type(3) { animation-delay: 0.66s; }
`;

const LoadingDots = () => (
  <div css={css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  `}>
    <Dot>•</Dot>
    <Dot>•</Dot>
    <Dot>•</Dot>
  </div>
);

const ChatBox = ({ messages, input, setInput, handleSend, isInputDisabled }) => {
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatBox" style={{ flex: 2, display: 'flex', flexDirection: 'column', padding: '10px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
      <div className="messagesContainer">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'userMessage' : 'botMessage'}>
            <p className="messageText">{msg.text}</p>
            {msg.image && <img src={msg.image} alt="Artículo sugerido" className="messageImage" />}
          </div>
        ))}
        {isInputDisabled && (
          <div className="botMessage">
            <LoadingDots />
          </div>
        )}
        <div ref={scrollViewRef}></div>
      </div>
      <div className="inputContainer">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe algo..."
          disabled={isInputDisabled}
        />
        <button className="sendButton" onClick={handleSend} disabled={isInputDisabled}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatBox;
