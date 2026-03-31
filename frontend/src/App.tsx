// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Influencers from "./pages/Influencers";
import Campaigns from "./pages/Campaigns";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./context/AuthContext";
import './index.css';

function PrivateLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/influencers" element={<Influencers />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* Fallbacks for undefined routes to Dashboard for now */}
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
