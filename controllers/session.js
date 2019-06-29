const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = ('bcrypt')

router.get('/', (req, res) => {
  res.send('this is the sessions page!')
})

module.exports = router
