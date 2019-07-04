const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const PartyRoom = require('../models/partyRoom.js')

//Get route to display all users to members
router.get('/', (req, res) => {
    User.find({}, (error, allUsers) => {
      if (error) {
        res.status(400).json({error: error.message})
      }else {
        res.status(200).json(allUsers)
      }
    })
})

router.get('/:id', (req, res) => {
  PartyRoom.find({creator: req.params.id}).populate('_nameSpace').exec((error, found) => {
    if (error) {
      res.status(400).json({error: error.message})
    }else {
      console.log(found);
      res.status(200).json(found)
    }
  })
})

//Edit route for members.
router.put('/:id/edit', (req, res) => {
  console.log(req.params.id);
  User.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updateUser) => {
    if (error) {
      console.log('there was an error');
      res.json({error: error.message})
    } else {
      res.status(200).json(updateUser)
      console.log(updateUser);
    }
  })
})

//DELETE PROFILE
router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, (error, deleteUser) => {
    if (error) {
      res.status(400).json({error: error.message})
    } else {
      res.status(200).json(deleteUser)
    }
  })
})

module.exports = router
