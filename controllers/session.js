const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = ('bcrypt')

router.post('/', (req, res) => {
  User.findOne({ userName: req.body.userName }, (error, foundUsers) => {
    if (req.body.password === foundUsers.passord) {
        res.status(200).json(users)
    } else if (error) {
      res.status(400).json({error: error.message})
    }
  })
})

module.exports = router
