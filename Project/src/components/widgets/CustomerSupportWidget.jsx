import { useState } from 'react'

function CustomerSupportWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const supportOptions = [
    {
      icon: "📱",
      title: "WhatsApp Chat",
      description: "Get instant help via WhatsApp",
      action: () => window.open("https://wa.me/919876543210", "_blank")
    },
    {
      icon: "📧",
      title: "Email Support",
      description: "Send us a detailed message",
      action: () => window.location.href = "mailto:support@digitailor.com"
    },
    {
      icon: "📞",
      title: "Call Us",
      description: "Speak directly with our team",
      action: () => window.location.href = "tel:+919876543210"
    },
    {
      icon: "📋",
      title: "Help Center",
      description: "Browse FAQs and guides",
      action: () => window.open("/help", "_blank")
    }
  ]

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {/* Support Options Panel */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64">
          <h3 className="font-semibold text-gray-900 mb-3">How can we help?</h3>
          <div className="space-y-3">
            {supportOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="w-full flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-lg">{option.icon}</span>
                <div>
                  <div className="font-medium text-sm text-gray-900">{option.title}</div>
                  <div className="text-xs text-gray-600">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Support Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        aria-label="Customer Support"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </button>
    </div>
  )
}

export default CustomerSupportWidget
