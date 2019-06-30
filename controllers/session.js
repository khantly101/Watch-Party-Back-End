const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = ('bcrypt')

//Authenticating User login
router.post('/', (req, res) => {
  User.findOne({ userName: req.body.userName }, (error, foundUsers) => {
    if (bcrypt.compareSync(req.body.password, foundUsers.passord)) {
        res.status(200).json(users)
    } else if (error) {
      res.status(400).json({error: error.message})
    }
  })
})

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
