function GalleryTable({ items, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {items.map(item => (
        <div key={item._id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="relative h-40">
            <img src={item.afterImage} alt={item.title} className="w-full h-full object-cover" />
            {item.category && (
              <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded">
                {item.category}
              </span>
            )}
          </div>
          <div className="p-4">
            <div className="font-semibold text-gray-900">{item.title}</div>
            <div className="text-sm text-gray-600 line-clamp-2">{item.customerStory || item.description}</div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => onEdit(item)} className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">Edit</button>
              <button onClick={() => onDelete(item._id)} className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-10">
          No gallery items yet. Click “Add Story” to create one.
        </div>
      )}
    </div>
  )
}
export default GalleryTable
