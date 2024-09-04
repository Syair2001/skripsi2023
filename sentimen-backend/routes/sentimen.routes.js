const express = require('express')
const { getAllSentimen, getSpecificSentimen, createSentimen, deleteSentimen, editSentimen } = require('../controllers/sentimen.controller')
const upload = require('../config/uploadConfig')
const isAutenticated = require('../middleware/isAuthenticated')
const router = express.Router()

router.get('/', getAllSentimen)
router.get('/:id', getSpecificSentimen)
router.post('/', upload.single('file'), isAutenticated,createSentimen)
router.delete('/:id', isAutenticated, deleteSentimen)
router.put('/:id', isAutenticated, editSentimen)

module.exports = router