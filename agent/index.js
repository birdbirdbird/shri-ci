const express = require('express')
const cors = require('cors')
const axios = require('axios')
const uuid = require('uuid')
const controllers = require('./controllers')
const { host, port } = require('./config')
const fp = require("find-free-port")

const app = express()

app.use(cors())
app.use(express.json())

app.post('/build', controllers.build)

app.use((err, req, res, next) => {
  console.log(err)
  res.json({ message: 'error :(' })
})

const agentId = uuid.v1()

fp(3000, 3100, function(err, freePort){
  const server = app.listen(freePort, async () => {
    console.log(`Agent started on port ${freePort}`)
    const r = await axios.post(`http://${host}:${port}/notify_agent`, { agentId, host: '127.0.0.1', port: freePort})
    if (r.status !== 200) {
      console.log('Something wrong with server')
      server.close()
    }
  })
});


