const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

router.post('/', (req, res) => {
  User.create(req.body, (error, newUser) => {
    if (error) {
      res.status(400).json({error: error.message})
    }else {
      res.status(200).json(newUser)
    }
  })
})

module.exports = router
