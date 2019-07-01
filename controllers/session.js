const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

//Authenticating User login
router.post('/', (req, res) => {
  User.findOne({ userName: req.body.userName }, (error, foundUsers) => {
    if (bcrypt.compareSync(req.body.password, foundUsers.password)) {
        res.status(200).json(foundUsers)
    } else if (error) {
      res.status(400).json({error: error.message})
    }
  })
})

//Logout user session
router.delete('/', (req, res) => {
  res.session.destroy((error, logout) => {
    if (error) {
      res.status(400).json({error: error.messge})
    }else {
      res.status(200)
    }
  })
})

module.exports = router
