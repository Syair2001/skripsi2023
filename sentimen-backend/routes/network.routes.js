const express = require('express')
const upload = require('../config/uploadConfig')
const { getAllNetwork, createNetwork, deleteNetwork, editNetwork, getSpecificNetwork } = require('../controllers/network.controller')
const isAutenticated = require('../middleware/isAuthenticated')
const router = express.Router()

router.get('/', getAllNetwork)
router.get('/:id', getSpecificNetwork)
router.post('/', upload.single('file'), isAutenticated, createNetwork)
router.delete('/:id', isAutenticated, deleteNetwork)
router.put('/:id', isAutenticated, editNetwork)

module.exports = router