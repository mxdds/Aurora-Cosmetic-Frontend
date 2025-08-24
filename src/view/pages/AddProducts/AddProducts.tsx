import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {addProduct, updateProduct, deleteProduct, getAllProducts} from "../../../slices/productSlice";
import { getAllCategories } from "../../../slices/categorySlice";
import type { AppDispatch, RootState } from "../../../store/store";
import mongoose from "mongoose";

interface productData {
    id?: string;
    name: string;
    price: number;
    category: string;
    description: string;
    currency: string;
    image?: File | string; // URL for existing images
}

export function AddProduct() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();

    const categories = useSelector((state: RootState) => state.category.list || []);

    const [formData, setFormData] = useState<productData>({
        name: "",
        price: 0,
        currency: "USD",
        category: "",
        description: "",
        image: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        dispatch(getAllCategories());
        if (location.state && location.state.product) {
            const product = location.state.product;
            setFormData({
                ...product,
                category: typeof product.category === "object" ? product.category.id : product.category,
            });
        }
    }, [location.state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            // setIsUploading(true); // Start the upload process
            const timestamp = Math.round(new Date().getTime() / 1000);
            try {
                const response = await fetch("http://localhost:3000/api/cloudinary/signature", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ timestamp }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch Cloudinary signature");
                }

                const { signature } = await response.json();

                const uploadData = new FormData();
                uploadData.append("file", files[0]);
                uploadData.append("upload_preset", "my_preset");
                uploadData.append("api_key", "117186248654227");
                uploadData.append("timestamp", timestamp.toString());
                uploadData.append("signature", signature);

                const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dfwzzxgja/image/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload image to Cloudinary");
                }

                const data = await uploadResponse.json();

                if (data.secure_url) {
                    setFormData((prevState) => ({ ...prevState, image: data.secure_url }));
                    console.log("New Image URL set in formData:", data.secure_url);
                } else {
                    throw new Error("secure_url not found in Cloudinary response");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            // } finally {
            //     setIsUploading(false); // End the upload process
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        if (!formData.image || typeof formData.image !== "string") {
            console.error("Image URL is missing in formData");
            return;

        }
            // Find the category name from the selected category ID
            const selectedCategory = categories.find((cat) => cat.id === formData.category);
            if (!selectedCategory) {
                console.error("Selected category not found");
                return;
            }

            const formPayload = {
                id: formData.id || undefined,
                name: formData.name,
                price: formData.price,
                currency: formData.currency,
                description: formData.description,
                category: selectedCategory.name,
                image: formData.image,
            };


            if (formData.id) {
                await dispatch(updateProduct(formPayload));
            } else {
                // console.log("FormData before submission:", Object.fromEntries(formPayload.entries()));
                await dispatch(addProduct(formPayload));
            }
            navigate("/manage-product", { state: { reload: true } }); // Pass reload state
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 p-4">
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-lg p-8 border border-pink-200">
                <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">
                    {formData.id ? "Update Product" : "Add Product"}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="border border-pink-300 p-3 w-full rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-all"
                            placeholder="Enter product name"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="border border-pink-300 p-3 w-full rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-all"
                                placeholder="0.00"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                            <input
                                type="text"
                                name="currency"
                                value={formData.currency}
                                onChange={handleInputChange}
                                className="border border-pink-300 p-3 w-full rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-all"
                                placeholder="USD"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="border border-pink-300 p-3 w-full rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-all bg-white"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="border border-pink-300 p-3 w-full rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-all h-24 resize-none"
                            placeholder="Enter product description"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="border border-pink-300 p-3 w-full rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
                            accept="image/*"
                        />
                        {typeof formData.image === "string" && formData.image && (
                            <div className="mt-4 flex justify-center">
                                <img
                                    src={formData.image}
                                    alt="Product"
                                    className="w-40 h-40 object-cover rounded-lg border-2 border-pink-300 shadow-md"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium text-lg px-6 py-3 rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            {formData.id ? "Update Product" : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// export default AddProduct;