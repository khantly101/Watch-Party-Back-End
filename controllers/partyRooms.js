const express = require('express')
const router = express.Router()
const PartyRoom = require('../models/partyRoom.js')

router.get('/', (req, res) => {
  PartyRoom.find({}, (error, rooms) => {
    if (error) {
      res.status(400).json({error: error.message})
    }else if (req.session.currentUser) {
      res.status(200).json(rooms)
    }
  })
})

router.post('/', (req, res) => {
  PartyRoom.create(req.body, (error, newPR) => {
    if (error) {
      res.status(400).json({error: error.message})
    }else {
      res.status(200).json(newPR)
    }
  })
})

module.exports = router
