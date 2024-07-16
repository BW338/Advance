import React from 'react';
import { Modal, Box, Typography, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Grid, CardMedia, Button } from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CartModal = ({ open, handleClose, cartItems, handleRemoveFromCart }) => {
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '800px', // Ancho máximo del modal
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    outline: 'none',
    borderRadius: '8px',
  };

  const listContainerStyle = {
    maxHeight: '70vh', // Altura máxima del contenedor de la lista de artículos
    overflowY: 'auto', // Añade scroll si la lista excede la altura máxima
    padding: '0 16px', // Ajuste de espaciado interno
  };

  const summaryStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '16px',
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Carrito de Compras
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={listContainerStyle}>
              <List>
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 80, height: 80, borderRadius: '4px', marginRight: '16px' }}
                        image={'https://images.adsttc.com/media/images/638a/2c19/026c/6a01/70fd/b28f/large_jpg/guia-de-equipamiento-para-la-construccion-herramientas-equipos-y-maquinarias_30.jpg?1669999681'}                        alt={item.title}
                      />
                      <ListItemText
                        primary={item.title}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Precio: ${item.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Vendedor: {item.seller}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromCart(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hay artículos en el carrito.
                  </Typography>
                )}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={summaryStyle}>
              <Typography variant="h6" component="div">
                Resumen de compra
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Producto</Typography>
                <Typography>${cartItems.reduce((acc, item) => acc + item.price, 0)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Envío</Typography>
                <Typography>${/* Aquí puedes añadir el costo de envío si lo tienes */0}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" component="div">Total</Typography>
                <Typography variant="h6" component="div">${cartItems.reduce((acc, item) => acc + item.price, 0)}</Typography>
              </Box>
              <Button variant="contained" color="primary" fullWidth>
                Continuar compra
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CartModal;
