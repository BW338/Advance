// src/components/ArticlesList.js

import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, IconButton, Box } from '@mui/material';
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ArticlesList = ({ articles, handleAddToCart, handleRemoveArticle }) => {
  return (
    <Grid container spacing={2} sx={{ display: 'flex', flexWrap: { xs: 'nowrap', md: 'wrap' }, flexDirection: { xs: 'row', md: 'row' } }}>
      {articles.map((article, index) => (
        <Grid item key={article.id} xs={12} sm={6} md={6} lg={6} sx={{ minWidth: { xs: '300px', md: 'auto' } }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card className="articleCard">
              <CardMedia
                component="img"
                height="140"
                image={'https://images.adsttc.com/media/images/638a/2c19/026c/6a01/70fd/b28f/large_jpg/guia-de-equipamiento-para-la-construccion-herramientas-equipos-y-maquinarias_30.jpg?1669999681'}
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
                  onClick={() => handleAddToCart(article)}
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
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default ArticlesList;
