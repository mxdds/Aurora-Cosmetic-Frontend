import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../slices/orderSlice";
import type { RootState } from "../../../store/store.ts";

export function OrderList() {
    const dispatch = useDispatch();
    const { orders, status } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-pink-600 mb-6">Order Management</h1>
                {status === "loading" ? (
                    <div className="flex justify-center items-center py-8">
                        <p className="text-purple-600 font-medium text-lg">Loading orders...</p>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-lg border border-pink-200 overflow-hidden">
                        <table className="min-w-full">
                            <thead>
                            <tr className="bg-gradient-to-r from-pink-400 via-purple-500 to-rose-600">
                                <th className="px-6 py-4 text-white font-semibold text-left">Order ID</th>
                                <th className="px-6 py-4 text-white font-semibold text-left">Customer ID</th>
                                <th className="px-6 py-4 text-white font-semibold text-left">Total</th>
                                <th className="px-6 py-4 text-white font-semibold text-left">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-pink-200 hover:bg-pink-25 transition-all">
                                    <td className="px-6 py-4 text-pink-600 font-medium">{order.id}</td>
                                    <td className="px-6 py-4 text-gray-700">{order.customerId}</td>
                                    <td className="px-6 py-4 text-purple-600 font-semibold">{order.total}</td>
                                    <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700">
                                        {order.status}
                                    </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}