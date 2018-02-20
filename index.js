const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')

const getDefaultConfig = () => {
  return {
    'redis_host': '127.0.0.1',
    'redis_port': 6379,
    'redis_auth': null,
    'http_host': '0.0.0.0',
    'http_port': 7379,
    'threads': 5,
    'pool_size': 20,
    'daemonize': false,
    'websockets': false,
    'database': 0,
    'acl': [
      {
        'disabled': ['DEBUG']
      },
      {
        'http_basic_auth': 'user:password',
        'enabled': ['DEBUG']
      }
    ],
    'verbosity': 6,
    'logfile': 'webdis.log'
  }
}

const start = (config = {}) => {
  let webdisJson = Object.assign(getDefaultConfig(), config)
  // @todo: Make more random?
  let configPath = path.join(os.tmpdir(), 'webdis.json.' + Math.random())
  // Write this config to tmp directory.
  fs.writeFile(configPath, JSON.stringify(webdisJson), (err) => {
    if (err) throw err
    const webdis = spawn(path.join(__dirname, 'webdis', 'webdis'), [configPath])
    webdis.stderr.on('data', (data) => {
      console.log('stderr:', data.toString())
    })
    webdis.stdin.on('data', (data) => {
      console.log('stdin:', data.toString())
    })
    webdis.on('close', (code) => {
      console.log('Webdis exit. Code:', code)
    })
  })
}

module.exports = {
  start: start
}
