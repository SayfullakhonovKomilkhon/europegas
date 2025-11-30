import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SupabaseAuthProvider } from './context/SupabaseAuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { prefetchProducts } from './lib/productCache';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageTransition from './components/layout/PageTransition';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
// import CartPage from './pages/CartPage';
// import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BranchesPage from './pages/BranchesPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/auth/PrivateRoute';

// Admin imports
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProductsPage from './pages/admin/ProductsPage';
import ProductsManagement from './pages/admin/ProductsManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import MessagesPage from './pages/admin/MessagesPage';

// Layout wrapper for public pages
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageTransition>
        <main className="flex-grow pb-16">
          {children}
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  // Prefetch products on app load for faster navigation
  useEffect(() => {
    prefetchProducts();
  }, []);

  return (
    <LanguageProvider>
      <SupabaseAuthProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Admin Login (no header/footer) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Admin Panel Routes (with AdminLayout) */}
              <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsManagement />} />
              <Route path="categories" element={<CategoriesManagement />} />
              <Route path="branches" element={<div className="p-8">Branches Page (Coming Soon)</div>} />
              <Route path="orders" element={<div className="p-8">Orders Page (Coming Soon)</div>} />
              <Route path="testimonials" element={<div className="p-8">Testimonials Page (Coming Soon)</div>} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="users" element={<div className="p-8">Users Page (Coming Soon)</div>} />
            </Route>

            {/* Public Routes (with header/footer) */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
            <Route path="/products/:category" element={<PublicLayout><ProductsPage /></PublicLayout>} />
            <Route path="/product/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            {/* <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} /> */}
            <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
            <Route path="/branches" element={<PublicLayout><BranchesPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />

                        {/* Protected Routes */}
                        {/* <Route
                          path="/checkout"
                          element={
                <PublicLayout>
                            <PrivateRoute>
                              <CheckoutPage />
                            </PrivateRoute>
                </PublicLayout>
                          }
                        /> */}
                        <Route
                          path="/profile"
                          element={
                <PublicLayout>
                            <PrivateRoute>
                              <ProfilePage />
                            </PrivateRoute>
                </PublicLayout>
                          }
                        />

                        {/* 404 Route */}
              <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </SupabaseAuthProvider>
    </LanguageProvider>
  );
};

export default App;
