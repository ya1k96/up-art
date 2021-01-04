const express = require('express');
const jwt = require("jsonwebtoken");

let rutas = { }

rutas.admin = (req, res, next) => {    
  if ( req.query.token ) {
    const token = req.query.token;

    if (token) {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          next();
        }
    });
  } else {
    return res.send({ 
        mensaje: 'Token no proveída.' 
    });
  }
  } else {
    return res.send({ 
        mensaje: 'Token no proveída.' 
    });
  }
  
}

rutas.client = (req, res, next) => {    
  if (req.query.token) {
    const token = req.query.token;

    jwt.verify(token, process.env.SECRET, (err, decoded) => {      
      if (err) {
        return res.json({ mensaje: 'Token inválida' });    
      } else {
        next();
      }   
    });

  } else {
    return res.send({ 
        mensaje: 'Token no proveída.' 
    });
  }
} 


module.exports = rutas