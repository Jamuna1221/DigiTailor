import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Ensure uploads directory exists
const uploadsDir = 'uploads/reviews'
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('✅ Created uploads/reviews directory')
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp_orderId_random_originalname
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
    const orderId = req.params.orderId || 'unknown'
    const fileName = `${orderId}_${uniqueSuffix}${path.extname(file.originalname)}`
    cb(null, fileName)
  }
})

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPEG, PNG and WebP images are allowed'), false)
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5 // Maximum 5 files
  }
})

// Middleware for handling review images
export const uploadReviewImages = upload.array('images', 5)

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum 5MB per image allowed.'
        })
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 5 images allowed.'
        })
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name. Use "images" for uploading review images.'
        })
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + err.message
        })
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed'
    })
  }
  
  next()
}

export default upload