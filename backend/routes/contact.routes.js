import express from 'express'
import {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact
} from '../controllers/contact.controller.js'

const router = express.Router()

// Public route - Contact form submission
router.post('/', createContact)

// Admin routes - Contact management
router.get('/', getAllContacts)
router.put('/:id', updateContactStatus)
router.delete('/:id', deleteContact)

export default router
