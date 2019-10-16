const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('../db.json')
const db = low(adapter)

module.exports =  {
    init: () => db.defaults({ builds: [], agents: [] }).write(),
    addBuild: (build) => db.get('builds').push(build).write(),
    getBuild: (buildId) => db.get('builds').find({ buildId }).value(),
    getBuilds: () => db.get('builds').value(),
    addAgent: (agent) => db.get('agents').push(agent).write(),
    getAgent: (agentId) => db.get('agents').find({ agentId }).value(),
    updateAgent: (agentId, status) => db.get('agents').find({ agentId }).assign({ status }).write(),
    getFreeAgents: () => db.get('agents').find({ status: 'free' }).value(),
    getAgents: () => db.get('agents').value()
}



