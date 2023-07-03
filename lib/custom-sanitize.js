// this logic copied from https://github.com/restify/node-restify/blob/cbd16efa3be36e7888ecccc15ee28eaa8fa6c5ef/lib/plugins/pre/prePath.js
function strip (path) {
  let cur
  let next
  let str = ''

  for (let i = 0; i < path.length; i++) {
    cur = path.charAt(i)

    if (i !== path.length - 1) {
      next = path.charAt(i + 1)
    }

    if (cur === '/' && (next === '/' || (next === '?' && i > 0))) {
      continue
    }

    str += cur
  }

  return str
}

module.exports = function createSanitizeServer (restify) {
  const server = restify.createServer()
  server.pre((req, res, next) => {
    req.url = strip(req.url) || '/' // only difference is default value here
    next()
  })
  return server
}
