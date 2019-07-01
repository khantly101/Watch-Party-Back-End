const express = require('express')
const router = express.Router()
const PartyRoom = require('../models/partyRoom.js')
const User = require('../models/user.js')

//This route will get all Partyrooms for logged in users.
router.get('/', (req, res) => {
  PartyRoom.find({}, (error, rooms) => {
    if (error) {
      res.status(400).json({error: error.message})
    }else if (req.session.currentUser) {
      res.status(200).json(rooms)
    }
  })
})

//Create partyroom for logged in members.
router.post('/new', (req, res) => {
  PartyRoom.create(req.body, (error, newPR) => {
    if (error) {
      res.status(400).json({error: error.message})
    }else {
      res.status(200).json(newPR)
    }
  })
})

//Edit Partyroom
router.put('/:id', (req, res) => {
  PartyRoom.findByIdAndUpdate(req.params.id, (error, prEdit) => {
    if (error) {
      res.status(400).json({error: error.message})
    } else {
      res.status(200).json(prEdit)
    }
  })
})

//Delete Partyroom
router.delete('/:id', (req, res) => {
  Partyroom.findByIdAndRemove(req.params.id, (error, prDelete) => {
    if (error) {
      res.status(400).json({error: error.message})
    } else {
      res.status(200).json(prDelete)
    }
  })
})

module.exports = router
