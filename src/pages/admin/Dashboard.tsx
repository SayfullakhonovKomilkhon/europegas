import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaUsers, FaShoppingCart, FaStore, FaChartBar, FaCog, FaSignOutAlt, FaUpload } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import UploadProducts from './UploadProducts';

// Placeholder components for admin sections
const Overview: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-100 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800">Total Orders</h3>
        <p className="text-2xl font-bold">128</p>
      </div>
      <div className="bg-green-100 p-4 rounded-lg">
        <h3 className="font-medium text-green-800">Revenue</h3>
        <p className="text-2xl font-bold">$12,846</p>
      </div>
      <div className="bg-yellow-100 p-4 rounded-lg">
        <h3 className="font-medium text-yellow-800">Products</h3>
        <p className="text-2xl font-bold">64</p>
      </div>
      <div className="bg-purple-100 p-4 rounded-lg">
        <h3 className="font-medium text-purple-800">Customers</h3>
        <p className="text-2xl font-bold">256</p>
      </div>
    </div>
    <div className="mb-6">
      <h3 className="font-medium mb-2">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Customer</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">#ORD-001</td>
              <td className="py-2 px-4">John Doe</td>
              <td className="py-2 px-4">2023-05-15</td>
              <td className="py-2 px-4">$120.00</td>
              <td className="py-2 px-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Completed</span></td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">#ORD-002</td>
              <td className="py-2 px-4">Jane Smith</td>
              <td className="py-2 px-4">2023-05-14</td>
              <td className="py-2 px-4">$85.50</td>
              <td className="py-2 px-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Processing</span></td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">#ORD-003</td>
              <td className="py-2 px-4">Robert Johnson</td>
              <td className="py-2 px-4">2023-05-13</td>
              <td className="py-2 px-4">$210.75</td>
              <td className="py-2 px-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Shipped</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const Products: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Products Management</h2>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">Add New Product</button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Product Name</th>
            <th className="py-2 px-4 text-left">Category</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">Stock</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-4">P001</td>
            <td className="py-2 px-4">Gas Reducer BRC</td>
            <td className="py-2 px-4">Gas Equipment</td>
            <td className="py-2 px-4">$120.00</td>
            <td className="py-2 px-4">24</td>
            <td className="py-2 px-4">
              <button className="text-blue-600 mr-2">Edit</button>
              <button className="text-red-600">Delete</button>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4">P002</td>
            <td className="py-2 px-4">ECU Controller</td>
            <td className="py-2 px-4">Electronics</td>
            <td className="py-2 px-4">$85.50</td>
            <td className="py-2 px-4">18</td>
            <td className="py-2 px-4">
              <button className="text-blue-600 mr-2">Edit</button>
              <button className="text-red-600">Delete</button>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4">P003</td>
            <td className="py-2 px-4">Rail Injector Set</td>
            <td className="py-2 px-4">Rail Equipment</td>
            <td className="py-2 px-4">$210.75</td>
            <td className="py-2 px-4">12</td>
            <td className="py-2 px-4">
              <button className="text-blue-600 mr-2">Edit</button>
              <button className="text-red-600">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const Orders: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-6">Orders Management</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Order ID</th>
            <th className="py-2 px-4 text-left">Customer</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Total</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-4">#ORD-001</td>
            <td className="py-2 px-4">John Doe</td>
            <td className="py-2 px-4">2023-05-15</td>
            <td className="py-2 px-4">$120.00</td>
            <td className="py-2 px-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Completed</span></td>
            <td className="py-2 px-4">
              <button className="text-blue-600 mr-2">View</button>
              <button className="text-gray-600">Print</button>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4">#ORD-002</td>
            <td className="py-2 px-4">Jane Smith</td>
            <td className="py-2 px-4">2023-05-14</td>
            <td className="py-2 px-4">$85.50</td>
            <td className="py-2 px-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Processing</span></td>
            <td className="py-2 px-4">
              <button className="text-blue-600 mr-2">View</button>
              <button className="text-gray-600">Print</button>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4">#ORD-003</td>
            <td className="py-2 px-4">Robert Johnson</td>
            <td className="py-2 px-4">2023-05-13</td>
            <td className="py-2 px-4">$210.75</td>
            <td className="py-2 px-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Shipped</span></td>
            <td className="py-2 px-4">
              <button className="text-blue-600 mr-2">View</button>
              <button className="text-gray-600">Print</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const Customers: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-6">Customers Management</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Orders</th>
            <th className="py-2 px-4 text-left">Total Spent</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-4">C001</td>
            <td className="py-2 px-4">John Doe</td>
            <td className="py-2 px-4">john@example.com</td>
            <td className="py-2 px-4">5</td>
            <td className="py-2 px-4">$520.00</td>
            <td className="py-2 px-4">
              <button className="text-blue-600 mr-2">View</button>
              <button className="text-red-600">Delete</button>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4">C002</td>
            <td className="py-2 px-4">Jane Smith</td>
            <td className="py-2 px-4">jane@example.com</td>
            <td className="py-2 px-4">3</td>
            <td className="py-2 px-4">$285.50</td>
            <td className="py-2 px-4">
              <button className="text-blue-600 mr-2">View</button>
              <button className="text-red-600">Delete</button>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4">C003</td>
            <td className="py-2 px-4">Robert Johnson</td>
            <td className="py-2 px-4">robert@example.com</td>
            <td className="py-2 px-4">2</td>
            <td className="py-2 px-4">$410.75</td>
            <td className="py-2 px-4">
              <button className="text-blue-600 mr-2">View</button>
              <button className="text-red-600">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const Settings: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-6">Admin Settings</h2>
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">General Settings</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="EuropeGAS & Rail Group Uzbekistan" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input type="email" className="w-full p-2 border rounded" defaultValue="info@europegas.uz" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="+998 71 123 4567" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-3">Payment Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input type="checkbox" id="payment-cash" className="mr-2" defaultChecked />
            <label htmlFor="payment-cash">Cash on Delivery</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="payment-card" className="mr-2" defaultChecked />
            <label htmlFor="payment-card">Credit/Debit Card</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="payment-bank" className="mr-2" defaultChecked />
            <label htmlFor="payment-bank">Bank Transfer</label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-3">Email Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input type="checkbox" id="notify-orders" className="mr-2" defaultChecked />
            <label htmlFor="notify-orders">New Orders</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="notify-customers" className="mr-2" defaultChecked />
            <label htmlFor="notify-customers">New Customer Registrations</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="notify-stock" className="mr-2" defaultChecked />
            <label htmlFor="notify-stock">Low Stock Alerts</label>
          </div>
        </div>
      </div>
      
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Save Settings</button>
    </div>
  </div>
);

// Add this new component for the Tools section
const Tools: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-6">Admin Tools</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">Product Management</h3>
        <p className="text-gray-600 mb-4">Tools for managing product data</p>
        <Link 
          to="/admin/upload-products" 
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Upload Products
        </Link>
      </div>
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">Database Backup</h3>
        <p className="text-gray-600 mb-4">Tools for backing up your data</p>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Backup Database
        </button>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-1 py-4">
            <li>
              <Link
                to="/admin"
                className={`flex items-center px-4 py-3 hover:bg-gray-700 ${
                  isActive('/admin') && !isActive('/admin/products') && !isActive('/admin/orders') && 
                  !isActive('/admin/customers') && !isActive('/admin/settings') && !isActive('/admin/tools') && 
                  !isActive('/admin/upload-products') ? 'bg-gray-700' : ''
                }`}
              >
                <FaHome className="mr-3" />
                <span>Overview</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className={`flex items-center px-4 py-3 hover:bg-gray-700 ${
                  isActive('/admin/products') ? 'bg-gray-700' : ''
                }`}
              >
                <FaBox className="mr-3" />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className={`flex items-center px-4 py-3 hover:bg-gray-700 ${
                  isActive('/admin/orders') ? 'bg-gray-700' : ''
                }`}
              >
                <FaShoppingCart className="mr-3" />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/customers"
                className={`flex items-center px-4 py-3 hover:bg-gray-700 ${
                  isActive('/admin/customers') ? 'bg-gray-700' : ''
                }`}
              >
                <FaUsers className="mr-3" />
                <span>Customers</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/tools"
                className={`flex items-center px-4 py-3 hover:bg-gray-700 ${
                  isActive('/admin/tools') || isActive('/admin/upload-products') ? 'bg-gray-700' : ''
                }`}
              >
                <FaUpload className="mr-3" />
                <span>Tools</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className={`flex items-center px-4 py-3 hover:bg-gray-700 ${
                  isActive('/admin/settings') ? 'bg-gray-700' : ''
                }`}
              >
                <FaCog className="mr-3" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleSignOut}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/upload-products" element={<UploadProducts />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard; 