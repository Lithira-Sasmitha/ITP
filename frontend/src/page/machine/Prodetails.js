import React, { useState, useRef } from "react";
import {
  useCreateProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../page/machine/redux/api/productapiSlice";
import jsPDF from "jspdf";

const Prodetails = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const { data: products, isLoading, refetch } = useGetProductsQuery();
  const [formValues, setFormValues] = useState({
    productName: "",
    productPrice: "",
    productDescription: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [errors, setErrors] = useState({
    productName: "",
    productPrice: "",
    productDescription: "",
    productImage: "",
  });

  // Simple Validation Methods
  const validateProductName = (value) => {
    if (!value.trim()) return "Product name is required.";
    if (value.length < 2) return "Product name must be at least 2 characters.";
    return "";
  };

  const validateProductPrice = (value) => {
    if (!value.trim()) return "Product price is required.";
    if (isNaN(value) || Number(value) <= 0) return "Price must be a positive number.";
    return "";
  };

  const validateProductDescription = (value) => {
    if (!value.trim()) return "Product description is required.";
    if (value.length < 10) return "Description must be at least 10 characters.";
    return "";
  };

  const validateProductImage = (file) => {
    if (!file) return "";
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) return "Only PNG, JPEG, or JPG files are allowed.";
    if (file.size > maxSize) return "File size must be less than 5MB.";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    // Validate in real-time
    setErrors((prev) => ({
      ...prev,
      [name]:
        name === "productName"
          ? validateProductName(value)
          : name === "productPrice"
          ? validateProductPrice(value)
          : validateProductDescription(value),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateProductImage(file);
      setErrors((prev) => ({ ...prev, productImage: error }));

      if (!error) {
        setProductImage(file);
        const fileReader = new FileReader();
        fileReader.onload = () => setPreviewImage(fileReader.result);
        fileReader.readAsDataURL(file);
      } else {
        setProductImage(null);
        setPreviewImage("");
      }
    }
  };

  const isFormValid = () => {
    const newErrors = {
      productName: validateProductName(formValues.productName),
      productPrice: validateProductPrice(formValues.productPrice),
      productDescription: validateProductDescription(formValues.productDescription),
      productImage: validateProductImage(productImage),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleCancel = () => {
    setFormValues({
      productName: "",
      productPrice: "",
      productDescription: "",
    });
    setProductImage(null);
    setPreviewImage("");
    setEditingProduct(null);
    setErrors({ productName: "", productPrice: "", productDescription: "", productImage: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setMessage({ type: "error", text: "Please fix the errors in the form." });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productName", formValues.productName);
      formData.append("productPrice", formValues.productPrice);
      formData.append("productDescription", formValues.productDescription);
      if (productImage) formData.append("productImage", productImage);

      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, data: formData }).unwrap();
        setMessage({ type: "success", text: "Product updated successfully" });
      } else {
        await createProduct(formData).unwrap();
        setMessage({ type: "success", text: "Product added successfully" });
      }

      handleCancel();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      refetch();
    } catch (error) {
      console.error("Error adding/updating product:", error);
      setMessage({
        type: "error",
        text: error.data?.message || "Adding/updating unsuccessful. Please try again.",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete).unwrap();
        setMessage({ type: "success", text: "Product deleted successfully" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        refetch();
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting product:", error);
        setMessage({ type: "error", text: "Error deleting product. Please try again." });
      }
    }
  };

  const handleEditProduct = (product) => {
    setFormValues({
      productName: product.productName,
      productPrice: product.productPrice,
      productDescription: product.productDescription,
    });
    setEditingProduct(product);
    setPreviewImage(product.productImage ? `http://localhost:5000/${product.productImage}` : "");
    setProductImage(null);
    setErrors({ productName: "", productPrice: "", productDescription: "", productImage: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Product List", 20, 20);
    if (products && products.length > 0) {
      products.forEach((product, index) => {
        doc.text(`${index + 1}. ${product.productName} - $${product.productPrice}`, 20, 30 + index * 10);
      });
    } else {
      doc.text("No products available", 20, 30);
    }
    doc.save("products.pdf");
  };

  const apiBaseUrl = "http://localhost:5000";

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      {/* Form Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-5">Manage Products</h1>
        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name *</label>
            <input
              type="text"
              name="productName"
              value={formValues.productName}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.productName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Price *</label>
            <input
              type="text"
              name="productPrice"
              value={formValues.productPrice}
              onChange={handleInputChange}
              placeholder="Enter product price"
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.productPrice ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.productPrice && <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>}
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Description *</label>
            <textarea
              name="productDescription"
              value={formValues.productDescription}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows="3"
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.productDescription ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.productDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.productDescription}</p>
            )}
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
            {errors.productImage && <p className="text-red-500 text-sm mt-1">{errors.productImage}</p>}
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Product preview"
                  className="h-32 w-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-70"
            >
              {isCreating || isUpdating ? "Processing..." : editingProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Product List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-5">Product List</h1>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name..."
            className="border rounded-md px-4 py-2 w-full max-w-md"
          />
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Download PDF
          </button>
        </div>

        {isLoading ? (
          <p>Loading products...</p>
        ) : products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-200 px-4 py-2">Product Image</th>
                  <th className="border border-gray-200 px-4 py-2">Product Name</th>
                  <th className="border border-gray-200 px-4 py-2">Product Price</th>
                  <th className="border border-gray-200 px-4 py-2">Product Description</th>
                  <th className="border border-gray-200 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((product) =>
                    product.productName
                      ? product.productName.toLowerCase().includes(searchTerm.toLowerCase())
                      : false
                  )
                  .map((product) => (
                    <tr key={product._id}>
                      <td className="border border-gray-200 px-4 py-2">
                        {product.productImage ? (
                          <img
                            src={`${apiBaseUrl}/${product.productImage}`}
                            alt={product.productName}
                            className="h-16 w-16 object-cover rounded-md"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        ) : (
                          <p>No image</p>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">{product.productName}</td>
                      <td className="border border-gray-200 px-4 py-2">{product.productPrice}</td>
                      <td className="border border-gray-200 px-4 py-2">{product.productDescription}</td>
                      <td className="border border-gray-200 px-4 py-2 flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="bg-green-700 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteModal(true);
                            setProductToDelete(product._id);
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this product?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg ${
            message.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Prodetails;