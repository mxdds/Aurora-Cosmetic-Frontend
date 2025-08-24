import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { deleteProduct, getAllProducts } from "../../../slices/productSlice.ts";
import { getAllCategories } from "../../../slices/categorySlice.ts";

export function ManageProducts() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { list } = useSelector((state: RootState) => state.products);
    const categories = useSelector((state: RootState) => state.category.list || []);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [nameFilter, setNameFilter] = useState("");
    const [minPrice, setMinPrice] = useState<number | "">("");
    const [maxPrice, setMaxPrice] = useState<number | "">("");

    useEffect(() => {
        // Fetch products and categories
        const fetchData = async () => {
            await dispatch(getAllCategories());
            await dispatch(getAllProducts());
            setIsLoading(false); // Set loading to false after data is fetched
        };
        fetchData();
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                alert("Product deleted successfully!");
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product. Please try again.");
            }
        }
    };

    const handleUpdate = (product: any) => {
        navigate("/add-product", { state: { product } });
    };

    // Helper function to get category name by ID
    const getCategoryName = (category: string | { name: string }) => {
        if (typeof category === "string") {
            const foundCategory = categories.find((cat) => cat.name === category || cat.id === category);
            return foundCategory ? foundCategory.name : "Unknown Category";
        } else if (typeof category === "object" && category.name) {
            return category.name;
        }
        return "Unknown Category";
    };

    // Filter products based on the selected category, name, and price range
    const filteredProducts = list.filter((product) => {
        const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;
        const matchesName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesPrice =
            (minPrice === "" || product.price >= minPrice) &&
            (maxPrice === "" || product.price <= maxPrice);
        return matchesCategory && matchesName && matchesPrice;
    });

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading indicator while data is being fetched
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-pink-600">Manage Products</h1>
                    <button
                        onClick={() => navigate("/add-product")}
                        className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                        Add Product
                    </button>
                </div>

                {/* Filter Options */}
                <div className="mb-6 p-6 bg-gradient-to-r from-pink-400 via-purple-500 to-rose-600 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Category Selection Dropdown */}
                        <div>
                            <h2 className="text-xl font-bold mb-3 text-white">Filter by Category</h2>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="border border-pink-300 p-3 rounded-lg w-full shadow-sm focus:ring-pink-500 focus:border-pink-500 bg-white"
                            >
                                <option value="All">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Name Filter Input */}
                        <div>
                            <h2 className="text-xl font-bold mb-3 text-white">Filter by Name</h2>
                            <input
                                type="text"
                                placeholder="Search by product name"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                className="border border-pink-300 p-3 rounded-lg w-full shadow-sm focus:ring-pink-500 focus:border-pink-500"
                            />
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <h2 className="text-xl font-bold mb-3 text-white">Filter by Price Range</h2>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value ? +e.target.value : "")}
                                    className="border border-pink-300 p-3 rounded-lg w-full shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value ? +e.target.value : "")}
                                    className="border border-pink-300 p-3 rounded-lg w-full shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Display Filtered Products */}
                <div className="flex flex-wrap gap-4 justify-center items-start">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="w-64 bg-gradient-to-br from-white to-pink-50 border border-pink-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-lg border border-pink-200 mb-3"
                                />
                            )}
                            <h3 className="text-lg font-bold text-pink-600 mb-2">{product.name}</h3>
                            <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-2 rounded-lg mb-2">
                                <p className="text-sm text-white font-medium">
                                    Price: {product.price} {product.currency}
                                </p>
                            </div>
                            <p className="text-sm text-purple-600 mb-2">Category: {getCategoryName(product.category)}</p>
                            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                            <div className="flex gap-2 justify-between">
                                <button
                                    onClick={() => handleUpdate(product)}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
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
}