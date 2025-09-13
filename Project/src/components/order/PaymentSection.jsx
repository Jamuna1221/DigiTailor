import { useState } from 'react'

function PaymentSection({ orderData, onPaymentComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  })
  const [processing, setProcessing] = useState(false)

  const handlePayment = async (e) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const paymentResult = {
        success: true,
        transactionId: `TXN${Date.now()}`,
        paymentMethod,
        amount: orderData.totalAmount,
        timestamp: new Date()
      }
      
      setProcessing(false)
      onPaymentComplete && onPaymentComplete(paymentResult)
    }, 2000)
  }

  const generateUPIQR = () => {
    // Generate UPI QR code URL (mock)
    const upiString = `upi://pay?pa=digitailor@paytm&pn=DigiTailor&am=${orderData.totalAmount}&cu=INR&tn=Order Payment`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h3>
      
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Base Amount:</span>
            <span>${orderData.baseAmount?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Urgent Charges:</span>
            <span>${orderData.urgentCharges?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Material Charges:</span>
            <span>${orderData.materialCharges?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax Amount:</span>
            <span>${orderData.taxAmount?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span className="text-green-600">-${orderData.discountAmount?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total Amount:</span>
            <span className="text-blue-600">${orderData.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Select Payment Method</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'UPI', name: 'UPI', icon: '📱' },
            { id: 'Card', name: 'Card', icon: '💳' },
            { id: 'NetBanking', name: 'Net Banking', icon: '🏦' },
            { id: 'COD', name: 'Cash on Delivery', icon: '💰' }
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`p-3 border rounded-lg text-center transition-all ${
                paymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-1">{method.icon}</div>
              <div className="text-sm font-medium">{method.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Forms */}
      <form onSubmit={handlePayment}>
        {paymentMethod === 'UPI' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Scan QR Code or Enter UPI ID</p>
              <div className="inline-block p-4 bg-white border rounded-lg">
                <img
                  src={generateUPIQR()}
                  alt="UPI QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">UPI ID: digitailor@paytm</p>
            </div>
            <div className="text-center">
              <span className="text-gray-600">or</span>
            </div>
            <input
              type="text"
              placeholder="Enter your UPI ID"
              value={paymentDetails.upiId}
              onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {paymentMethod === 'Card' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Card Number"
              value={paymentDetails.cardNumber}
              onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Name on Card"
              value={paymentDetails.nameOnCard}
              onChange={(e) => setPaymentDetails({...paymentDetails, nameOnCard: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                value={paymentDetails.expiryDate}
                onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="CVV"
                value={paymentDetails.cvv}
                onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        )}

        {paymentMethod === 'NetBanking' && (
          <div>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select Your Bank</option>
              <option value="SBI">State Bank of India</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="AXIS">Axis Bank</option>
              <option value="KOTAK">Kotak Bank</option>
            </select>
          </div>
        )}

        {paymentMethod === 'COD' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-yellow-600 text-xl mr-3">⚠️</span>
              <div>
                <h4 className="font-medium text-yellow-800">Cash on Delivery</h4>
                <p className="text-yellow-700 text-sm">Please keep exact change ready. Additional COD charges: $2.00</p>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <div className="flex items-center text-green-700 text-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Your payment information is secure and encrypted
          </div>
        </div>

        {/* Payment Button */}
        <button
          type="submit"
          disabled={processing}
          className={`w-full mt-6 py-3 px-6 rounded-lg font-medium transition-all ${
            processing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </span>
          ) : (
            `Pay $${orderData.totalAmount?.toFixed(2) || '0.00'}`
          )}
        </button>
      </form>
    </div>
  )
}

export default PaymentSection
