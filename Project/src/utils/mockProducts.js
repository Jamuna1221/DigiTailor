export const mockDesigns = [
  {
    id: 1,
    name: 'Elegant Silk Saree',
    basePrice: 3999,
    primaryImage: 'https://images.unsplash.com/photo-1583391733981-5ac7da20e3f8?w=500',
    images: [ // Add this array
      'https://images.unsplash.com/photo-1583391733981-5ac7da20e3f8?w=500',
      'https://images.unsplash.com/photo-1583391733981-5ac7da20e3f8?w=600',
      'https://images.unsplash.com/photo-1583391733981-5ac7da20e3f8?w=700'
    ],
    description: 'Beautiful handwoven silk saree...',
    style: 'Traditional',
    difficulty: 'Medium',
    standardDays: 7,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    sizes: ['S', 'M', 'L', 'XL'],
    deliveryDate: '25 Aug, 2025',
    reviews: [
      { user: 'Priya S.', rating: 5, comment: 'Amazing quality!' }
    ]
  },
  {
    id: 2,
    name: 'Designer Kurta',
    basePrice: 2499,
    primaryImage: 'https://images.unsplash.com/photo-1583391733981-5ac7da20e3f8?w=500',
    images: [
      'https://images.unsplash.com/photo-1583391733981-5ac7da20e3f8?w=500',
      'https://images.unsplash.com/photo-1583391733981-5ac7da20e3f8?w=600'
    ],
    description: 'Elegant designer kurta...',
    style: 'Modern',
    difficulty: 'Easy',
    standardDays: 5,
    colors: ['#FF6B6B', '#4ECDC4'],
    sizes: ['S', 'M', 'L', 'XL'],
    deliveryDate: '23 Aug, 2025',
    reviews: []
  }
]
