import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { submitContactForm } from "../../../slices/contactSlice.ts";
import type { ContactData } from "../../../model/ContactData.ts";

export function Contact() {
    const { register, handleSubmit, formState: { errors } } = useForm<ContactData>();
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.contact);

    const onSubmit = (data: ContactData) => {
        dispatch(submitContactForm(data));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-lg p-8 border border-pink-200">
                <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">Contact Us</h2>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                        <input
                            type="email"
                            className="w-full p-3 rounded-lg border border-pink-300 shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-all"
                            placeholder="Enter your email address"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        {errors.email && <span className="text-pink-600 text-sm mt-1 block">{errors.email.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject:</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-lg border border-pink-300 shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-all"
                            placeholder="Enter subject"
                            {...register("subject", {
                                required: "Subject is required",
                                minLength: {
                                    value: 5,
                                    message: "Subject must be at least 5 characters long",
                                },
                            })}
                        />
                        {errors.subject && <span className="text-pink-600 text-sm mt-1 block">{errors.subject.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message:</label>
                        <textarea
                            rows={4}
                            className="w-full p-3 rounded-lg border border-pink-300 shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-all resize-none"
                            placeholder="Enter your message"
                            {...register("message", { required: "Message is required" })}
                        />
                        {errors.message && <span className="text-pink-600 text-sm mt-1 block">Message is required</span>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium text-lg px-6 py-3 rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                        Submit
                    </button>
                </form>
                <div className="mt-6 text-center">
                    {status === "loading" && <p className="text-purple-600 font-medium">Submitting...</p>}
                    {status === "success" && <p className="text-green-600 font-medium">Form submitted successfully!</p>}
                    {status === "error" && <p className="text-pink-600 font-medium">Error: {error}</p>}
                </div>
            </div>
        </div>
    );
}