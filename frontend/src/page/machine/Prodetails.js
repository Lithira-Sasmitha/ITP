import { useState } from 'react';

const Prodetails = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productPhoto, setProductPhoto] = useState(null);
  const [productDescription, setProductDescription] = useState('');
  const [products, setProducts] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(),
      productName,
      productPrice,
      productPhoto: productPhoto ? URL.createObjectURL(productPhoto) : null,
      productDescription,
    };

    setProducts([...products, newProduct]);
    resetForm();
  };

  const resetForm = () => {
    setProductName('');
    setProductPrice('');
    setProductPhoto(null);
    setProductDescription('');
  };

  const handlePhotoChange = (e) => {
    setProductPhoto(e.target.files[0]);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleUpdate = (id) => {
    const productToUpdate = products.find(product => product.id === id);
    setProductName(productToUpdate.productName);
    setProductPrice(productToUpdate.productPrice);
    setProductPhoto(null);  // you can handle updating photo as needed
    setProductDescription(productToUpdate.productDescription);
    handleDelete(id); // Delete the product before updating
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Product Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="mt-1 p-3 w-full border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Price</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="mt-1 p-3 w-full border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Photo</label>
          <input
            type="file"
            onChange={handlePhotoChange}
            className="mt-1 p-3 w-full border rounded-md"
            accept="image/*"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Description</label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="mt-1 p-3 w-full border rounded-md"
            rows="6"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-900 text-white p-3 rounded-md hover:bg-green-600"
        >
          Add Product
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4">Product List</h2>
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product.id} className="p-4 border rounded-md bg-gray-100">
            <h3 className="text-lg font-semibold">{product.productName}</h3>
            <p>Price: ${product.productPrice}</p>
            {product.productPhoto && (
              <img
                src={product.productPhoto}
                alt={product.productName}
                className="w-24 h-24 mt-2 object-cover rounded-md"
              />
            )}
            <p className="mt-2">{product.productDescription}</p>

            <div className="flex space-x-4 mt-4">
              {/* Update Button */}
              <button
                onClick={() => handleUpdate(product.id)}
                className="bg-green-900 text-white p-2 rounded-md hover:bg-green-400"
              >
                Update
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Prodetails;
