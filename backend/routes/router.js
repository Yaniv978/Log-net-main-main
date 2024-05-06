const express = require('express')
const router = express.Router()
const schemas = require('../models/schemas')

router.post('/contact', async(req, res) => {
 
  const { firstName, lastName, email, phone, message,code } = req.body;
  const contactData = { firstName, lastName, email, phone, message,code };

  const newContact = new schemas.Contact(contactData)
  const saveContact = await newContact.save()

      if (saveContact) {
        res.send('Message sent. Thank you.')
      } else {
        res.send('Failed to send message.')
      }
  res.end()
})

module.exports = router