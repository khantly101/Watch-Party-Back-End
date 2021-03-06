const aws = require('aws-sdk')
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3')
require('dotenv').config()


aws.config.update({
  secretAccessKey: process.env.SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: 'us-east-2'
})

const app = express()
const s3 = new aws.S3()

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket:'vparty',
    acl: 'public-read-write',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname})
    },
    key: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
})

module.exports = upload
