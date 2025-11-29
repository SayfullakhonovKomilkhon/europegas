# EuropeGAS & Rail Group Uzbekistan Online Store

A modern e-commerce platform for automotive gas equipment and spare parts, built with React, TypeScript, and Firebase.

## Project Overview

This online store serves as a digital marketplace for EuropeGAS & Rail Group Uzbekistan, allowing customers to browse products, add them to the cart, and place orders. Additionally, it provides information about 12 regional branches across Uzbekistan and includes an admin panel for managing products, orders, and user interactions.

## Features

- **Modern UI/UX Design**: Clean, responsive, and user-friendly interface
- **Product Catalog**: Browse products by categories (ECU Control Units, Rail Injectors, Gas Reducers)
- **Shopping Cart System**: Add products to cart, update quantities, and proceed to checkout
- **User Authentication**: Secure login and registration with Firebase Authentication
- **Admin Panel**: Manage products, orders, customers, and branches
- **Branch Locator**: Find the nearest EuropeGAS branch across Uzbekistan
- **Gas Installation Services**: Information about professional installation services

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Backend & Database**: Firebase (Firestore, Authentication, Storage)
- **Routing**: React Router
- **Icons**: React Icons
- **UI Components**: Custom components with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/europegas-store.git
   cd europegas-store
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. Update the Firebase configuration in `src/firebase/config.ts` with your Firebase project details.

5. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
europegas-store/
├── public/                 # Public assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   ├── products/       # Product-related components
│   │   └── ...
│   ├── context/            # React Context for state management
│   ├── firebase/           # Firebase configuration
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin panel pages
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main App component
│   └── index.tsx           # Entry point
├── .env                    # Environment variables (not in repo)
├── package.json            # Dependencies and scripts
└── tailwind.config.js      # Tailwind CSS configuration
```

## Deployment

1. Build the production-ready app:
   ```
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```
   firebase deploy
   ```

## License

This project is proprietary and owned by EuropeGAS & Rail Group Uzbekistan.

## Contact

For any inquiries, please contact:
- Email: europegaspluz@gmail.com
- Phone: +998 77-250-07-70 