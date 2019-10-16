const axios = require('axios')
const uuid = require('uuid')
const { repo } = require('./config')
const { getBuilds, getBuild, addBuild, addAgent, getFreeAgents, updateAgent, getAgent } = require('./libs/db')

module.exports = {
  get: {
    index (req, res, next) {
      const builds = getBuilds()
      res.render('index', {
          builds: builds
      })
    },
    build (req, res, next) {
      let build = getBuild(req.params.buildId)  
      res.render('build', {
        build: build
      })
    },
  },
  post: {
    notifyAgent (req, res, next) {
      const { host, port, agentId } = req.body
      addAgent({host, port, agentId, status: 'free'})
      res.send({message: 'Agent registered'})
    },

    async notifyBuildResult (req, res, next) {
      const { buildId, status, stdout, stderr, startDate, endDate, agentId } = req.body
      await addBuild({buildId, status, stdout, stderr, startDate, endDate})
      const a = await getAgent(agentId)
      console.log(a)
      await updateAgent(agentId, 'free')
      const a1 = await getAgent(agentId)
      console.log(a1)
      res.end()
    },
    
    async build (req, res, next) {
      try {
        res.redirect('/')
        const agent = getFreeAgents()
        if (agent) {
          console.log(agent.agentId)
          updateAgent(agent.agentId, 'busy')
          const a1 = getAgent(agent.agentId)
          console.log(a1)
          const { hash, command } = req.body
          // console.log(hash, command)
          const buildId = uuid.v1()
          const r = await axios.post(`http://${agent.host}:${agent.port}/build`, { repo, hash, command, buildId, agentId: agent.agentId })
        } else {
          console.log('There aren\'t free agents')
        }
      } catch (err) {
        next(err)
      }
    },
  }
}
