import { useEffect, useState } from "react";
import { Product } from "../../common/product/Product.tsx";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { getAllProducts } from "../../../slices/productSlice.ts";
import {getUserFromToken} from "../../../auth/auth.ts";
import {fetchCart} from "../../../slices/cartSlice.ts";

export function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const { list } = useSelector((state: RootState) => state.products);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [nameFilter, setNameFilter] = useState("");
    const [minPrice, setMinPrice] = useState<number | "">("");
    const [maxPrice, setMaxPrice] = useState<number | "">("");

    useEffect(() => {
        const fetchProductsAndCart = async () => {
            try {
                const authToken = localStorage.getItem("token");
                if (!authToken) {
                    console.error("No auth token found. Unable to fetch products.");
                    return;
                }
                const userData = getUserFromToken(authToken);
                const userId = userData.userId;

                await dispatch(getAllProducts());
                await dispatch(fetchCart(userId)); // Fetch updated cart
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchProductsAndCart();
    }, [dispatch]);
    // Get unique categories from the product list
    const categories = ["All", ...new Set(list.map((product) => product.category))];

    // Filter products based on the selected category, name, and price range
    const filteredProducts = list
        .filter((product) => product && product.id && product.name) // Ensure valid product data
        .filter((product) => {
            const matchesCategory =
                selectedCategory === "All" || product.category === selectedCategory;
            const matchesName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
            const matchesPrice =
                (minPrice === "" || product.price >= minPrice) &&
                (maxPrice === "" || product.price <= maxPrice);
            return matchesCategory && matchesName && matchesPrice;
        });

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
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
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
                {filteredProducts
                    .filter((product) => product && product.id && product.name)
                    .map((product) => {
                        console.log("Rendering product:", product);
                        return <Product key={product.id} data={product} />;
                    })}
            </div>
        </div>
    );
}

export default Home;