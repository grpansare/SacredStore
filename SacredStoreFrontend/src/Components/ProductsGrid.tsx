import { Edit, Eye, Package, Star, Trash2 } from 'lucide-react';
import React from 'react'

const ProductsGrid = ({products, setSelectedProduct, setShowAddProduct,handleDeleteProduct}) => {
  return (
    <div>  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map(product => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col">
                    {/* Product Image */}
                    <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-fill" />
                      ) : (
                        <div className="text-6xl text-gray-400">{product.image || '📦'}</div>
                      )}
                    </div>
    
                    {/* Product Details */}
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
    
                        {/* Price and Original Price */}
                        <div className="flex items-baseline space-x-2 mb-2">
                          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
    
                        {/* Stock and Rating */}
                        <div className="flex items-center justify-between text-sm mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock < 20 ? 'bg-red-100 text-red-800' :
                              product.stock < 50 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                            Stock: {product.stock}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{product.rating ? product.rating.toFixed(1) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
    
                      {/* Actions */}
                      <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                        <button className="flex-1 py-2 px-3 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-md flex items-center justify-center space-x-1 text-sm">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowAddProduct(true);
                          }}
                          className="flex-1 py-2 px-3 text-green-600 border border-green-600 hover:bg-green-50 rounded-md flex items-center justify-center space-x-1 text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 py-2 px-3 text-red-600 border border-red-600 hover:bg-red-50 rounded-md flex items-center justify-center space-x-1 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No products found. Add some to get started!</p>
                </div>
              )}
            </div></div>
  )
}

export default ProductsGrid