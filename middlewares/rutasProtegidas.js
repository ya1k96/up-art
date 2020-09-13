const express = require('express');
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {    
    if ( req.session.logged ) {
      const token = req.session.token;

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
