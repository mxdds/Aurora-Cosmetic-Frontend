import { useEffect, useState } from "react";
import { getAllProducts } from "../../../slices/productSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { getAllCategories } from "../../../slices/categorySlice.ts";

export function AdminPanel() {
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
                        className="w-65 h-auto border-pink-300 border-[1px] p-4 rounded-lg shadow-md bg-gradient-to-br from-white to-pink-50"
                    >
                        <h3 className="text-lg font-bold text-pink-600 mb-2">{product.name}</h3>
                        <p className="text-sm text-purple-600 mb-2">
                            {getCategoryName(product.category)}
                        </p>
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-50 h-50 object-cover mt-2 rounded-lg border border-pink-200"
                            />
                        ) : (
                            <div className="w-full h-40 bg-purple-100 flex items-center justify-center rounded-lg border border-pink-200">
                                <span className="text-pink-400">No Image</span>
                            </div>
                        )}
                        <p className="text-sm text-gray-600 mt-2 mb-2">{product.description}</p>
                        <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-2 rounded-lg">
                            <p className="text-lg font-medium text-white">
                                {product.price} <span className="text-sm">{product.currency}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}