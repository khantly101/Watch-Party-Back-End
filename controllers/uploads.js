const express = require('express')
const router = express.Router()

const Upload = require('../models/upload.js')
const PartyRoom = require('../models/partyRoom.js')


const singleUpload = Upload.single('video')

router.post('/:id', (req, res) => {
  singleUpload(req, res, (err) => {
    console.log(req.file.location);
    PartyRoom.findByIdAndUpdate(req.params.id, {upload: req.file.location}, {new: true}, (error, pushed) => {
      if (error) {
        console.log('push failed');
      }else {
        console.log(pushed);
      }
    })
    return res.json({'videoUrl': req.file.location})
  })
})

module.exports = router
