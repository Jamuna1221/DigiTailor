import Contact from '../models/contact.model.js'

// POST /api/contact - Create new contact request
export const createContact = async (req, res) => {
  try {
    console.log('📩 New contact form submission...')
    console.log('Request body:', req.body)
    
    const {
      fullName,
      email,
      phone,
      serviceInterested,
      consultationType,
      preferredTime,
      message,
      requestType
    } = req.body

    // Validation
    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: fullName, email, message'
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      })
    }

    // Create new contact request
    const newContact = new Contact({
      fullName,
      email,
      phone: phone || '',
      serviceInterested: serviceInterested || '',
      consultationType: consultationType || 'online',
      preferredTime: preferredTime || '',
      message,
      requestType: requestType || 'general_inquiry'
    })

    const savedContact = await newContact.save()
    console.log('✅ Contact request saved:', savedContact._id)

    res.status(201).json({
      success: true,
      message: 'Your message has been sent! We\'ll get back to you soon.',
      data: {
        id: savedContact._id,
        fullName: savedContact.fullName,
        email: savedContact.email
      }
    })

  } catch (error) {
    console.error('❌ Error saving contact request:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send your message. Please try again.',
      error: error.message
    })
  }
}

// GET /api/contact - Get all contact requests (Admin only)
export const getAllContacts = async (req, res) => {
  try {
    console.log('📋 Fetching all contact requests...')
    
    const { status, requestType, limit } = req.query
    let filter = {}
    
    if (status && status !== 'all') {
      filter.status = status
    }
    
    if (requestType && requestType !== 'all') {
      filter.requestType = requestType
    }
    
    let query = Contact.find(filter).sort({ createdAt: -1 })
    
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    
    const contacts = await query
    console.log(`✅ Found ${contacts.length} contact requests`)
    
    res.status(200).json({
      success: true,
      message: 'Contact requests fetched successfully',
      data: contacts,
      count: contacts.length
    })
    
  } catch (error) {
    console.error('❌ Error fetching contact requests:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact requests',
      error: error.message
    })
  }
}

// PUT /api/contact/:id - Update contact status
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    
    console.log(`📝 Updating contact request: ${id}`)
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found'
      })
    }
    
    console.log('✅ Contact request updated:', updatedContact._id)
    
    res.status(200).json({
      success: true,
      message: 'Contact request updated successfully',
      data: updatedContact
    })
    
  } catch (error) {
    console.error('❌ Error updating contact request:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update contact request',
      error: error.message
    })
  }
}

// DELETE /api/contact/:id - Delete contact request
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🗑️ Deleting contact request: ${id}`)
    
    const deletedContact = await Contact.findByIdAndDelete(id)
    
    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found'
      })
    }
    
    console.log('✅ Contact request deleted:', deletedContact._id)
    
    res.status(200).json({
      success: true,
      message: 'Contact request deleted successfully'
    })
    
  } catch (error) {
    console.error('❌ Error deleting contact request:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact request',
      error: error.message
    })
  }
}
