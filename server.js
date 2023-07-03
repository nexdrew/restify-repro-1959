const restify = require('restify')

const createCrashyServer = require('./lib/crashy')
const createRouterServer = require('./lib/custom-router')
const createSanitizeServer = require('./lib/custom-sanitize')

function main (cliArg) {
  let server
  if (cliArg === 'router') {
    console.log('Using server with custom router')
    server = createRouterServer(restify)
  } else if (cliArg === 'sanitize') {
    console.log('Using server with custom sanitizePath')
    server = createSanitizeServer(restify)
  } else {
    console.log('Using crashy server')
    server = createCrashyServer(restify)
  }

  server.get('/', (req, res, next) => {
    res.set({
      'Content-Type': 'text/plain',
      'Content-Length': 5
    })
    res.send('hello')
    return next()
  })

  server.listen(3000, err => {
    if (err) throw err
    console.log(`Listening on port ${server.address().port}`)
  })
}

main(process.argv[2])
