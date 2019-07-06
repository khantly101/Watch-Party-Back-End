const express = require('express')
const router = express.Router()

const Upload = require('../models/upload.js')
const PartyRoom = require('../models/partyRoom.js')
const User = require('../models/user.js')


const upload = Upload.single('upload')


router.post('/:id', (req, res) => {
  console.log(req.body);
  upload(req, res, (err) => {
    console.log(req.file.location);
    console.log(req.file);
    if (req.file.mimetype === 'video/mp4') {
      PartyRoom.findByIdAndUpdate(req.params.id, {upload: req.file.location}, {new: true}, (error, pushed) => {
        if (error) {
          console.log('push failed');
        }else {
          console.log(pushed);
        }
      })
      return res.json({'videoUrl': req.file.location})
    } else {
      User.findByIdAndUpdate(req.params.id, {img: req.file.location}, {new:true}, (error, pushed) => {
        if (error) {
          console.log('push failed');
        } else {
          console.log(pushed);
        }
      })
    }

  })
})

// router.post('/photo', (req, res) => {
//   photoUpload(req, res, (err) => {
//     return res.json()
//   })
// })

module.exports = router
