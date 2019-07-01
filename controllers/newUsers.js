const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

//Create new user
router.post('/', (req, res) => {
  //Password encryption
  // req.body.password = bcrypt.hashSync(req.body.password, 8, (error, hash) => {
  //   if (error) {
  //     return res.json({ error: true})
  //   }
  // })
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (error, newUser) => {
    if (error) {
      res.status(400).json({error: error.message})
    }else {
      res.status(200).json(newUser)
    }
  })
})

module.exports = router
