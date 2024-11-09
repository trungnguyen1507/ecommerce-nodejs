import mongoose from 'mongoose'
import config from '../configs/config.mongodb.js'
const {
  db: { host, port, name }
} = config

const connectionString = `mongodb://${host}:${port}/${name}`

class Database {
  constructor() {
    this.connect()
  }

  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(connectionString)
      .then((_) => console.log('Connected MongoDB success'))
      .catch((err) => console.log('Failed to connect MongoDB', err))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
export default instanceMongodb
