import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Providers from "./pages/Providers";
import Bookings from "./pages/Bookings";
import Reviews from "./pages/Reviews";
import Blogs from "./pages/Blogs";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
          <Route element={<ProtectedRoute><AdminLayout/></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/users" element={<Users/>}/>
            <Route path="/providers" element={<Providers/>}/>
            <Route path="/bookings" element={<Bookings/>}/>
            <Route path="/reviews" element={<Reviews/>}/>
            <Route path="/blogs" element={<Blogs/>}/>
            <Route path="/reports" element={<Reports/>}/>
            <Route path="/analytics" element={<Analytics/>}/>
            <Route path="/settings" element={<Settings/>}/>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
