const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

//Authenticating User login
router.post('/', (req, res) => {
  User.findOne({ userName: req.body.userName }, (error, foundUsers) => {
    if (foundUsers) {
      if (bcrypt.compareSync(req.body.password, foundUsers.password)) {
        console.log(foundUsers)
        res.status(200).json(foundUsers)
      } else if (error) {
        console.log('Not able to sign in');
        res.json({error: error.message})
      } else {
        console.log('300 error');
        res.status(300).json('error')
      }
    } else {
      console.log('username not found');
      res.status(400).json('error')
    }
  })
})


module.exports = router
