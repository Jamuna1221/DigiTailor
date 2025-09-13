import express from 'express'

const router = express.Router()

// Placeholder user routes
router.get('/profile', (req, res) => {
  res.json({ message: 'User profile - coming soon' })
})

export default router
