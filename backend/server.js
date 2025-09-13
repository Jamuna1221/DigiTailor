import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import { protect } from './middlewares/auth.middleware.js'
import authRoutes from './routes/auth.routes.js'
import catalogRoutes from './routes/catalog.routes.js'
import categoryRoutes from './routes/category.routes.js'
import adminAuthRoutes from './routes/adminAuth.routes.js'
import orderRoutes from './routes/order.routes.js'
import homepageRoutes from './routes/homepage.routes.js'
import galleryRoutes from './routes/gallery.routes.js'
import contactRoutes from './routes/contact.routes.js'
import productRoutes from './routes/product.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'

// Load environment variables
dotenv.config()
connectDB()

const app = express()

// ✅ REQUEST LOGGING MIDDLEWARE (for debugging)
app.use((req, res, next) => {
  console.log(`📋 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`)
  next()
})

// ✅ CORE MIDDLEWARE
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(helmet({ crossOriginEmbedderPolicy: false }))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(morgan('combined'))
app.use('/uploads', express.static('uploads'))

// ✅ HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'DigiTailor API is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// ✅ API ROUTES
app.use('/api/auth', authRoutes)
app.use('/api/catalog', catalogRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/homepage', homepageRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/gallery', galleryRoutes)  
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminAuthRoutes)
app.use('/api/wishlist', wishlistRoutes)
// ✅ PROTECTED ROUTES
app.use('/api/products', protect, productRoutes)
app.get('/api/protected', protect, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected route',
    user: req.user
  })
})

// ✅ TEST ROUTE
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test endpoint working',
    timestamp: new Date().toISOString()
  })
})

// ✅ ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  console.error('💥 Error occurred:', err.stack)
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : 'Internal server error'
  })
})

// ✅ 404 HANDLER - FIXED FOR EXPRESS 5
app.use('/{*catchAll}', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({ 
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  })
})

// ✅ START SERVER
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log('🚀 DigiTailor server started successfully!')
  console.log(`🌐 Server running on: http://localhost:${PORT}`)
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔐 Facebook OAuth: http://localhost:${PORT}/api/auth/facebook`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
})

export default app
