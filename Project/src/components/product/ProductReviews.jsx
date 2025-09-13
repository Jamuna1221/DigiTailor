function ProductReviews({ reviews }) {
  return (
    <div>
      <h2 className="font-bold text-xl mb-3">Customer Reviews</h2>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-xl">
              <div className="flex gap-2 items-center mb-1">
                <span className="font-medium">{review.user}</span>
                <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              <div className="text-gray-700">{review.comment}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No reviews yet.</div>
      )}
    </div>
  )
}
export default ProductReviews
