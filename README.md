# Aurora Cosmetic Frontend

A modern e-commerce web application for cosmetics and beauty products built with React, TypeScript, and Tailwind CSS. The application features a beautiful aurora-themed UI with gradient designs and comprehensive e-commerce functionality.

## 🌟 Features

### Customer Features
- **Product Catalog**: Browse and filter products by category, name, and price range
- **Shopping Cart**: Add, remove, and modify product quantities
- **User Authentication**: Secure login/registration with JWT tokens
- **Account Management**: Update profile information and password
- **Secure Payments**: Integrated Stripe payment processing
- **Password Recovery**: OTP-based password reset functionality
- **Responsive Design**: Beautiful aurora-themed UI with gradient backgrounds

### Admin Features
- **Product Management**: Add, update, and delete products
- **Category Management**: Manage product categories
- **User Management**: View and manage user accounts (activate/deactivate)
- **Payment Tracking**: Monitor payment transactions
- **Order Management**: Track customer orders
- **Admin Dashboard**: Centralized control panel

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom aurora theme
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Payment Processing**: Stripe
- **HTTP Client**: Axios
- **Authentication**: JWT tokens
- **Build Tool**: Vite
- **Icons**: React Icons

## 📁 Project Structure

```
src/
├── assets/           # Static assets (images, logos)
├── auth/            # Authentication utilities and components
├── components/      # Reusable UI components
├── model/          # TypeScript type definitions
├── slices/         # Redux slices for state management
├── store/          # Redux store configuration
├── types/          # TypeScript type declarations
└── view/           # React components and pages
    ├── common/     # Shared components (Navbar, Footer, etc.)
    └── pages/      # Application pages
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aurora-cosmetic-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=your_backend_api_url
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 UI Theme

The application features a beautiful aurora-inspired design with:
- **Gradient Backgrounds**: `from-green-400 via-blue-500 to-purple-600`
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Components**: Cards, buttons, and forms with aurora styling
- **Smooth Transitions**: Hover effects and animations
- **Consistent Color Scheme**: Pink, purple, and green gradients throughout

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS 4 with custom aurora theme configurations. Main styling features:
- Custom gradient backgrounds
- Responsive design utilities
- Modern component styling
- Consistent spacing and typography

### Redux Store
State management is handled by Redux Toolkit with separate slices for:
- `cartSlice`: Shopping cart functionality
- `userSlice`: User authentication and profile
- `productSlice`: Product catalog management
- `categorySlice`: Category management
- `paymentSlice`: Payment processing
- `orderSlice`: Order management
- `contactSlice`: Contact form handling

## 🔐 Authentication

The application uses JWT-based authentication with:
- Secure login/registration
- Token storage in localStorage
- Protected routes for admin functionality
- Role-based access control (customer/admin)
- Password reset with OTP verification

## 💳 Payment Integration

Stripe integration provides:
- Secure payment processing
- Card number, expiry, and CVC validation
- Real-time payment status updates
- Payment history tracking

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Tablet and desktop optimizations
- Flexible grid layouts
- Touch-friendly interactions

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy to your hosting platform**
   - Upload the `dist` folder to your web server
   - Configure environment variables on your hosting platform
   - Ensure your backend API is accessible

## 🔄 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Backend API server (for full functionality)
- Stripe account (for payment processing)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Logo/Image Import Errors**
   - Ensure all image assets are in the `src/assets` directory
   - Check file paths in import statements

2. **Authentication Issues**
   - Verify JWT token format and expiration
   - Check API endpoint configurations

3. **Payment Processing**
   - Verify Stripe publishable key in environment variables
   - Ensure backend payment endpoints are configured

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check TypeScript configuration

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Aurora Cosmetic Frontend-** - Built with ❤️ using React and modern web technologies
