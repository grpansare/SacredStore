import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/system"; // For custom styling if needed
import axios from "axios";

// Custom styled components for form elements if you want to override MUI defaults
// This is optional, you can mostly rely on MUI's props
const FormContainer = styled("div")({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
});

const FormContent = styled("div")({
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "24px", // p-6 equivalent
  width: "100%",
  maxWidth: "800px", // Increased max-w-2xl equivalent (approx 800px)
  maxHeight: "90vh", // Added max height for scrollability
  overflowY: "auto", // Enable vertical scrolling
});

export const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: product?.id || null,
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "", // New field for original price
    stock: product?.stock || "",
    imageUrl: product?.imageUrl || "",
    description: product?.description || "",
    rating: product?.rating || 0,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const categories = [
    "Books",
    "Accessories",
    "Jewelry",
    "Idols & Statues",
    "Prayer Items",
    "Decor",
    "Music",
    "Gifts",
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;

    if (type === "number") {
      // For number inputs, parse as float. Handle empty string specifically.
      if (value === "") {
        newValue = ""; // Allow empty string for number fields
      } else {
        newValue = parseFloat(value);
        if (isNaN(newValue)) {
          newValue = ""; // If parsing results in NaN, reset to empty or 0
        }
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // In a real application, you'd send this 'file' to your backend
    // and receive an image URL back, then update formData.imageUrl.
    // For now, we'll just display the selected file name.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = formData.imageUrl;

    if (selectedFile) {
      // If a new file was selected
      try {
        const uploadedUrl = await uploadImage(selectedFile);
        finalImageUrl = uploadedUrl; // Update imageUrl with the new URL
      } catch (error) {
        alert("Failed to upload image. Product might be saved without image.");
        // Decide how to handle this: stop submission or proceed without image
        return; // Stop if image upload is critical
      }
    }

    // Now, save the product with the potentially new image URL
    onSave({ ...formData, imageUrl: finalImageUrl });
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // 'file' must match @RequestParam("file") in Spring Boot

    try {
      const response = await axios.post(
        "http://localhost:8080/api/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      return response.data; // This will be the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  return (
    <FormContainer>
      <FormContent>
        <h3 className="text-lg font-semibold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <TextField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined" // Or "filled", "standard"
            />

            {/* Category */}
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="">
                  <em>Select category</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Price */}
            <TextField
              label="Price (₹)"
              name="price"
              type="number"
              step="any"
              value={formData.price?.toString() ?? ""}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              inputProps={{ min: "0", step: "any", inputMode: "decimal" }}
            />

            {/* Original Price */}
            <TextField
              label="Original Price (₹)"
              name="originalPrice"
              type="number"
              step="any"
              value={formData.originalPrice}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              inputProps={{ min: "0", step: "any", inputMode: "decimal" }}
              helperText="Leave blank if no discount"
            />

            {/* Stock Quantity */}
            <TextField
              label="Stock Quantity"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              inputProps={{ min: "0" }} // Ensure non-negative stock
            />

            {/* Rating */}
            <TextField
              label="Rating (0-5)"
              name="rating"
              type="number"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              inputProps={{ min: "0", max: "5" }} // Restrict rating range
            />

            {/* Product Image File Selector */}
            <div>
              {" "}
              {/* Keep this div for custom file input styling and info */}
              <InputLabel htmlFor="imageFile" shrink>
                Product Image
              </InputLabel>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                // Tailwind classes for file input styling (MUI doesn't directly style file inputs)
                className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0 file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected file: {selectedFile.name}
                </p>
              )}
              {formData.imageUrl && !selectedFile && (
                <p className="mt-2 text-sm text-gray-500">
                  Current image URL:{" "}
                  <a
                    href={formData.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline truncate inline-block max-w-[calc(100%-150px)]"
                  >
                    {formData.imageUrl}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Description field remains full width */}
          <TextField
            label="Description"
            name="description"
            multiline // Makes it a textarea
            rows={3}
            value={formData.description}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {product ? "Update" : "Add"} Product
            </button>
          </div>
        </form>
      </FormContent>
    </FormContainer>
  );
};
