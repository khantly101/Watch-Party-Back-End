const aws = require('aws-sdk')
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3')

aws.config.update({
  secretAccessKey: 'mv6WsYhtu/FcJIKzzVTMDsCZJ/IUxri2Hskl7IJr',
  accessKeyId: 'AKIAIBNPABUELMQP22HQ',
  region: 'us-east-2'
})

const app = express()
const s3 = new aws.S3()

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket:'vparty',
    /// The post man request at .location is fine until I add this....
    // acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname})
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload
