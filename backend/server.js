import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/database.js'
import { protect } from './middlewares/auth.middleware.js'

// Import all routes
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
import measurementRoutes from './routes/measurement.routes.js'
import profileRoutes from './routes/profile.routes.js'

// ES modules dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()
connectDB()

const app = express()

// ✅ REQUEST LOGGING MIDDLEWARE (for debugging)
app.use((req, res, next) => {
  console.log(`📋 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2))
  }
  next()
})

// ✅ CORE MIDDLEWARE
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ✅ ENHANCED HELMET CONFIGURATION
app.use(helmet({ 
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
      connectSrc: ["'self'", "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
    }
  }
}))

// ✅ ENHANCED CORS CONFIGURATION
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept', 
    'Origin', 
    'X-Requested-With',
    'Access-Control-Allow-Origin'
  ],
  exposedHeaders: ['Content-Length', 'Content-Type']
}))

app.use(morgan('combined'))

// ✅ CORS MIDDLEWARE FOR STATIC FILES - Add BEFORE static serving
app.use('/uploads', (req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ]
  
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  } else {
    // Fallback for direct access
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173')
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Cross-Origin-Resource-Policy', 'cross-origin')
  res.header('Cache-Control', 'public, max-age=86400') // Cache for 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  
  next()
})

// ✅ STATIC FILE SERVING - Serve uploaded files with proper headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin')
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173')
    
    // Set proper content type based on file extension
    const ext = path.extname(filePath).toLowerCase()
    if (['.jpg', '.jpeg'].includes(ext)) {
      res.header('Content-Type', 'image/jpeg')
    } else if (ext === '.png') {
      res.header('Content-Type', 'image/png')
    } else if (ext === '.gif') {
      res.header('Content-Type', 'image/gif')
    }
  }
}))

// ✅ HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'DigiTailor API is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      database: 'Connected',
      fileUpload: 'Available',
      authentication: 'Active',
      staticFiles: 'Available'
    }
  })
})

// ✅ PUBLIC API ROUTES (No authentication required)
app.use('/api/auth', authRoutes)
app.use('/api/catalog', catalogRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/homepage', homepageRoutes)
app.use('/api/gallery', galleryRoutes)  
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminAuthRoutes)

// ✅ PROTECTED API ROUTES (Authentication required)
app.use('/api/wishlist', protect, wishlistRoutes)
app.use('/api/measurements', protect, measurementRoutes)
app.use('/api/profile', protect, profileRoutes)
app.use('/api/orders', protect, orderRoutes)
app.use('/api/products', protect, productRoutes)

// ✅ PROTECTED TEST ROUTE
app.get('/api/protected', protect, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected route',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      firstName: req.user.firstName,
      lastName: req.user.lastName
    },
    userType: req.userType
  })
})

// ✅ PUBLIC TEST ROUTE
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test endpoint working',
    timestamp: new Date().toISOString(),
    routes: {
      public: [
        '/api/auth',
        '/api/catalog', 
        '/api/categories',
        '/api/homepage',
        '/api/gallery',
        '/api/contact',
        '/api/admin'
      ],
      protected: [
        '/api/wishlist',
        '/api/measurements',
        '/api/profile', 
        '/api/orders',
        '/api/products'
      ]
    }
  })
})

// ✅ API ROUTES INFO
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'DigiTailor API Documentation',
    version: '1.0.0',
    endpoints: {
      authentication: {
        '/api/auth/register': 'POST - User registration',
        '/api/auth/login': 'POST - User login',
        '/api/auth/logout': 'POST - User logout',
        '/api/auth/forgot-password': 'POST - Forgot password',
        '/api/auth/reset-password': 'POST - Reset password'
      },
      profile: {
        '/api/profile': 'GET - Get user profile, PUT - Update profile',
        '/api/profile/picture': 'POST - Upload profile picture, DELETE - Remove picture'
      },
      measurements: {
        '/api/measurements': 'GET - Get measurements, POST - Save measurement',
        '/api/measurements/:id': 'PUT - Update measurement, DELETE - Delete measurement'
      },
      wishlist: {
        '/api/wishlist': 'GET - Get wishlist',
        '/api/wishlist/add': 'POST - Add to wishlist',
        '/api/wishlist/remove/:id': 'DELETE - Remove from wishlist'
      },
      catalog: {
        '/api/catalog': 'GET - Get designs',
        '/api/catalog/categories': 'GET - Get categories'
      },
      orders: {
        '/api/orders': 'GET - Get orders, POST - Create order',
        '/api/orders/:id': 'GET - Get order details'
      }
    },
    status: {
      server: 'Running',
      database: 'Connected',
      uploads: 'Available'
    }
  })
})

// ✅ FILE UPLOAD INFO ROUTE
app.get('/api/uploads/info', (req, res) => {
  res.json({
    success: true,
    message: 'File upload service information',
    limits: {
      maxFileSize: '5MB',
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
      uploadPath: '/uploads/'
    },
    endpoints: {
      profilePicture: 'POST /api/profile/picture',
      removeProfilePicture: 'DELETE /api/profile/picture'
    },
    cors: {
      enabled: true,
      allowedOrigins: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:3000'
      ]
    }
  })
})

// ✅ STATIC FILES TEST ROUTE
app.get('/api/uploads/test', (req, res) => {
  import('fs').then(fs => {
    const uploadsDir = path.join(__dirname, 'uploads')
    const profilesDir = path.join(__dirname, 'uploads', 'profiles')
    
    fs.readdir(profilesDir, (err, files) => {
      if (err) {
        res.json({
          success: false,
          message: 'Cannot access uploads directory',
          error: err.message
        })
      } else {
        res.json({
          success: true,
          message: 'Uploads directory accessible',
          uploadsPath: uploadsDir,
          profilesPath: profilesDir,
          profileImages: files.filter(f => f.startsWith('profile-')),
          totalFiles: files.length
        })
      }
    })
  })
})

// ✅ ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  console.error('💥 Error occurred:', err.stack)
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size allowed is 5MB.',
      error: 'FILE_TOO_LARGE'
    })
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field.',
      error: 'INVALID_FILE_FIELD'
    })
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }
  
  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      error: 'DUPLICATE_FIELD'
    })
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'INVALID_TOKEN'
    })
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      error: 'TOKEN_EXPIRED'
    })
  }
  
  // Generic error
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : 'Internal server error',
    timestamp: new Date().toISOString()
  })
})

// ✅ 404 HANDLER - FIXED FOR EXPRESS v5
app.use('/*catchAll', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({ 
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableRoutes: '/api',
    documentation: 'Visit /api for endpoint documentation'
  })
})

// ✅ GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    console.log('✅ Process terminated')
  })
})

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received. Shutting down gracefully...')
  server.close(() => {
    console.log('✅ Process terminated')
  })
})

// ✅ START SERVER
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log('🚀 DigiTailor server started successfully!')
  console.log(`🌐 Server running on: http://localhost:${PORT}`)
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📚 API documentation: http://localhost:${PORT}/api`)
  console.log(`🔐 Facebook OAuth: http://localhost:${PORT}/api/auth/facebook`)
  console.log(`📸 File uploads: http://localhost:${PORT}/uploads/`)
  console.log(`🔍 Upload test: http://localhost:${PORT}/api/uploads/test`)
  console.log(`📏 Measurements API: http://localhost:${PORT}/api/measurements`)
  console.log(`👤 Profile API: http://localhost:${PORT}/api/profile`)
  console.log(`❤️ Wishlist API: http://localhost:${PORT}/api/wishlist`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  // Create uploads directory if it doesn't exist
  import('fs').then(fs => {
    const uploadsDir = path.join(__dirname, 'uploads')
    const profilesDir = path.join(__dirname, 'uploads', 'profiles')
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
      console.log('📁 Created uploads directory')
    }
    
    if (!fs.existsSync(profilesDir)) {
      fs.mkdirSync(profilesDir, { recursive: true })
      console.log('📁 Created profiles directory')
    }
    
    // ✅ Test directory accessibility
    fs.readdir(profilesDir, (err, files) => {
      if (err) {
        console.error('❌ Cannot access profiles directory:', err)
      } else {
        console.log(`📂 Profiles directory accessible. Files: ${files.length}`)
        if (files.length > 0) {
          console.log(`📷 Profile images available at: http://localhost:${PORT}/uploads/profiles/`)
        }
      }
    })
  })
})

export default app
