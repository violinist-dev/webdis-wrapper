'use strict'
const request = require('request')
const fs = require('fs')
const cp = require('child_process')
const path = require('path')
const os = require('os')

// Download webdis and extract it.
let fileName = path.join(__dirname, 'webdis.tar.gz')
let stream = fs.createWriteStream(fileName)

const options = {cwd: path.join__dirname}

const runMake = () => {
  console.log('Running make')
  let opts = {cwd: path.join(__dirname, 'webdis')}
  cp.execFile('make', ['clean', 'all'], opts, (err) => {
    if (err) throw err
    console.log('Webdis installed in good manner')
  })
}

const renameDirectory = () => {
  console.log('Renaming directory')
  cp.execFile('mv', ['webdis-0.1.3', 'webdis'], options, (err) => {
    if (err) throw err
    runMake()
  })
}


stream.on('close', () => {
  // Extract it.
  cp.execFile('tar', ['jxf', fileName], options, function (err) {
    if (err) throw err
    renameDirectory()
  })
})
request('https://github.com/nicolasff/webdis/archive/0.1.3.tar.gz').pipe(stream)
