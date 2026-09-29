import { Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Manage from "./pages/Manage";
import ManagePortfolio from "./pages/ManagePortfolio";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyOTP from "./pages/auth/VerifyOTP";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/PrivateRoute";

function App() {
    return (
        <Routes>
            {/* Routes with Header & Footer */}
            <Route element={<Layout />}>
                <Route index element={<Dashboard />} />

                {/* Public Routes */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/manage" element={<Manage />} />
                    <Route
                        path="/manage/:portfolioId"
                        element={<ManagePortfolio />}
                    />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/analytics" element={<Analytics />} />
                </Route>
            </Route>

            {/* Routes without Layout */}
            {/* <Route path="/login" element={<Login />} /> */}

            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    );
}

export default App;