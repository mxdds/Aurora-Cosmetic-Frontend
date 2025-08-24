import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleUserActive } from "../../../slices/userSlice";
import type { RootState } from "../../../slices/rootReducers";

export function Users() {
    const dispatch = useDispatch();
    const { users, status, error } = useSelector((state: RootState) => state.user || { users: [], status: "idle", error: null });

    useEffect(() => {
        dispatch(fetchUsers() as any); // Type assertion to handle AsyncThunkAction
    }, [dispatch]);

    const handleToggleActive = async (userId: string, currentStatus: string) => {
        try {
            const result = await dispatch(toggleUserActive(userId)).unwrap(); // Unwrap the result
            console.log(`User status changed to: ${result.status}`);

            // Update localStorage with the new status
            if (localStorage.getItem("userId") === userId) {
                localStorage.setItem("status", result.status);
            }

            await dispatch(fetchUsers() as any); // Refresh the user list after toggling status
        } catch (error) {
            console.error("Failed to toggle user status:", error); // Handle errors
        }
    };
    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Users</h1>
            {users && users.length > 0 ? (
                <table className="table-auto w-full border-collapse bg-gradient-to-br from-white to-pink-50 shadow-lg rounded-lg overflow-hidden border border-pink-200">
                    <thead>
                    <tr>
                        <th className="border border-pink-200 px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold">Name</th>
                        <th className="border border-pink-200 px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold">Role</th>
                        <th className="border border-pink-200 px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold">Email</th>
                        <th className="border border-pink-200 px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold">Status</th>
                        <th className="border border-pink-200 px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.userId} className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-colors">
                            <td className="border border-pink-200 px-6 py-4 text-gray-800">{user.username}</td>
                            <td className="border border-pink-200 px-6 py-4 text-gray-800">{user.role}</td>
                            <td className="border border-pink-200 px-6 py-4 text-gray-800">{user.email}</td>
                            <td className="border border-pink-200 px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.status === "active" ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white" : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"}`}>
                            {user.status === "active" ? "Active" : "Inactive"}
                        </span>
                            </td>
                            <td className="border border-pink-200 px-6 py-4">
                                <button
                                    onClick={() => handleToggleActive(user.userId, user.status)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        user.status === "active"
                                            ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                                            : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                                    }`}
                                >
                                    {user.status === "active" ? "Deactivate" : "Activate"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No users available.</p>
                </div>
            )}
        </div>
    );
}

export default Users;