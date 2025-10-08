import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`🗄️ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📂 Database Name: ${conn.connection.db.databaseName}`)
    console.log(`🔗 Connection State: ${conn.connection.readyState}`)
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
    process.exit(1)
  }
}

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB')
})
 
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected')
})

export default connectDB
