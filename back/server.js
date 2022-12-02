import express from 'express'
import cors from 'cors';
import { generateUploadURL } from './s3.js'


var app = express()

app.use(cors())

app.use(express.static('front'))

app.get('/s3url', async (req, res) => {
  const url = await generateUploadURL()
  console.log(url)
  res.send({url})
})

app.listen(5502, () => console.log("Listening on port 5502"))