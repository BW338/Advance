// src/components/Toolbar.js

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import icono from '../assets/icono.png';  // Asegúrate de que la ruta sea correcta

const AppToolbar = ({ cartItemsCount, toggleCartModal }) => (
  <AppBar position="static">
    <Toolbar>
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <img src={icono} alt="Icono" style={{ height: '50px', marginRight: '10px', borderRadius:16 }} />  {/* Ajusta el tamaño y margen según sea necesario */}
        <Typography variant="h4">
          AI-Commerce
        </Typography>
      </Box>
      <IconButton color="inherit">
        <Badge badgeContent={4} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <IconButton edge="end" color="inherit" onClick={toggleCartModal}>
        <Badge badgeContent={cartItemsCount} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Toolbar>
  </AppBar>
);

export default AppToolbar;
