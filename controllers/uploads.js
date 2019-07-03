const express = require('express')
const router = express.Router()

const Upload = require('../models/upload.js')

const singleUpload = Upload.single('video')

router.post('/', (req, res) => {
  singleUpload(req, res, (err) => {

    return res.json({'videoUrl': req.file.location})
  })
})

module.exports = router
