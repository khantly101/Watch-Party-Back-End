const express = require('express')
const router = express.Router()
const User = require('../models/user.js')

//Get route to display all users to members
router.get('/', (req, res) => {
  if(req.session.currentUser) {
    User.find({}, (error, allUsers) => {
      if (error) {
        res.status(400).json({error: error.message})
      }else {
        res.status(200).json(allUsers)
      }
    })
  }
})

//Edit route for members.
router.put('/:username/edit', (req, res) => {
  User.findByIdAndUpdate(req.params.id, (error, updateUser) => {
    if (error) {
      res.status(400).json({error: error.message})
    } else {
      res.status(200).json(updateUser)
    }
  })
})

module.exports = router
