import Measurement from '../models/measurement.model.js'

// Get user's measurements
export const getUserMeasurements = async (req, res) => {
  try {
    console.log('📏 Getting measurements for user:', req.user.id)

    const measurements = await Measurement.find({ 
      userId: req.user.id, 
      isActive: true 
    }).sort({ createdAt: -1 })

    console.log('✅ Found', measurements.length, 'measurements')

    res.status(200).json({
      success: true,
      message: 'Measurements fetched successfully',
      data: measurements
    })

  } catch (error) {
    console.error('💥 Get measurements error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch measurements',
      error: error.message
    })
  }
}

// Save new measurement
export const saveMeasurement = async (req, res) => {
  try {
    console.log('💾 Saving measurement for user:', req.user.id)
    console.log('📊 Measurement data:', req.body)

    const { measurementType, measurements, notes } = req.body

    // Validation
    if (!measurementType || !measurements) {
      return res.status(400).json({
        success: false,
        message: 'Measurement type and measurements data are required'
      })
    }

    // Check if measurement already exists for this type
    const existingMeasurement = await Measurement.findOne({
      userId: req.user.id,
      measurementType,
      isActive: true
    })

    if (existingMeasurement) {
      // Update existing measurement
      existingMeasurement.measurements = measurements
      existingMeasurement.notes = notes || ''
      await existingMeasurement.save()

      console.log('✅ Measurement updated successfully')

      return res.status(200).json({
        success: true,
        message: 'Measurement updated successfully',
        data: existingMeasurement
      })
    } else {
      // Create new measurement
      const newMeasurement = new Measurement({
        userId: req.user.id,
        measurementType,
        measurements,
        notes: notes || ''
      })

      await newMeasurement.save()

      console.log('✅ Measurement saved successfully')

      res.status(201).json({
        success: true,
        message: 'Measurement saved successfully',
        data: newMeasurement
      })
    }

  } catch (error) {
    console.error('💥 Save measurement error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save measurement',
      error: error.message
    })
  }
}

// Update measurement
export const updateMeasurement = async (req, res) => {
  try {
    const { measurementId } = req.params
    console.log('📝 Updating measurement:', measurementId)

    const measurement = await Measurement.findOne({
      _id: measurementId,
      userId: req.user.id
    })

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement not found'
      })
    }

    const { measurements, notes } = req.body

    measurement.measurements = measurements || measurement.measurements
    measurement.notes = notes !== undefined ? notes : measurement.notes

    await measurement.save()

    console.log('✅ Measurement updated successfully')

    res.status(200).json({
      success: true,
      message: 'Measurement updated successfully',
      data: measurement
    })

  } catch (error) {
    console.error('💥 Update measurement error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update measurement',
      error: error.message
    })
  }
}

// Delete measurement
export const deleteMeasurement = async (req, res) => {
  try {
    const { measurementId } = req.params
    console.log('🗑️ Deleting measurement:', measurementId)

    const measurement = await Measurement.findOne({
      _id: measurementId,
      userId: req.user.id
    })

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement not found'
      })
    }

    // Soft delete
    measurement.isActive = false
    await measurement.save()

    console.log('✅ Measurement deleted successfully')

    res.status(200).json({
      success: true,
      message: 'Measurement deleted successfully'
    })

  } catch (error) {
    console.error('💥 Delete measurement error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete measurement',
      error: error.message
    })
  }
}
