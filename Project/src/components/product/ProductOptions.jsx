import { useState } from 'react'
function ProductOptions({ product }) {
  const [color, setColor] = useState(product.colors[0])
  const [size, setSize] = useState(product.sizes)
  return (
    <div className="flex flex-col gap-3 mb-6">
      <div>
        <div className="font-medium mb-1">Color:</div>
        <div className="flex gap-2">
          {product.colors.map((c) => (
            <button key={c}
              style={{ background: c }}
              className={`w-7 h-7 rounded-full border-2 ${c === color ? 'border-indigo-700' : 'border-gray-200'}`}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="font-medium mb-1">Size:</div>
        <div className="flex gap-2">
          {product.sizes.map((s) => (
            <button key={s}
              className={`px-3 py-1 rounded-lg border-2 ${s === size ? 'border-indigo-700' : 'border-gray-200'}`}
              onClick={() => setSize(s)}
            >{s}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="font-medium mb-1">Quantity:</div>
        <input type="number" min="1" defaultValue={1} className="w-16 px-3 py-1 border rounded-lg" />
      </div>
    </div>
  )
}
export default ProductOptions
