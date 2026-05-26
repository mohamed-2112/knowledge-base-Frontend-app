import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../security/useAuth";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p className="text-center mt-5">Checking authentication...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}