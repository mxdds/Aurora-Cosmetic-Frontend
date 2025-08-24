import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCategory, updateCategory } from "../../../slices/categorySlice.ts";
import type { AppDispatch } from "../../../store/store.ts";

interface CategoryData {
    id?: string;
    name: string;
    description: string;
    image?: File | string; // File for new uploads, string for existing images
}

export const AddCategory = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CategoryData>({
        name: "",
        description: "",
        image: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (location.state && location.state.category) {
            setFormData(location.state.category);
        }
    }, [location.state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const timestamp = Math.round(new Date().getTime() / 1000);

            try {
                // Fetch signature from the backend
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

                // Upload the image to Cloudinary
                const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dfwzzxgja/image/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload image to Cloudinary");
                }

                const data = await uploadResponse.json();

                // Set the new image URL in formData
                if (data.secure_url) {
                    setFormData((prevState) => ({ ...prevState, image: data.secure_url }));
                    console.log("New Image URL set in formData:", data.secure_url);
                } else {
                    throw new Error("secure_url not found in Cloudinary response");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ensure the image URL is present
            if (!formData.image || typeof formData.image !== "string") {
                console.error("Image URL is missing in formData");
                return;
            }

            const formPayload = new FormData();
            formPayload.append("name", formData.name);
            formPayload.append("description", formData.description);

            // Append the image URL
            formPayload.append("image", formData.image);

            if (formData.id) {
                // Update category
                formPayload.append("id", formData.id);
                await dispatch(updateCategory(formPayload));
            } else {
                // Add new category
                await dispatch(addCategory(formPayload));
            }

            navigate("/manage-category");
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 p-4">
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-lg p-8 border border-pink-200">
                <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">
                    {formData.id ? "Update Category" : "Add Category"}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="border border-pink-300 p-3 w-full rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-all"
                            placeholder="Enter category name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="border border-pink-300 p-3 w-full rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-all h-24 resize-none"
                            placeholder="Enter category description"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
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
                                    alt="Category"
                                    className="w-40 h-40 object-cover rounded-lg border-2 border-pink-300 shadow-md"
                                />
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium text-lg px-6 py-3 rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                        {formData.id ? "Update Category" : "Add Category"}
                    </button>
                </form>
            </div>
        </div>
    );
};