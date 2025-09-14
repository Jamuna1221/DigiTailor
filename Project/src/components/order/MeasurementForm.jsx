import { useState } from 'react'

const measurementTypes = [
  'Blouse', 'Shirt', 'Pant', 'Saree Blouse', 'Lehenga', 'Suit', 'Dress', 'Kurta'
]

function MeasurementForm({ onSubmit }) {
  const [measurementType, setMeasurementType] = useState('Blouse')
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hip: '',
    shoulderWidth: '',
    armLength: '',
    sleeveLength: ''
  })
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleMeasurementChange = (field, value) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const measurementData = {
        measurementType,
        measurements,
        notes
      }

      await onSubmit(measurementData)
      
      // Reset form after successful submission
      setMeasurements({
        bust: '',
        waist: '',
        hip: '',
        shoulderWidth: '',
        armLength: '',
        sleeveLength: ''
      })
      setNotes('')
      
    } catch (error) {
      console.error('Error saving measurement:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Measurement Type
        </label>
        <select
          value={measurementType}
          onChange={(e) => setMeasurementType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {measurementTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Measurements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bust/Chest (inches) *
          </label>
          <input
            type="number"
            step="0.5"
            value={measurements.bust}
            onChange={(e) => handleMeasurementChange('bust', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waist (inches) *
          </label>
          <input
            type="number"
            step="0.5"
            value={measurements.waist}
            onChange={(e) => handleMeasurementChange('waist', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hip (inches) *
          </label>
          <input
            type="number"
            step="0.5"
            value={measurements.hip}
            onChange={(e) => handleMeasurementChange('hip', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shoulder Width (inches)
          </label>
          <input
            type="number"
            step="0.5"
            value={measurements.shoulderWidth}
            onChange={(e) => handleMeasurementChange('shoulderWidth', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arm Length (inches)
          </label>
          <input
            type="number"
            step="0.5"
            value={measurements.armLength}
            onChange={(e) => handleMeasurementChange('armLength', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sleeve Length (inches)
          </label>
          <input
            type="number"
            step="0.5"
            value={measurements.sleeveLength}
            onChange={(e) => handleMeasurementChange('sleeveLength', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any additional notes or special requirements..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Saving...' : 'Save Measurements'}
      </button>
    </form>
  )
}

export default MeasurementForm
