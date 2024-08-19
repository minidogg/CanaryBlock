import express from 'express'
const app = express()
const port = 5000

import * as db from './db.js'



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Express app on port ${port}`)
})