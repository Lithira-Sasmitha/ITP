import React, { useState, useRef, useEffect } from "react";
import {
  useCreateProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../page/machine/redux/api/productapiSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Machinesidebar from "../../components/sidebar/Machinesidebar";
import axios from "axios";

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
  const [finalProducts, setFinalProducts] = useState([]);

  // Fetch final products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/finalProduct")
      .then((response) => {
        setFinalProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching final products:", error);
      });
  }, []);

  // Validation Methods
  const validateProductName = (value) => {
    if (!value.trim()) return "Product name is required.";
    if (value.length < 2) return "Product name must be at least 2 characters.";
    return "";
  };

  const validateProductPrice = (value) => {
    if (!value.trim()) return "Product price is required.";
    if (isNaN(value) || Number(value) <= 0)
      return "Price must be a positive number.";
    return "";
  };

  const validateProductDescription = (value) => {
    if (!value.trim()) return "Product description is required.";
    if (value.length < 10) return "Description must be at least 10 characters.";
    return "";
  };

  const validateProductImage = (file) => {
    if (!file) return "";
    const maxSize = 5 * 1024 * 1024;
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type))
      return "Only PNG, JPEG, or JPG files are allowed.";
    if (file.size > maxSize) return "File size must be less than 5MB.";
    return "";
  };

  // Event Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
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
      productDescription: validateProductDescription(
        formValues.productDescription
      ),
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
    setErrors({
      productName: "",
      productPrice: "",
      productDescription: "",
      productImage: "",
    });
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
        await updateProduct({
          id: editingProduct._id,
          data: formData,
        }).unwrap();
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
        text:
          error.data?.message ||
          "Adding/updating unsuccessful. Please try again.",
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
        setMessage({
          type: "error",
          text: "Error deleting product. Please try again.",
        });
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
    setPreviewImage(
      product.productImage
        ? `http://localhost:5000/${product.productImage}`
        : ""
    );
    setProductImage(null);
    setErrors({
      productName: "",
      productPrice: "",
      productDescription: "",
      productImage: "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFinalProductClick = (finalProduct) => {
    setFormValues({
      productName: finalProduct.name,
      productPrice: finalProduct.unit_price.toString(),
      productDescription: finalProduct.Description || "",
    });
    setEditingProduct(null);
    setPreviewImage("");
    setProductImage(null);
    setErrors({
      productName: "",
      productPrice: "",
      productDescription: "",
      productImage: "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Helper function for header and footer
    const addHeader = () => {
      // Removed "MyApp" branding
    };

    const addFooter = (pageNum, totalPages) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128); // Gray-500
      doc.text(`Generated on ${currentDate}`, margin, pageHeight - 10);
      doc.text(
        `Page ${pageNum} of ${totalPages}`,
        pageWidth - margin - 30,
        pageHeight - 10
      );
    };

    // Cover Page
    addHeader();
    addFooter(1, 2);

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 197, 94); // Green-600
    doc.text("Product List Report", margin, 60);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text(`Generated on ${currentDate}`, margin, 80);

    // Decorative line
    doc.setDrawColor(34, 197, 94); // Green-600
    doc.setLineWidth(0.5);
    doc.line(margin, 90, pageWidth - margin, 90);

    // Border
    doc.setDrawColor(37, 99, 235); // Blue-600
    doc.setLineWidth(0.3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Product List Table Page
    doc.addPage();
    addHeader();
    addFooter(2, 2);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 33, 33); // Gray-900
    doc.text("Product List", margin, 30);

    const headers = ["Item Number", "Product Name", "Price", "Description"];
    const data =
      products && products.length > 0
        ? products.map((product, index) => [
            index + 1,
            product.productName || "N/A",
            `$${parseFloat(product.productPrice).toFixed(2)}`,
            product.productDescription || "No description available",
          ])
        : [["", "No products available", "", ""]];

    try {
      autoTable(doc, {
        startY: 40,
        head: [headers],
        body: data,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 12,
          cellPadding: 6,
          textColor: [33, 33, 33],
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [34, 197, 94], // Green-600
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 12,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240], // Gray-100
        },
        margin: { left: margin, right: margin },
        tableWidth: "auto",
        columnStyles: {
          0: { cellWidth: 30 }, // Item Number
          1: { cellWidth: 60 }, // Product Name
          2: { cellWidth: 30 }, // Price
          3: { cellWidth: pageWidth - 2 * margin - 120 }, // Description
        },
      });
    } catch (error) {
      console.error("autoTable failed:", error.message, error.stack);
      let y = 40;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 33, 33);
      headers.forEach((header, index) => {
        doc.text(header, margin + index * 50, y);
      });
      y += 10;
      doc.setFont("helvetica", "normal");
      data.forEach((row) => {
        row.forEach((cell, index) => {
          doc.text(cell, margin + index * 50, y);
        });
        y += 10;
      });
    }

    // Save the PDF
    doc.save("product_list_report.pdf");
  };

  const apiBaseUrl = "http://localhost:5000";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="fixed flex-shrink-0 w-64 h-screen">
        <Machinesidebar />
      </div>

      <main className="flex-1 p-6 ml-64 overflow-y-auto">
        <div className="flex space-x-6">
          {/* Final Products List Section */}
          <div className="w-1/3 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Final Products
            </h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search final products..."
              className="w-full border rounded-md p-3 mb-4 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {finalProducts
                .filter((product) =>
                  product.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                  <div
                    key={product._id}
                    className="p-4 mb-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleFinalProductClick(product)}
                  >
                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600">
                      Price: ${product.unit_price}
                    </p>
                    <p className="text-gray-600">Stock: {product.quantity}</p>
                    <p className="text-gray-600">Status: {product.status}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 bg-white shadow-lg rounded-xl">
            <header className="p-6 mb-8 rounded-lg shadow-sm bg-gray-50">
              <h1 className="text-3xl font-bold text-black-900">
                Manage Products
              </h1>
              <p className="mt-2 text-gray-600">
                Add, edit, and delete product details
              </p>
            </header>

            <section className="p-6 mb-8 rounded-lg shadow-sm bg-gray-50">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formValues.productName}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                      errors.productName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.productName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.productName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Product Price *
                  </label>
                  <input
                    type="text"
                    name="productPrice"
                    value={formValues.productPrice}
                    onChange={handleInputChange}
                    placeholder="Enter product price"
                    className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                      errors.productPrice ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.productPrice && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.productPrice}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Product Description *
                  </label>
                  <textarea
                    name="productDescription"
                    value={formValues.productDescription}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows="4"
                    className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                      errors.productDescription
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.productDescription && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.productDescription}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Product Image
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                    className="block w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {errors.productImage && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.productImage}
                    </p>
                  )}
                  {previewImage && (
                    <div className="mt-4">
                      <img
                        src={previewImage}
                        alt="Product preview"
                        className="object-cover w-40 h-40 border rounded-md shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 font-semibold text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="px-6 py-2 font-semibold text-white transition-colors bg-green-700 rounded-md hover:bg-green-600 disabled:opacity-70"
                  >
                    {isCreating || isUpdating
                      ? "Processing..."
                      : editingProduct
                      ? "Update Product"
                      : "Add Product"}
                  </button>
                </div>
              </form>
            </section>

            <section className="p-6 rounded-lg shadow-sm bg-gray-50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Product List
                </h2>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 font-semibold text-white transition-colors bg-green-700 rounded-md hover:bg-green-600"
                >
                  Download PDF
                </button>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product name..."
                className="w-full max-w-md p-3 mb-4 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              {isLoading ? (
                <p className="py-4 text-center text-gray-500 animate-pulse">
                  Loading products...
                </p>
              ) : products && products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-collapse border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">
                          Image
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">
                          Name
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">
                          Price
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">
                          Description
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter((product) =>
                          product.productName
                            ? product.productName
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            : false
                        )
                        .map((product) => (
                          <tr
                            key={product._id}
                            className="transition-colors hover:bg-gray-50"
                          >
                            <td className="px-4 py-2 border border-gray-200">
                              {product.productImage ? (
                                <img
                                  src={`${apiBaseUrl}/${product.productImage}`}
                                  alt={product.productName}
                                  className="object-cover w-16 h-16 rounded-md"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://via.placeholder.com/150";
                                  }}
                                />
                              ) : (
                                <p className="text-gray-500">No image</p>
                              )}
                            </td>
                            <td className="px-4 py-2 border border-gray-200">
                              {product.productName}
                            </td>
                            <td className="px-4 py-2 border border-gray-200">
                              ${product.productPrice}
                            </td>
                            <td className="px-4 py-2 border border-gray-200">
                              {product.productDescription}
                            </td>
                            <td className="px-4 py-2 border border-gray-200">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="px-4 py-2 text-white transition-colors bg-green-700 rounded-md hover:bg-green-600"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setShowDeleteModal(true);
                                    setProductToDelete(product._id);
                                  }}
                                  className="px-4 py-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-4 text-center text-gray-500">
                  No products found.
                </p>
              )}
            </section>

            {showDeleteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
                <div className="p-6 bg-white rounded-lg shadow-lg w-96">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">
                    Confirm Deletion
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Are you sure you want to delete this product?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 font-semibold text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteProduct}
                      className="px-4 py-2 font-semibold text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {message.text && (
              <div
                className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg ${
                  message.type === "error"
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Prodetails;
