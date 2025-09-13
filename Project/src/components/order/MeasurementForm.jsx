import { useState } from 'react'

function MeasurementForm({ onSubmit }) {
  const [measurements, setMeasurements] = useState({
    measurementType: 'Blouse',
    bustChest: '',
    waist: '',
    hip: '',
    shoulderWidth: '',
    armLength: '',
    sleeveLength: '',
    blouseLength: '',
    neckSize: '',
    armhole: '',
    frontNeckDepth: '',
    backNeckDepth: '',
    specialNotes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setMeasurements(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(measurements)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Measurement Type
        </label>
        <select
          name="measurementType"
          value={measurements.measurementType}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Blouse">Blouse</option>
          <option value="Kurti">Kurti</option>
          <option value="Dress">Dress</option>
          <option value="Kids">Kids</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bust/Chest (inches) *
          </label>
          <input
            type="number"
            step="0.5"
            name="bustChest"
            value={measurements.bustChest}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            name="waist"
            value={measurements.waist}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            name="hip"
            value={measurements.hip}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            name="shoulderWidth"
            value={measurements.shoulderWidth}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arm Length (inches)
          </label>
          <input
            type="number"
            step="0.5"
            name="armLength"
            value={measurements.armLength}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sleeve Length (inches)
          </label>
          <input
            type="number"
            step="0.5"
            name="sleeveLength"
            value={measurements.sleeveLength}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blouse Length (inches)
          </label>
          <input
            type="number"
            step="0.5"
            name="blouseLength"
            value={measurements.blouseLength}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Neck Size (inches)
          </label>
          <input
            type="number"
            step="0.5"
            name="neckSize"
            value={measurements.neckSize}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Armhole (inches)
          </label>
          <input
            type="number"
            step="0.5"
            name="armhole"
            value={measurements.armhole}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Notes
        </label>
        <textarea
          name="specialNotes"
          value={measurements.specialNotes}
          onChange={handleChange}
          rows={3}
          placeholder="Any special requirements or notes for the tailor..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary px-8"
        >
          Save Measurements
        </button>
      </div>
    </form>
  )
}

export default MeasurementForm
