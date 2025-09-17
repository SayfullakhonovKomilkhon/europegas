import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from 'context/AuthContext';
import { CartProvider } from 'context/CartContext';
import { LanguageProvider } from 'context/LanguageContext';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import PageTransition from 'components/layout/PageTransition';
import HomePage from 'pages/HomePage';
import ProductsPage from 'pages/ProductsPage';
import ProductDetailPage from 'pages/ProductDetailPage';
import CartPage from 'pages/CartPage';
import CheckoutPage from 'pages/CheckoutPage';
import LoginPage from 'pages/LoginPage';
import RegisterPage from 'pages/RegisterPage';
import ProfilePage from 'pages/ProfilePage';
import BranchesPage from 'pages/BranchesPage';
import ContactPage from 'pages/ContactPage';
import AboutPage from 'pages/AboutPage';
import ServicesPage from 'pages/ServicesPage';
import NotFoundPage from 'pages/NotFoundPage';
import AdminDashboard from 'pages/admin/Dashboard';
import PrivateRoute from 'components/auth/PrivateRoute';
import AdminRoute from 'components/auth/AdminRoute';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <PageTransition>
              <main className="flex-grow pb-16">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:category" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/branches" element={<BranchesPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/checkout" 
                    element={
                      <PrivateRoute>
                        <CheckoutPage />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    } 
                  />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } 
                  />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </PageTransition>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App; 