const express = require('express')
const cors = require('cors')
const controllers = require('./controllers')
const bodyParser = require('body-parser');
const { port, host } = require('./config')
const db = require('./libs/db')

db.init()
const app = express()

app.set('view engine', 'pug');
app.use(cors())
app.use(express.static('static'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', controllers.get.index)
app.get('/build/:buildId', controllers.get.build)

app.post('/build', controllers.post.build)
app.post('/notify_agent', controllers.post.notifyAgent)
app.post('/notify_build_result', controllers.post.notifyBuildResult)

app.use((err, req, res, next) => {
  console.log(err)
  res.json({ message: 'error :(' })
})

app.listen(port, host)
