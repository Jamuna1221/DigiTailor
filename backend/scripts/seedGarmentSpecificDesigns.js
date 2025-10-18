import mongoose from 'mongoose'
import DesignElement from '../models/designElement.model.js'
import dotenv from 'dotenv'
dotenv.config()

const garmentSpecificDesigns = [
  // KURTI DESIGNS
  // Sleeves for Kurti
  {
    categoryId: 'sleeves',
    categoryName: 'Sleeves',
    name: 'Classic Full Sleeves',
    price: 150,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwSDE4MFYyMDBIMTUwVjEwMFoiIGZpbGw9IiM2MzY2RjEiLz4KPHRLEHU+Rm9sbCBTbGVldmU8L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPkZ1bGwgU2xlZXZlczwvdGV4dD4KPC9zdmc+',
    description: 'Traditional full-length sleeves with elegant finish for kurti',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'sleeves',
    categoryName: 'Sleeves',
    name: 'Modern Half Sleeves',
    price: 100,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwSDE4MFYxNTBIMTUwVjEwMFoiIGZpbGw9IiM2MzY2RjEiLz4KPHRLEHU+SGFsZiBTbGVldmU8L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPkhhbGYgU2xlZXZlczwvdGV4dD4KPC9zdmc+',
    description: 'Contemporary half sleeves perfect for casual kurti wear',
    garmentType: 'kurti',
    displayOrder: 2
  },
  {
    categoryId: 'sleeves',
    categoryName: 'Sleeves',
    name: 'Designer 3/4 Sleeves',
    price: 175,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwSDE4MFYxNzVIMTUwVjEwMFoiIGZpbGw9IiM2MzY2RjEiLz4KPHR9ClRleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPjMvNCBTbGVldmVzPC90ZXh0Pgo8L3N2Zz4=',
    description: '3/4 length sleeves with designer details for kurti',
    garmentType: 'kurti',
    displayOrder: 3
  },

  // Front Neck Designs for Kurti
  {
    categoryId: 'front-neck-designs',
    categoryName: 'Front Neck Designs',
    name: 'Classic Round Neck',
    price: 50,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEwMCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZGMSIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPk5lY2sgRGVzaWduPC90ZXh0Pgo8L3N2Zz4=',
    description: 'Timeless round neckline for versatile kurti styling',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'front-neck-designs',
    categoryName: 'Front Neck Designs',
    name: 'Elegant V-Neck',
    price: 100,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzAgODBMMjAwIDEyMEwyMzAgODBaIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2RjEiIHN0cm9rZS13aWR0aD0iMyIvPgo8dGV4dCB4PSIyMDAiIHk9IjE3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5WLU5lY2s8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Sophisticated V-neckline for formal kurti occasions',
    garmentType: 'kurti',
    displayOrder: 2
  },
  {
    categoryId: 'front-neck-designs',
    categoryName: 'Front Neck Designs',
    name: 'Boat Neck Design',
    price: 125,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgOTBIMjUwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2RjEiIHN0cm9rZS13aWR0aD0iMyIvPgo8dGV4dCB4PSIyMDAiIHk9IjE3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5Cb2F0IE5lY2s8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Graceful boat neck for elegant kurti silhouette',
    garmentType: 'kurti',
    displayOrder: 3
  },
  {
    categoryId: 'front-neck-designs',
    categoryName: 'Front Neck Designs',
    name: 'Square Neck Style',
    price: 150,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjE3MCIgeT0iODAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjM2NkYxIiBzdHJva2Utd2lkdGg9IjMiLz4KPHR9ClRleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPlNxdWFyZSBOZWNrPC90ZXh0Pgo8L3N2Zz4=',
    description: 'Modern square neckline with clean lines for kurti',
    garmentType: 'kurti',
    displayOrder: 4
  },

  // Back Neck Designs for Kurti
  {
    categoryId: 'back-neck-designs',
    categoryName: 'Back Neck Designs',
    name: 'Simple Back Design',
    price: 0,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzAgMTAwSDIzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjM2NkYxIiBzdHJva2Utd2lkdGg9IjMiLz4KPHR9Q2xlYW4gQmFjazwvdGV4dD4KPC9zdmc+',
    description: 'Clean and simple back neckline for kurti',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'back-neck-designs',
    categoryName: 'Back Neck Designs',
    name: 'Deep Back Cut',
    price: 100,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzAgODBMMjAwIDEzMEwyMzAgODBaIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2RjEiIHN0cm9rZS13aWR0aD0iMyIvPgo8dGV4dCB4PSIyMDAiIHk9IjE3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5EZWVwIEJhY2s8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Dramatic deep back for evening kurti wear',
    garmentType: 'kurti',
    displayOrder: 2
  },
  {
    categoryId: 'back-neck-designs',
    categoryName: 'Back Neck Designs',
    name: 'Keyhole Back',
    price: 125,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEwMCIgcj0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZGMSIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPktleWhvbGUgQmFjazwvdGV4dD4KPC9zdmc+',
    description: 'Elegant keyhole back detail for kurti',
    garmentType: 'kurti',
    displayOrder: 3
  },
  {
    categoryId: 'back-neck-designs',
    categoryName: 'Back Neck Designs',
    name: 'Button Back Closure',
    price: 125,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjNjM2NkYxIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjExMCIgcj0iNSIgZmlsbD0iIzYzNjZGMSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxMzAiIHI9IjUiIGZpbGw9IiM2MzY2RjEiLz4KPHR9ClRleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPkJ1dHRvbiBCYWNrPC90ZXh0Pgo8L3N2Zz4=',
    description: 'Elegant button closure detail for kurti back',
    garmentType: 'kurti',
    displayOrder: 4
  },

  // Embroidery for Kurti
  {
    categoryId: 'embroidery',
    categoryName: 'Embroidery',
    name: 'Floral Embroidery',
    price: 300,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyMCIgcj0iMzAiIGZpbGw9IiNGNDY4RkYiLz4KPGNpcmNsZSBjeD0iMTgwIiBjeT0iMTAwIiByPSIyMCIgZmlsbD0iI0Y0NjhGRiIvPgo8Y2lyY2xlIGN4PSIyMjAiIGN5PSIxMDAiIHI9IjIwIiBmaWxsPSIjRjQ2OEZGIi8+CjxjaXJjbGUgY3g9IjE4MCIgY3k9IjE0MCIgcj0iMjAiIGZpbGw9IiNGNDY4RkYiLz4KPGNpcmNsZSBjeD0iMjIwIiBjeT0iMTQwIiByPSIyMCIgZmlsbD0iI0Y0NjhGRiIvPgo8dGV4dCB4PSIyMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5GbG9yYWwgRW1icm9pZGVyeTwvdGV4dD4KPC9zdmc+',
    description: 'Delicate floral embroidery patterns for kurti',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'embroidery',
    categoryName: 'Embroidery',
    name: 'Mirror Work Design',
    price: 450,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjE4MCIgeT0iMTAwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNGRkQ3MDAiLz4KPHJlY3QgeD0iMjEwIiB5PSIxMDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI0ZGRDcwMCIvPgo8cmVjdCB4PSIxODAiIHk9IjEzMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRkZENzAwIi8+CjxyZWN0IHg9IjIxMCIgeT0iMTMwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNGRkQ3MDAiLz4KPHR9VGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzRCNUM2OCI+TWlycm9yIFdvcms8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Traditional mirror work embroidery for kurti',
    garmentType: 'kurti',
    displayOrder: 2
  },
  {
    categoryId: 'embroidery',
    categoryName: 'Embroidery',
    name: 'Thread Work Special',
    price: 350,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzAgMTAwUTIwMCAxMjAgMjMwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA5Njg4IiBzdHJva2Utd2lkdGg9IjMiLz4KPHBhdGggZD0iTTE3MCAxMjBRMjAwIDE0MCAyMzAgMTIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNFRjQ0NDQiIHN0cm9rZS13aWR0aD0iMyIvPgo8cGF0aCBkPSJNMTcwIDE0MFEyMDAgMTYwIDIzMCAxNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZGMSIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPlRocmVhZCBXb3JrPC90ZXh0Pgo8L3N2Zz4=',
    description: 'Colorful thread work embroidery for kurti',
    garmentType: 'kurti',
    displayOrder: 3
  },

  // Aari Work for Kurti
  {
    categoryId: 'aari-work',
    categoryName: 'Aari Work',
    name: 'Simple Aari Work',
    price: 400,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik0xNzAgMTIwTDIzMCAxMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik0yMDAgOTBMMjAwIDE1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZENzAwIiBzdHJva2Utd2lkdGg9IjQiLz4KPHR9VGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzRCNUM2OCI+U2ltcGxlIEFhcmk8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Basic Aari embroidery with traditional patterns for kurti',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'aari-work',
    categoryName: 'Aari Work',
    name: 'Heavy Aari Design',
    price: 800,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE4MCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjIyMCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE0MCIgcj0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSI0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPkhlYXZ5IEFhcmk8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Intricate heavy Aari work with detailed motifs for kurti',
    garmentType: 'kurti',
    displayOrder: 2
  },
  {
    categoryId: 'aari-work',
    categoryName: 'Aari Work',
    name: 'Gold Thread Aari',
    price: 1200,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE3MCIgY3k9IjkwIiByPSIxNSIgZmlsbD0iI0ZGRDcwMCIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSI5MCIgcj0iMTUiIGZpbGw9IiNGRkQ3MDAiLz4KPGNpcmNsZSBjeD0iMjMwIiBjeT0iOTAiIHI9IjE1IiBmaWxsPSIjRkZENzAwIi8+CjxjaXJjbGUgY3g9IjE3MCIgY3k9IjEzMCIgcj0iMTUiIGZpbGw9IiNGRkQ3MDAiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTMwIiByPSIxNSIgZmlsbD0iI0ZGRDcwMCIvPgo8Y2lyY2xlIGN4PSIyMzAiIGN5PSIxMzAiIHI9IjE1IiBmaWxsPSIjRkZENzAwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPkdvbGQgVGhyZWFkIEFhcmk8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Luxurious gold thread Aari embroidery for kurti',
    garmentType: 'kurti',
    displayOrder: 3
  },

  // Borders & Lace for Kurti
  {
    categoryId: 'borders-lace',
    categoryName: 'Borders & Lace',
    name: 'Lace Border',
    price: 200,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMjAwUTE1MCAyMDAgMTUwIDIwMFEyMDAgMjAwIDIwMCAyMDBRMjUwIDIwMCAyNTAgMjAwUTMwMCAyMDAgMzAwIDIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY4QjlBIiBzdHJva2Utd2lkdGg9IjMiLz4KPHR9Q2xlYW4gQmFjazwvdGV4dD4KPHRleHQgeD0iMjAwIiB5PSIxNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzRCNUM2OCI+TGFjZSBCb3JkZXI8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Decorative lace border for kurti',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'borders-lace',
    categoryName: 'Borders & Lace',
    name: 'Embroidered Border',
    price: 300,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEyMCIgY3k9IjIwMCIgcj0iNSIgZmlsbD0iI0Y0NjhGRiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIyMDAiIHI9IjUiIGZpbGw9IiNGNDY4RkYiLz4KPGNpcmNsZSBjeD0iMTgwIiBjeT0iMjAwIiByPSI1IiBmaWxsPSIjRjQ2OEZGIi8+CjxjaXJjbGUgY3g9IjIxMCIgY3k9IjIwMCIgcj0iNSIgZmlsbD0iI0Y0NjhGRiIvPgo8Y2lyY2xlIGN4PSIyNDAiIGN5PSIyMDAiIHI9IjUiIGZpbGw9IiNGNDY4RkYiLz4KPGNpcmNsZSBjeD0iMjcwIiBjeT0iMjAwIiByPSI1IiBmaWxsPSIjRjQ2OEZGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPkVtYnJvaWRlcmVkIEJvcmRlcjwvdGV4dD4KPC9zdmc+',
    description: 'Beautiful embroidered border for kurti',
    garmentType: 'kurti',
    displayOrder: 2
  },
  {
    categoryId: 'borders-lace',
    categoryName: 'Borders & Lace',
    name: 'Stone Border',
    price: 400,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjExNSIgeT0iMTk1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNGRkQ3MDAiLz4KPHJlY3QgeD0iMTQ1IiB5PSIxOTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI0ZGRDcwMCIvPgo8cmVjdCB4PSIxNzUiIHk9IjE5NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRkZENzAwIi8+CjxyZWN0IHg9IjIwNSIgeT0iMTk1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNGRkQ3MDAiLz4KPHJlY3QgeD0iMjM1IiB5PSIxOTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI0ZGRDcwMCIvPgo8cmVjdCB4PSIyNjUiIHk9IjE5NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRkZENzAwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPlN0b25lIEJvcmRlcjwvdGV4dD4KPC9zdmc+',
    description: 'Elegant stone border for kurti',
    garmentType: 'kurti',
    displayOrder: 3
  },
  {
    categoryId: 'borders-lace',
    categoryName: 'Borders & Lace',
    name: 'Mirror Border',
    price: 350,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEyMCIgY3k9IjIwMCIgcj0iNSIgZmlsbD0iI0VBQjMwOCIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIyMDAiIHI9IjUiIGZpbGw9IiNFQUIzMDgiLz4KPGNpcmNsZSBjeD0iMTgwIiBjeT0iMjAwIiByPSI1IiBmaWxsPSIjRUFCMzA4Ii8+CjxjaXJjbGUgY3g9IjIxMCIgY3k9IjIwMCIgcj0iNSIgZmlsbD0iI0VBQjMwOCIvPgo8Y2lyY2xlIGN4PSIyNDAiIGN5PSIyMDAiIHI9IjUiIGZpbGw9IiNFQUIzMDgiLz4KPGNpcmNsZSBjeD0iMjcwIiBjeT0iMjAwIiByPSI1IiBmaWxsPSIjRUFCMzA4Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPk1pcnJvciBCb3JkZXI8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Traditional mirror border for kurti',
    garmentType: 'kurti',
    displayOrder: 4
  },
  {
    categoryId: 'borders-lace',
    categoryName: 'Borders & Lace',
    name: 'Printed Border',
    price: 150,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMTkwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDA5Njg4Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPlByaW50ZWQgQm9yZGVyPC90ZXh0Pgo8L3N2Zz4=',
    description: 'Printed decorative border for kurti',
    garmentType: 'kurti',
    displayOrder: 5
  },

  // Prints & Patterns for Kurti
  {
    categoryId: 'prints-patterns',
    categoryName: 'Prints & Patterns',
    name: 'Floral Print',
    price: 250,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMTUiIGZpbGw9IiNGNDY4RkYiLz4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTMwIiByPSIxNSIgZmlsbD0iI0Y0NjhGRiIvPgo8Y2lyY2xlIGN4PSIxODAiIGN5PSIxNjAiIHI9IjE1IiBmaWxsPSIjRjQ2OEZGIi8+CjxjaXJjbGUgY3g9IjIyMCIgY3k9IjE4MCIgcj0iMTUiIGZpbGw9IiNGNDY4RkYiLz4KPHR9VGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzRCNUM2OCI+RmxvcmFsIFByaW50PC90ZXh0Pgo8L3N2Zz4=',
    description: 'Beautiful floral print pattern for kurti',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'prints-patterns',
    categoryName: 'Prints & Patterns',
    name: 'Geometric Print',
    price: 200,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjE0MCIgeT0iOTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjM2NkYxIiBzdHJva2Utd2lkdGg9IjMiLz4KPHJlY3QgeD0iMjMwIiB5PSI5MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2RjEiIHN0cm9rZS13aWR0aD0iMyIvPgo8cmVjdCB4PSIxNDAiIHk9IjE4MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2RjEiIHN0cm9rZS13aWR0aD0iMyIvPgo8cmVjdCB4PSIyMzAiIHk9IjE4MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2RjEiIHN0cm9rZS13aWR0aD0iMyIvPgo8dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5HZW9tZXRyaWMgUHJpbnQ8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Modern geometric print pattern for kurti',
    garmentType: 'kurti',
    displayOrder: 2
  },
  {
    categoryId: 'prints-patterns',
    categoryName: 'Prints & Patterns',
    name: 'Abstract Print',
    price: 180,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwUTIwMCAxNTAgMjUwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY4QjlBIiBzdHJva2Utd2lkdGg9IjQiLz4KPHBhdGggZD0iTTE2MCAyMDBRMjAwIDEzMCAyNDAgMjAwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDk2ODgiIHN0cm9rZS13aWR0aD0iNCIvPgo8Y2lyY2xlIGN4PSIxODAiIGN5PSIxMzAiIHI9IjEwIiBmaWxsPSIjNjM2NkYxIi8+CjxjaXJjbGUgY3g9IjIyMCIgY3k9IjE3MCIgcj0iMTAiIGZpbGw9IiM2MzY2RjEiLz4KPHR9VGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzRCNUM2OCI+QWJzdHJhY3QgUHJpbnQ8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Contemporary abstract print pattern for kurti',
    garmentType: 'kurti',
    displayOrder: 3
  },
  {
    categoryId: 'prints-patterns',
    categoryName: 'Prints & Patterns',
    name: 'Traditional Print',
    price: 220,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE3MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxjaXJjbGUgY3g9IjIzMCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxwYXRoIGQ9Ik0xNzAgMTQwTDE3MCAyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxwYXRoIGQ9Ik0yMzAgMTQwTDIzMCAyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPlRyYWRpdGlvbmFsIFByaW50PC90ZXh0Pgo8L3N2Zz4=',
    description: 'Traditional Indian print pattern for kurti',
    garmentType: 'kurti',
    displayOrder: 4
  },

  // Buttons & Closures for Kurti
  {
    categoryId: 'buttons-closures',
    categoryName: 'Buttons & Closures',
    name: 'Button Front',
    price: 100,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjkwIiByPSI4IiBmaWxsPSIjNjM2NkYxIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyMCIgcj0iOCIgZmlsbD0iIzYzNjZGMSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjgiIGZpbGw9IiM2MzY2RjEiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTgwIiByPSI4IiBmaWxsPSIjNjM2NkYxIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPkJ1dHRvbiBGcm9udDwvdGV4dD4KPC9zdmc+',
    description: 'Classic button front closure for kurti',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'buttons-closures',
    categoryName: 'Buttons & Closures',
    name: 'Zip Closure',
    price: 75,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgODBMMjAwIDIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjM2NkYxIiBzdHJva2Utd2lkdGg9IjQiLz4KPHBhdGggZD0iTTE5NSA4MEwyMDUgODAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZGMSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0xOTUgMTAwTDIwNSAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZGMSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0xOTUgMTIwTDIwNSAxMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZGMSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPlppcCBDbG9zdXJlPC90ZXh0Pgo8L3N2Zz4=',
    description: 'Modern zip closure for kurti',
    garmentType: 'kurti',
    displayOrder: 2
  },
  {
    categoryId: 'buttons-closures',
    categoryName: 'Buttons & Closures',
    name: 'Tie Closure',
    price: 50,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xODAgMTEwUTIwMCAxMzAgMjIwIDExMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY4QjlBIiBzdHJva2Utd2lkdGg9IjQiLz4KPHBhdGggZD0iTTE4MCAxNDBRMjAwIDEyMCAyMjAgMTQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjhCOUEiIHN0cm9rZS13aWR0aD0iNCIvPgo8dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5UaWUgQ2xvc3VyZTwvdGV4dD4KPC9zdmc+',
    description: 'Elegant tie closure for kurti',
    garmentType: 'kurti',
    displayOrder: 3
  },
  {
    categoryId: 'buttons-closures',
    categoryName: 'Buttons & Closures',
    name: 'Hook Closure',
    price: 60,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xOTAgMTEwTDIwMCAxMjBMMjEwIDExMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjM2NkYxIiBzdHJva2Utd2lkdGg9IjMiLz4KPHBhdGggZD0iTTE5MCAzMDBMMjAwIDEzMEwyMTAgMTQwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2RjEiIHN0cm9rZS13aWR0aD0iMyIvPgo8dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5Ib29rIENsb3N1cmU8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Traditional hook closure for kurti',
    garmentType: 'kurti',
    displayOrder: 4
  },
  {
    categoryId: 'buttons-closures',
    categoryName: 'Buttons & Closures',
    name: 'No Closure',
    price: 0,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjE4MCIgeT0iODAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIxNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KPHR9VGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzRCNUM2OCI+Tm8gQ2xvc3VyZTwvdGV4dD4KPC9zdmc+',
    description: 'Clean design with no closure for kurti',
    garmentType: 'kurti',
    displayOrder: 5
  },

  // Ropes & Strings for Kurti
  {
    categoryId: 'ropes-strings',
    categoryName: 'Ropes & Strings',
    name: 'Waist Tie',
    price: 75,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi0vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgMTUwSDI4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY4QjlBIiBzdHJva2Utd2lkdGg9IjQiLz4KPHBhdGggZD0iTTE2MCAxNDBRMTgwIDE2MCAyMDAgMTQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjhCOUEiIHN0cm9rZS13aWR0aD0iNCIvPgo8cGF0aCBkPSJNMjAwIDE0MFEyMjAgMTYwIDI0MCA1NDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGOEI5QSIgc3Ryb2tlLXdpZHRoPSI0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPldhaXN0IFRpZTwvdGV4dD4KPC9zdmc+',
    description: 'Decorative waist tie for kurti',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'ropes-strings',
    categoryName: 'Ropes & Strings',
    name: 'Neck Tie',
    price: 100,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTAwSDE2NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY4QjlBIiBzdHJva2Utd2lkdGg9IjQiLz4KPHBhdGggZD0iTTIzNSAxMDBIMjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjhCOUEiIHN0cm9rZS13aWR0aD0iNCIvPgo8cGF0aCBkPSJNMTgwIDEwMFEyMDAgOTAgMjIwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY4QjlBIiBzdHJva2Utd2lkdGg9IjQiLz4KPHR9VGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzRCNUM2OCI+TmVjayBUaWU8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Elegant neck tie detail for kurti',
    garmentType: 'kurti',
    displayOrder: 2
  },
  {
    categoryId: 'ropes-strings',
    categoryName: 'Ropes & Strings',
    name: 'Sleeve Tie',
    price: 85,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDAgMTYwUTE2MCAzNzAgMTgwIDE2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY4QjlBIiBzdHJva2Utd2lkdGg9IjQiLz4KPHBhdGggZD0iTTIyMCAxNjBRMjQwIDEyNCAyNjAgMTYwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjhCOUEiIHN0cm9rZS13aWR0aD0iNCIvPgo8dGV4dCB4PSIyMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5TbGVldmUgVGllPC90ZXh0Pgo8L3N2Zz4=',
    description: 'Stylish sleeve tie detail for kurti',
    garmentType: 'kurti',
    displayOrder: 3
  },

  // BLOUSE DESIGNS
  // Sleeves for Blouse
  {
    categoryId: 'sleeves',
    categoryName: 'Sleeves',
    name: 'Sleeveless Design',
    price: 0,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjE4MCIgeT0iMTAwIiB3aWR0aD0iNDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2RjEiIHN0cm9rZS13aWR0aD0iMyIvPgo8dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5TbGVldmVsZXNzPC90ZXh0Pgo8L3N2Zz4=',
    description: 'Clean sleeveless design for blouse',
    garmentType: 'blouse',
    displayOrder: 1
  },
  {
    categoryId: 'sleeves',
    categoryName: 'Sleeves',
    name: 'Cap Sleeves',
    price: 80,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwSDE3MFYxMjBIMTUwVjEwMFoiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTIzMCAxMDBIMjUwVjEyMEgyMzBWMTAwWiIgZmlsbD0iIzYzNjZGMSIvPgo8dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5DYXAgU2xlZXZlczwvdGV4dD4KPC9zdmc+',
    description: 'Elegant cap sleeves for blouse',
    garmentType: 'blouse',
    displayOrder: 2
  },
  {
    categoryId: 'sleeves',
    categoryName: 'Sleeves',
    name: 'Elbow Sleeves',
    price: 120,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwSDE3MFYxNjBIMTUwVjEwMFoiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTIzMCAxMDBIMjUwVjE2MEgyMzBWMTAwWiIgZmlsbD0iIzYzNjZGMSIvPgo8dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5FbGJvdyBTbGVldmVzPC90ZXh0Pgo8L3N2Zz4=',
    description: 'Graceful elbow sleeves for blouse',
    garmentType: 'blouse',
    displayOrder: 3
  },

  // Front Neck Designs for Blouse
  {
    categoryId: 'front-neck-designs',
    categoryName: 'Front Neck Designs',
    name: 'Deep V-Neck',
    price: 150,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgNzBMMjAwIDEzMEwyNDAgNzBaIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2RjEiIHN0cm9rZS13aWR0aD0iNCIvPgo8dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5EZWVwIFYtTmVjazwvdGV4dD4KPC9zdmc+',
    description: 'Glamorous deep V-neckline for blouse',
    garmentType: 'blouse',
    displayOrder: 1
  },
  {
    categoryId: 'front-neck-designs',
    categoryName: 'Front Neck Designs',
    name: 'Sweetheart Neck',
    price: 200,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzAgODBRMjAwIDEyMCAyMzAgODBaIiBmaWxsPSJub25lIiBzdHJva2U9IiNFRjQ0NDQiIHN0cm9rZS13aWR0aD0iNCIvPgo8dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNEI1QzY4Ij5Td2VldGhlYXJ0IE5lY2s8L3RleHQ+Cjwvc3ZnPg==',
    description: 'Romantic sweetheart neckline for blouse',
    garmentType: 'blouse',
    displayOrder: 2
  },
  {
    categoryId: 'front-neck-designs',
    categoryName: 'Front Neck Designs',
    name: 'High Neck',
    price: 180,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzAgNzBIMjMwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2RjEiIHN0cm9rZS13aWR0aD0iNCIvPgo8cGF0aCBkPSJNMTcwIDcwTDE3MCA5MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjM2NkYxIiBzdHJva2Utd2lkdGg9IjQiLz4KPHBhdGggZD0iTTIzMCA3MEwyMzAgOTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZGMSIgc3Ryb2tlLXdpZHRoPSI0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0QjVDNjgiPkhpZ2ggTmVjazwvdGV4dD4KPC9zdmc+',
    description: 'Sophisticated high neckline for blouse',
    garmentType: 'blouse',
    displayOrder: 3
  },
  {
    categoryId: 'front-neck-designs',
    categoryName: 'Front Neck Designs',
    name: 'Off-Shoulder',
    price: 220,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDAgMTAwSDI2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRjQ2OEZGIiBzdHJva2Utd2lkdGg9IjQiLz4KPHR9VGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzRCNUM2OCI+T2ZmLVNob3VsZGVyPC90ZXh0Pgo8L3N2Zz4=',
    description: 'Trendy off-shoulder design for blouse',
    garmentType: 'blouse',
    displayOrder: 4
  }

  // Continue adding more blouse and saree designs...
]

async function seedGarmentSpecificDesigns() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digitailor')
    console.log('Connected to MongoDB')

    // Clear existing design elements
    await DesignElement.deleteMany({})
    console.log('Cleared existing design elements')

    // Insert new garment-specific designs
    const insertedElements = await DesignElement.insertMany(garmentSpecificDesigns)
    console.log(`Inserted ${insertedElements.length} garment-specific design elements`)

    // Display summary by garment type
    const summary = await DesignElement.aggregate([
      { $group: { _id: { garmentType: '$garmentType', categoryId: '$categoryId' }, count: { $sum: 1 } } },
      { $sort: { '_id.garmentType': 1, '_id.categoryId': 1 } }
    ])

    console.log('\nSummary by garment type and category:')
    let currentGarment = ''
    summary.forEach(item => {
      if (item._id.garmentType !== currentGarment) {
        currentGarment = item._id.garmentType
        console.log(`\n${currentGarment.toUpperCase()}:`)
      }
      console.log(`  ${item._id.categoryId}: ${item.count} designs`)
    })

    // Overall summary
    const overallSummary = await DesignElement.aggregate([
      { $group: { _id: '$garmentType', count: { $sum: 1 } } }
    ])

    console.log('\nOverall summary:')
    overallSummary.forEach(item => {
      console.log(`${item._id}: ${item.count} total designs`)
    })

    console.log('\n✅ Garment-specific seed data inserted successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding garment-specific data:', error)
    process.exit(1)
  }
}

// Run the seed function
seedGarmentSpecificDesigns()