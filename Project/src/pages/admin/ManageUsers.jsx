import { useState, useEffect, useCallback } from 'react'

function ManageUsers() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`)
      const data = await response.json()
      
      if (data.success) {
        setContacts(data.data)
        console.log('✅ Loaded contact requests:', data.data.length)
      }
    } catch (error) {
      console.error('❌ Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
        <p className="text-gray-600">View and manage contact form submissions and user requests</p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Loading contact requests...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Requests ({contacts.length})</h2>
            
            {contacts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No contact requests found</p>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.fullName}</h3>
                        <p className="text-gray-600">{contact.email}</p>
                        <p className="text-sm text-gray-500 mt-1">{contact.message}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {contact.status || 'pending'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsers
