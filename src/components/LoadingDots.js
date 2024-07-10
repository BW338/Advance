// src/components/LoadingDots.js

/** @jsxImportSource @emotion/react */
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

export default LoadingDots;
