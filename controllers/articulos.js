const CategoriasModel = require('../models/categories');
const csvtojsonV2 = require("csvtojson");

module.exports = (app) => {
  app.get('/api/categorias/buscar', async (req, res) => {
    const query = req.query.query;
    
    let results = await CategoriasModel.find({ name : {$regex: query} });

    return res.json({
      ok: true,
      results
    });
  });

}