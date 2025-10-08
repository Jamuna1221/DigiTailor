import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceInterested: '',
    consultationType: 'online',
    preferredTime: '',
    message: ''
  })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeAccordion, setActiveAccordion] = useState(null)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm({ 
      ...form, 
      [name]: type === 'radio' ? value : value 
    })
    setError('')
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  if (!form.fullName || !form.email || !form.message) {
    setError('Please fill all required fields.')
    setLoading(false)
    return
  }

  try {
    // ✨ Make real API call to save contact form
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...form,
        requestType: 'general_inquiry' // Default type for form submissions
      })
    })

    const data = await response.json()

    if (data.success) {
      setSuccess(true)
      setForm({
        fullName: '',
        email: '',
        phone: '',
        serviceInterested: '',
        consultationType: 'online',
        preferredTime: '',
        message: ''
      })
      console.log('✅ Contact form submitted successfully')
    } else {
      setError(data.message || 'Failed to send message. Please try again.')
    }
  } catch (err) {
    console.error('❌ Contact form error:', err)
    setError('Network error. Please check your connection and try again.')
  } finally {
    setLoading(false)
  }
}



  const services = [
    'Custom Tailoring',
    'AI Design Studio',
    'Bridal Collection',
    'Corporate Wear',
    'Alterations & Repairs',
    'Styling Consultation'
  ]

  const faqData = [
    {
      question: 'How does the AI design process work?',
      answer: 'Our AI analyzes your style preferences, body measurements, and occasion requirements to suggest personalized designs. You can then customize these suggestions or create entirely new designs.'
    },
    {
      question: 'How long does it take to complete a custom garment?',
      answer: 'Standard custom garments take 7-14 days. Express service (24-48 hours) is available for an additional charge. Complex designs may require additional time.'
    },
    {
      question: 'Can I see samples of fabric and designs before ordering?',
      answer: 'Yes! Visit our studio for physical samples, or we can send fabric swatches by mail. We also offer virtual consultations with detailed fabric information.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to 15+ countries worldwide. Shipping costs and delivery times vary by location. International orders may require additional time for customs clearance.'
    },
    {
      question: 'What if the garment doesn\'t fit properly?',
      answer: 'We offer free alterations within 30 days of delivery. Our AI-powered measurement system ensures 95% fit accuracy, but we stand behind our quality guarantee.'
    },
    {
      question: 'What are your payment options?',
      answer: 'We accept all major credit cards, UPI, net banking, and digital wallets. For bulk orders, we also offer invoice-based payments with approved credit terms.'
    }
  ]

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-[#0B1220] dark:via-[#0B1220] dark:to-[#0B1220] dark:text-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t('contact.get_in_touch')}
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Ready to transform your wardrobe? Let's discuss your vision and create something amazing together.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:!text-white mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:!text-white">Phone</h3>
                      <p className="text-gray-600 dark:!text-white">+91 6374367712</p>
                      <p className="text-gray-600 dark:!text-white">+91 8608737147</p>
                      <p className="text-sm text-gray-500 dark:!text-white/90">Mon-Sat 9AM-7PM, Sun 10AM-5PM</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:!text-white">Email</h3>
                      <p className="text-gray-600 dark:!text-white">2312106@nec.edu.in</p>
                      <p className="text-gray-600 dark:!text-white">2312092@nec.edu.in</p>
                      <p className="text-sm text-gray-500 dark:!text-white/90">We reply within 2 hours</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:!text-white">Address</h3>
                      <p className="text-gray-600 dark:!text-white">16/9,West street</p>
                      <p className="text-gray-600 dark:!text-white">Thoothukudi,Tamilnadu -628721</p>
                      <p className="text-sm text-gray-500 dark:!text-white/90">Visit our design studio</p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:!text-white">Business Hours</h3>
                      <p className="text-gray-600 dark:!text-white">Mon-Fri: 9:00 AM - 7:00 PM</p>
                      <p className="text-gray-600 dark:!text-white">Sat-Sun: 10:00 AM - 5:00 PM</p>
                      <p className="text-sm text-gray-500 dark:!text-white/90">Consultation by appointment</p>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-800">
              <h2 className="text-3xl font-bold text-gray-900 dark:!text-white mb-6">{t('contact.send_message')}</h2>
              
              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-500/20 border border-green-300 dark:border-green-600 text-green-700 dark:!text-white rounded-lg">
                  ✅ Your message has been sent! We'll get back to you soon.
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/20 border border-red-300 dark:border-red-600 text-red-700 dark:!text-white rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:!text-white mb-2">
                      {t('contact.full_name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-[#0f172a] dark:text-white"
                      placeholder={t('contact.full_name')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:!text-white mb-2">
                      {t('contact.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-[#0f172a] dark:text-white"
                      placeholder={t('contact.email')}
                    />
                  </div>
                </div>

                {/* Phone and Service */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:!text-white mb-2">
                      {t('contact.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-[#0f172a] dark:text-white"
                      placeholder={t('contact.phone')}
                    />
                  </div>

                  <div>
                    <label htmlFor="serviceInterested" className="block text-sm font-medium text-gray-700 dark:!text-white mb-2">
                      {t('contact.service_interested')}
                    </label>
                    <select
                      id="serviceInterested"
                      name="serviceInterested"
                      value={form.serviceInterested}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-[#0f172a] dark:text-white"
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Consultation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:!text-white mb-3">
                    {t('contact.consultation_type')}
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center text-gray-700 dark:!text-white">
                      <input
                        type="radio"
                        name="consultationType"
                        value="online"
                        checked={form.consultationType === 'online'}
                        onChange={handleChange}
                        className="mr-2 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{t('contact.online_consultation')}</span>
                    </label>
                    <label className="flex items-center text-gray-700 dark:!text-white">
                      <input
                        type="radio"
                        name="consultationType"
                        value="in-person"
                        checked={form.consultationType === 'in-person'}
                        onChange={handleChange}
                        className="mr-2 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{t('contact.in_person_visit')}</span>
                    </label>
                  </div>
                </div>

                {/* Preferred Time */}
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 dark:!text-white mb-2">
                    {t('contact.preferred_time')}
                  </label>
                  <input
                    type="datetime-local"
                    id="preferredTime"
                    name="preferredTime"
                    value={form.preferredTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-[#0f172a] dark:text-white"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:!text-white mb-2">
                    {t('contact.message_label')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-[#0f172a] dark:text-white"
                    placeholder={t('contact.message_placeholder')}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={`w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      {t('contact.submit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Our Studio Section */}
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-[#111827]/60 backdrop-blur-sm">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 dark:!text-white mb-4">Visit Our Studio</h2>
      <p className="text-xl text-gray-600 dark:!text-white">
        Located in Thoothukudi, Tamil Nadu, our studio is equipped with the latest AI technology and traditional tailoring tools.
      </p>
    </div>

    <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-xl overflow-hidden p-8">
      <div className="text-center space-y-6">
        {/* Studio Icon */}
        <div className="w-24 h-24 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Studio Address */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:!text-white mb-2">DigiTailor Studio</h3>
          <p className="text-gray-600 dark:!text-white text-lg">16/9, West Street</p>
          <p className="text-gray-600 dark:!text-white text-lg">Thoothukudi, Tamil Nadu - 628721</p>
        </div>

        {/* Get Directions Button */}
        <button
          onClick={() => {
            const address = "https://maps.app.goo.gl/K6LvY2bWhcV59WPUA";
            const url = `${address}`;
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Get Directions 
        </button>

        {/* Additional Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={() => window.open('tel:+916374367712', '_self')}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Now
          </button>
          
          <button
            onClick={() => {
              const message = "Hi! I'd like to visit your DigiTailor studio. What are your visiting hours?";
              window.open(`https://wa.me/916374367712?text=${encodeURIComponent(message)}`, '_blank');
            }}
            className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515z"/>
            </svg>
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:!text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:!text-white">Find answers to common questions about our services</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-[#111827] rounded-xl shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:!text-white">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-white transform transition-transform ${
                      activeAccordion === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeAccordion === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:!text-white leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
