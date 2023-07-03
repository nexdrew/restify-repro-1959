const Router = require('restify/lib/router')
const { ResourceNotFoundError } = require('restify-errors')

class DontCrashProcessRouter extends Router {
  // wrap Router#lookup to short-circuit when parsed pathname is empty
  lookup (req, res) {
    // trying to avoid AssertionError [ERR_ASSERTION]: pathname (string) is required
    const pathname = req.getUrl().pathname
    if (!pathname) {
      console.log(`NO PATHNAME 1/3 > req.url: "${req.url}"`)
      console.log(`NO PATHNAME 2/3 > req._cacheURL: "${req._cacheURL}"`)
      console.log(`NO PATHNAME 3/3 > req._url: ${JSON.stringify(req._url, null, 2)}`)
      return undefined
    }
    return super.lookup(req, res)
  }

  // wrap Router#defaultRoute to catch unexpected errors without crashing
  defaultRoute (req, res, next) {
    try {
      return super.defaultRoute(req, res, next)
    } catch (err) {
      console.error('Error caught on router.defaultRoute:', err)
    }
    const error = new ResourceNotFoundError('Requested path does not exist')
    next(error, req, res)
  }
}

module.exports = function createRouterServer (restify) {
  const router = new DontCrashProcessRouter({ log: restify.logger() })
  const server = restify.createServer({ router })
  server.pre(restify.pre.sanitizePath())
  return server
}
