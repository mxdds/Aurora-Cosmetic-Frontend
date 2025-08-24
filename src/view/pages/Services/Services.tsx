export function Services() {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 p-6">
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-lg border border-pink-200 p-8">
                <h1 className="text-4xl font-bold text-pink-600 mb-6">Our Services</h1>
                <p className="text-lg text-gray-700 mb-6">
                    At Aurora Cosmetics, we offer a wide range of services to enhance your beauty experience.
                </p>
                <ul className="space-y-3 text-lg text-gray-700 mb-6">
                    <li className="flex items-center justify-center">
                        <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mr-3"></span>
                        Home Delivery
                    </li>
                    <li className="flex items-center justify-center">
                        <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mr-3"></span>
                        Online Shopping
                    </li>
                    <li className="flex items-center justify-center">
                        <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mr-3"></span>
                        Beauty Consultation
                    </li>
                    <li className="flex items-center justify-center">
                        <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mr-3"></span>
                        Customer Support
                    </li>
                </ul>
                <p className="text-lg text-purple-600 font-medium">
                    We are dedicated to providing you with the best beauty service possible.
                </p>
            </div>
        </div>
    );
}