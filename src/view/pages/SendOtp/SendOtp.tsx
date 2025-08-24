import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { sendOtp } from "../../../slices/userSlice.ts";
import {useNavigate} from "react-router-dom";

type FormData = {
    email: string;
};

export function SendOtp() {
    const { register, handleSubmit } = useForm<FormData>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: FormData) => {
        try {
            await dispatch(sendOtp(data.email)).unwrap();
            alert("OTP sent to your email!");
            // Navigate to ResetPasswordWithOtp page with email as a query parameter
            navigate(`/Reset-password-with-otp?email=${encodeURIComponent(data.email)}`);
        } catch (error) {
            console.error(error);
            alert(error || "Error sending OTP");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 px-4">
            <div className="w-full max-w-sm bg-gradient-to-br from-white to-pink-50 border border-pink-200 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-pink-600 mb-6 text-center">
                    Send OTP
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email")}
                            className="mt-1 block w-full px-3 py-2 border border-pink-300 rounded-lg text-sm shadow-sm focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    >
                        Send OTP
                    </button>
                </form>
            </div>
        </div>
    );
}