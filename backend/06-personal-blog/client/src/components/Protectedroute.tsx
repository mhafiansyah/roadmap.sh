import { Navigate, Outlet } from "react-router";
import { authClient } from "../services/auth-client"

export const ProtectedRoute = () => {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading session...</p>
            </div>
        );
    }

    return session ? (
        <Outlet />
    ) : (
        <Navigate to="/login" replace />
    )
}
