import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { backendApi } from "../../../api.ts";
import {getUserFromToken} from "../../../auth/auth.ts";
import type {UserData} from "../../../model/UserData.ts";
import {fetchCart} from "../../../slices/cartSlice.ts";
import { useDispatch } from "react-redux";
type FormData = {
    username: string;
    password: string;
};

export function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<FormData>();
    const dispatch = useDispatch();

    const authenticateUser = async (data: FormData) => {
        try {
            const userCredentials = {
                username: data.username,  // assuming your backend uses "username" for email
                password: data.password
            };

            const response = await backendApi.post('/auth/login', userCredentials);
            console.log("Login response:", response.data);
            const user: UserData = getUserFromToken(response.data.accessToken);

            // Check if the user's status is inactive
            if (user.status === "inactive") {
                alert("You can't log in. Admin has restricted your account.");
                return; // Stop further execution
            }

            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;

            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);



            localStorage.setItem('username', user.username as string);
            localStorage.setItem('role', user.role as string);
            localStorage.setItem('userId', user.userId as string);
            localStorage.setItem('image', response.data.user.image as string);
            localStorage.setItem('email', user.email as string);
            localStorage.setItem('status', user.status || 'active'); // Default to 'active' if status is not set


            // Dispatch fetchCart to load cart details
            dispatch(fetchCart(user.userId));

            alert("Successfully logged in!");
            if (user.role === 'customer') {
                navigate('/');
            } else if (user.role === 'admin') {
                navigate('/admin-panel')
            }
        } catch (error) {
            console.error(error);
            alert("You can't log in. Admin has restricted your account.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
            <div className="w-full max-w-md bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-lg p-8 border border-pink-200">
                <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
                    Sign In
                </h2>
                <div className="mt-1 mb-4">
                    <button onClick={() => navigate("/")}
                            className="text-sm text-pink-600 hover:text-pink-800 underline">
                        Go Back
                    </button>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit(authenticateUser)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="text"
                            id="username"
                            {...register("username")}
                            className="mt-1 block w-full px-4 py-2 border border-pink-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
                            placeholder="username"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password")}
                            className="mt-1 block w-full px-4 py-2 border border-pink-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium text-lg rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                        Sign In
                    </button>
                    <div className="text-m text-center text-pink-600">
                        <p>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="w-full py-2 px-4 bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium text-lg rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => navigate("/sendOtp")}
                            className="w-full py-2 px-4 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium text-lg rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}