import mongoose from 'mongoose'
import os from 'os'
import process from 'process'

const _SECONDS = 5000

export const countConnect = () => {
  const numConnect = mongoose.connections.length
  console.log(`Number of connections: ${numConnect}`)
}

// check overload
export const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // Example maximum number of connections based on number os cores
    const maxConnections = numCores * 5

    console.log(`Active connections: ${numConnection}`)
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)

    if (numConnection > maxConnections) {
      console.log('Connection overload detected!')
    }
  }, _SECONDS) // Monitor every 5 seconds
}
