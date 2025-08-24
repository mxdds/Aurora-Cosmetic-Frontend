import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordWithOtp } from "../../../slices/userSlice.ts";

type FormData = {
    otp: string;
    newPassword: string;
};

export function ResetPasswordWithOtp() {
    const { register, handleSubmit } = useForm<FormData>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email"); // Retrieve email from query params

    const onSubmit = async (data: FormData) => {
        try {
            if (!email) {
                alert("Email is missing!");
                return;
            }
            await dispatch(resetPasswordWithOtp({ email, otp: data.otp, newPassword: data.newPassword })).unwrap();
            alert("Password reset successful!");
            navigate("/login");
        } catch (error) {
            console.error(error);
            alert(error || "Error resetting password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 px-4">
            <div className="w-full max-w-sm bg-gradient-to-br from-white to-pink-50 border border-pink-200 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-pink-600 mb-6 text-center">
                    Reset Password
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                            OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            {...register("otp")}
                            className="mt-1 block w-full px-3 py-2 border border-pink-300 rounded-lg text-sm shadow-sm focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Enter the OTP"
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            {...register("newPassword")}
                            className="mt-1 block w-full px-3 py-2 border border-pink-300 rounded-lg text-sm shadow-sm focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Enter your new password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}