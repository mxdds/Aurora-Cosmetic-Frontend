import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getAllCategories } from "../../../slices/categorySlice.ts";
import type { AppDispatch, RootState } from "../../../store/store.ts";

export const ManageCategory = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { list } = useSelector((state: RootState) => state.category);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await dispatch(deleteCategory(id)).unwrap(); // Pass the id as a string
                alert("Category deleted successfully!");
            } catch (error) {
                console.error("Error deleting category:", error);
                alert("Failed to delete category. Please try again.");
            }
        }
    };

    const handleUpdate = (category: any) => {
        navigate("/add-category", { state: { category } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-pink-600">Manage Categories</h1>
                    <button
                        onClick={() => navigate("/add-category")}
                        className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                        Add Category
                    </button>
                </div>
                <div className="flex flex-wrap gap-4 justify-center items-start">
                    {list.map((category) => (
                        <div
                            key={category.id}
                            className="w-64 bg-gradient-to-br from-white to-pink-50 border border-pink-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            <h3 className="text-lg font-bold text-pink-600 mb-2">{category.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                            {category.image && (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-40 object-cover rounded-lg border border-pink-200 mb-3"
                                />
                            )}
                            <div className="flex gap-2 justify-between">
                                <button
                                    onClick={() => handleUpdate(category)}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};