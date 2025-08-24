import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPayments } from "../../../slices/paymentSlice";

export function Payments() {
    const dispatch = useDispatch();
    const { list: payments, error } = useSelector((state) => state.payment);

    useEffect(() => {
        dispatch(getAllPayments());
    }, [dispatch]);

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-pink-600 mb-6">Payments</h1>
                {payments && payments.length > 0 ? (
                    <div className="bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-lg border border-pink-200 overflow-hidden">
                        <table className="table-auto w-full border-collapse">
                            <thead>
                            <tr className="bg-gradient-to-r from-pink-400 via-purple-500 to-rose-600">
                                <th className="px-6 py-4 text-white font-semibold text-left">Payment ID</th>
                                <th className="px-6 py-4 text-white font-semibold text-left">Amount</th>
                                <th className="px-6 py-4 text-white font-semibold text-left">Currency</th>
                                <th className="px-6 py-4 text-white font-semibold text-left">Status</th>
                                <th className="px-6 py-4 text-white font-semibold text-left">User Email</th>
                            </tr>
                            </thead>
                            <tbody>
                            {payments.map((payment) => (
                                <tr key={payment._id} className="border-b border-pink-200 hover:bg-pink-25 transition-all">
                                    <td className="px-6 py-4 text-pink-600 font-medium">{payment.paymentId}</td>
                                    <td className="px-6 py-4 text-purple-600 font-semibold">{payment.amount}</td>
                                    <td className="px-6 py-4 text-gray-700">{payment.currency}</td>
                                    <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700">
                                        {payment.status}
                                    </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{payment.userId?.email || "N/A"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-purple-600 font-medium text-lg">No payments available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Payments;