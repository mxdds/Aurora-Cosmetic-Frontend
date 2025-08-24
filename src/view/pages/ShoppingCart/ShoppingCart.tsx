import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { RootState, AppDispatch } from "../../../store/store";
import { addPayment } from "../../../slices/paymentSlice";
import {
    clearCart,
    fetchCart,
    removeFromCart,
    saveCart,
    updateItemQuantity,
    increaseQuantity,
    decreaseQuantity,
    updateCartItem
} from "../../../slices/cartSlice";
import { getUserFromToken, isTokenExpired } from "../../../auth/auth.ts";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51R6ZgFKiBxldEfFS2fX0YC3riyZE1M5C8oFqG239MAcBiLl6TqyoKtzPsqiiXEV5ilYkqRYHvn8hnvqY5EdNfR8L00weOUntYV");


const CheckoutForm = ({ totalAmount }: { totalAmount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error("Stripe or Elements is not available.");
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) {
            console.error("CardNumberElement is not available.");
            return;
        }

        try {
            const authToken = localStorage.getItem("token");

            if (!authToken || isTokenExpired(authToken)) {
                alert("You must be logged in to make a payment.");
                return;
            }

            const userData = getUserFromToken(authToken);
            const userId = userData.userId;
            const email = userData.email;

            if (!userId) {
                alert("Unable to retrieve user information.");
                return;
            }

            const paymentData = {
                amount: totalAmount,
                currency: "LKR",
                paymentMethod: "card",
                status: "PENDING",
                userId,
                createdAt: new Date(),
                email,
            };

            const result = await dispatch(addPayment(paymentData)).unwrap();

            const { paymentIntent, error } = await stripe.confirmCardPayment(result.clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                },
            });

            if (error) {
                alert("Payment failed!");
            } else if (paymentIntent?.status === "succeeded") {
                const transactionId = paymentIntent.id;
                const paymentId = paymentIntent.charges?.data[0]?.id;

                const updatedPaymentData = {
                    ...paymentData,
                    status: "COMPLETED",
                    transactionId,
                    paymentId,
                };

                await dispatch(addPayment(updatedPaymentData));

                alert("Payment successful!");
                dispatch({ type: "cart/clearCart" });
                navigate("/");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error during payment process:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-screen-xl mx-auto p-6 bg-gradient-to-br from-white to-pink-50 shadow-lg rounded-lg border border-pink-200">
            <div className="w-100">
                <label className="block text-sm font-medium mb-1 text-gray-700">Card Number</label>
                <CardNumberElement
                    options={{
                        style: {
                            base: {
                                fontSize: "18px",
                                color: "#9d174d",
                                letterSpacing: "0.025em",
                                fontFamily: "Arial, sans-serif",
                                "::placeholder": {
                                    color: "#f9a8d4",
                                },
                            },
                            invalid: {
                                color: "#be185d",
                            },
                        },
                    }}
                    className="border border-pink-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-pink-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Expiry Date</label>
                <CardExpiryElement
                    options={{
                        style: {
                            base: {
                                fontSize: "18px",
                                color: "#9d174d",
                                letterSpacing: "0.025em",
                                fontFamily: "Arial, sans-serif",
                                "::placeholder": {
                                    color: "#f9a8d4",
                                },
                            },
                            invalid: {
                                color: "#be185d",
                            },
                        },
                    }}
                    className="border border-pink-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-pink-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">CVC</label>
                <CardCvcElement
                    options={{
                        style: {
                            base: {
                                fontSize: "18px",
                                color: "#9d174d",
                                letterSpacing: "0.025em",
                                fontFamily: "Arial, sans-serif",
                                "::placeholder": {
                                    color: "#f9a8d4",
                                },
                            },
                            invalid: {
                                color: "#be185d",
                            },
                        },
                    }}
                    className="border border-pink-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-pink-500"
                />
            </div>
            <button
                type="submit"
                disabled={!stripe || !elements}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-pink-300 disabled:to-purple-300 text-white px-8 py-4 rounded-lg w-full text-lg font-medium transition-all"
            >
                Pay Now
            </button>
        </form>
    );
};

export function ShoppingCart() {
    const { items } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const authToken = localStorage.getItem("token");
        if (authToken) {
            const userData = getUserFromToken(authToken);
            const userId = userData.userId;
            console.log("Fetching cart for user:", userId, "with token:", authToken, "userData:", userData);
            dispatch(fetchCart(userId));
            console.log("Cart fetched successfully for user:", userId);
        }
    }, [dispatch]);



    const totalAmount = items.reduce(
        (total, item) => total + item.product.price * item.itemCount,
        0
    );

    const handleRemoveItem = async (productId: string) => {
        const authToken = localStorage.getItem("token");
        if (!authToken) {
            console.error("Auth token is missing.");
            return;
        }

        const userData = getUserFromToken(authToken);
        const userId = userData?.userId;

        if (!userId || !productId) {
            console.error("User ID or Product ID is undefined.");
            return;
        }

        // Dispatch the removeFromCart action
        await dispatch(removeFromCart({ userId, productId }));

        // Fetch the updated cart
        dispatch(fetchCart(userId));
    };

    const handleUpdateQuantity = (productId: string,newQuantity:number) => {
       if (newQuantity < 0) {
          dispatch(removeFromCart(productId));
       }
    };
    return (
        <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Shopping Cart</h1>
            <table className="min-w-full border-collapse mb-4 bg-gradient-to-br from-white to-pink-50 shadow-lg rounded-lg overflow-hidden border border-pink-200">
                <thead>
                <tr className="border-b bg-gradient-to-r from-pink-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left text-lg font-bold">Name</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Unit Price</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Quantity</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Total Price</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => {
                    if (!item || !item.product) {
                        console.error("Invalid item:", item);
                        return null;
                    }
                    return (
                        <tr key={item.product.id} className="border-b border-pink-100 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-colors">
                            <td className="px-6 py-4 text-gray-800 font-medium">{item.product.name}</td>
                            <td className="px-6 py-4 text-gray-700">
                                {item.product.price} {item.product.currency}
                            </td>
                            <td className="px-6 py-4 flex items-center space-x-3">
                                <button
                                    onClick={async () => {
                                        const newQuantity = item.itemCount - 1;
                                        if (newQuantity >= 0) {
                                            const authToken = localStorage.getItem("token");
                                            if (authToken) {
                                                const userData = getUserFromToken(authToken);
                                                const userId = userData.userId;

                                                await dispatch(updateCartItem({
                                                    userId,
                                                    productId: item.product.id,
                                                    quantity: newQuantity,
                                                }));
                                                await dispatch(fetchCart(userId));
                                            }
                                        }
                                    }}
                                    className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full flex items-center justify-center font-bold transition-all"
                                >
                                    -
                                </button>
                                <span className="mx-3 text-gray-700 font-medium min-w-[2rem] text-center">{item.itemCount}</span>
                                <button
                                    onClick={async () => {
                                        const newQuantity = item.itemCount + 1;
                                        const authToken = localStorage.getItem("token");
                                        if (authToken) {
                                            const userData = getUserFromToken(authToken);
                                            const userId = userData.userId;

                                            await dispatch(updateCartItem({
                                                userId,
                                                productId: item.product.id,
                                                quantity: newQuantity,
                                            }));
                                            await dispatch(fetchCart(userId));
                                        }
                                    }}
                                    className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full flex items-center justify-center font-bold transition-all"
                                >
                                    +
                                </button>
                            </td>
                            <td className="px-6 py-4 text-gray-700 font-medium">
                                {(item.product.price * item.itemCount).toFixed(2)} {item.product.currency}
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => handleRemoveItem(item.product.id)}
                                    className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-full flex items-center justify-center transition-all"
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-white to-pink-50 p-6 rounded-lg border border-pink-200 shadow-md">
                <h2 className="text-xl font-bold text-purple-600 mb-4 sm:mb-0">
                    Total Amount: <span className="text-pink-600">{totalAmount.toFixed(2)} {items[0]?.product.currency}</span>
                </h2>
                <Elements stripe={stripePromise}>
                    <CheckoutForm totalAmount={totalAmount}/>
                </Elements>
            </div>
        </div>
    );
}