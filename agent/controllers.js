const { exec } = require('child_process')
const axios = require('axios')
const { host, port } = require('./config')
const git = require('simple-git')
const path = require('path')

module.exports = {
  async build (req, res, next) {
    res.status(200).send()
    try {
      const { repo, hash, command, buildId, agentId } = req.body
      const repoPath = path.resolve(__dirname, '../builds', buildId.toString())
      const startDate = Date.now()
      console.log(`Start cloning ${repoPath}`)
      await git().clone(repo, repoPath)
      console.log(`Clone success`)
      console.log(`Checkouting to ${hash}`)
      const ch = await git(repoPath).checkout(hash)
      console.log(`Checkout success`)
      console.log(`Running command ${command}`)
      const { status, stdout, stderr } = await run(command, repoPath)
      const endDate = Date.now()
      console.log(`Finished`)
      await axios.post(`http://${host}:${port}/notify_build_result`, { buildId, status, stdout, stderr, startDate, endDate, agentId})
    } catch (err) {
      next(err)
    }
  },
}

const run = (command, cwd) => new Promise(resolve => {
  exec(command, { cwd }, (err, stdout, stderr) => {
    const status = err === null ? 'success' : 'fail'
    resolve({ status, stdout, stderr })
  })
})