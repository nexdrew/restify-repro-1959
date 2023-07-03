module.exports = function createCrashyServer (restify) {
  const server = restify.createServer()
  server.pre(restify.pre.sanitizePath())
  return server
}
