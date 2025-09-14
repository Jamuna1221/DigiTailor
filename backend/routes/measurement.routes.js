import express from 'express'
import { 
  getUserMeasurements, 
  saveMeasurement, 
  updateMeasurement, 
  deleteMeasurement 
} from '../controllers/measurement.controller.js'

const router = express.Router()

// Note: auth middleware is applied in server.js, so these routes are already protected

// Get user's measurements
router.get('/', getUserMeasurements)

// Save new measurement
router.post('/', saveMeasurement)

// Update measurement
router.put('/:measurementId', updateMeasurement)

// Delete measurement
router.delete('/:measurementId', deleteMeasurement)

export default router
