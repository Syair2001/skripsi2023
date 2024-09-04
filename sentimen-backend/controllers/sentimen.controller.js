const { Sentimen } = require('../models')
const fs = require('fs')
const axios = require('axios')

module.exports = {
  async getAllSentimen(req, res) {
    try {
      const sentimens = await Sentimen.findAll()
      res.json(sentimens)
    } catch (error) {
      res.status(500).send('Internal server error')
    }
  },

  async getSpecificSentimen(req, res) {
    try {
      const sentimen = await Sentimen.findOne({
        where: {
          id: req.params.id
        },
        include: 'SentimenResult'
      })
      res.json(sentimen)
    } catch (error) {
      res.status(500).send('Internal server error')
    }
  },

  async createSentimen(req, res) {
    const { query, tanggal } = req.body
    const csv = req.file.originalname

    try {
      const sentimen = await Sentimen.create({
        query, 
        tanggal,
        csv
      })
      // req ke python server
      

      try {
        const formData = new FormData()
      const csvData = fs.readFileSync(`D:/Web/sentimen-backend/uploads/${csv}`);
      const apiUrl = 'http://127.0.0.1:5000/upload_senti_graph'; // Ganti dengan URL Flask API Anda
      formData.append('csv', csvData);
      formData.append('id', sentimen.id);
      formData.append('nama_file', csv)
      const headers = {
        'Content-Type': 'text/csv',
      };
        axios.post(apiUrl, formData, { headers })
        .then(response => {
          console.log('Respon dari API Flask:', response.data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      } catch (error) {
        console.log(error);
      }

      
      res.json({
        message: 'success',
        data: {
          id: sentimen.id
        }
      })
    } catch (error) {
      res.status(500).send('Internal server error')
    }
  },

  async editSentimen(req, res) {
    const id = req.params.id
    const {query, tanggal} = req.body

    try {
      const sentimen = await Sentimen.update(
        {
          query: query,
          tanggal: tanggal
        },
        {
          where: {
            id: id
          }
        }
      )

      res.json({
        message: 'edit success',
        data: sentimen
      })
    } catch (error) {
     res.status(500).send('Internal server error') 
    }
  },

  async deleteSentimen(req, res) {
    const id = req.params.id
    try {
      const sentimen = await Sentimen.destroy({
        where: {
          id: id
        }
      })
      res.json({
        message: 'delete success',
        data: sentimen
      })
    } catch (error) {
      res.status(500).send('Internal server error')
    }
  }
}