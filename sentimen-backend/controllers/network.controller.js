const { Network } = require('../models')
const fs = require('fs')
const axios = require('axios')

module.exports = {
  async getAllNetwork(req, res) {
    try {
      const networks = await Network.findAll()
      res.json(networks)
    } catch (error) {
      res.status(500).send('Internal server error')
    }
  },

  async getSpecificNetwork(req, res) {
    try {
      const network = await Network.findOne({
        where: {
          id: req.params.id
        },
        include: 'NetworkResult'
      })
      res.json(network)
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error')
    }
  },

  async createNetwork(req, res) {
    const { query, tanggal } = req.body
    const csv = req.file.originalname

    try {
      const network = await Network.create({
        query, 
        tanggal,
        csv
      })
      // req ke python server
      try {
        const formData = new FormData()
        const csvData = fs.readFileSync(`D:/Web/sentimen-backend/uploads/${csv}`);
        const apiUrl = 'http://127.0.0.1:5000/upload_network'; // Ganti dengan URL Flask API Anda
        formData.append('csv', csvData);
        formData.append('id', network.id);
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
          id: network.id
        }
      })
    } catch (error) {
      res.status(500).send('Internal server error')
    }
  },

  async editNetwork(req, res) {
    const id = req.params.id
    const {query, tanggal} = req.body

    try {
      const network = await Network.update(
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
        data: network
      })
    } catch (error) {
     res.status(500).send('Internal server error') 
    }
  },

  async deleteNetwork(req, res) {
    const id = req.params.id
    try {
      const network = await Network.destroy({
        where: {
          id: id
        }
      })
      res.json({
        message: 'delete success',
        data: network
      })
    } catch (error) {
      res.status(500).send('Internal server error')
    }
  }
}