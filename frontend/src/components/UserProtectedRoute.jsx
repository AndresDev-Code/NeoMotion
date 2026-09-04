import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UserProtectedRoute() {

    const {
        isAuthenticated,
        loading
    } = useAuth();


    if (loading) {

        return (
            <p>
                Cargando...
            </p>
        );
    }


    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return <Outlet />;
}

export default UserProtectedRoute;