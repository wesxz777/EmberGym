import { RouterProvider } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext'; // 🔥 ADDED THIS BACK!
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
        <BookingProvider> {/* 🔥 WRAPPED IT HERE! */}
          <RouterProvider router={router} />
        </BookingProvider>
    </AuthProvider>
  );
}