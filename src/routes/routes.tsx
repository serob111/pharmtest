import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { DashboardProvider, useDashboard } from "../context/DashboardProvider";
import { UsersProvider, useUsers } from "../context/UsersProvider";
import { MedsProvider } from "../context/MedDirProvider";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import SignIn from "../pages/sign-in/SignIn";
import Users from "../pages/users/Users";
import UserPage from "../pages/users/UserPage";
import CreateUser from "../pages/users/create-user/CreateUser";
import MedicationDirectory from "../pages/medication-directory/MedicationDirectory";
import AccountSettings from "../pages/accountsettings/AccountSettings";

import Spinner from "../components/shared/ui/Spinner";
import Devices from "../pages/devices/Devices";
import { DeviceProvider } from "../context/DeviceProvider";
import CreateDevice from "../pages/devices/create-device/CreateDevice";
import EditDevice from "../pages/devices/edit-device/EditDevice";
import { PrescriptionProvider } from "../context/PrescriptionProvider";
import Prescriptions from "../pages/prescriptions/Prescriptions";
import PrescriptionDetail from "../pages/prescriptions/PrescriptionDetail";
import { OrderProvider } from "../context/OrdersProvider";
import Orders from "../pages/orders/Orders";
import OrderDetail from "../pages/orders/OrderDetail";

const PrivateRoutesWrapper = () => {
    return (
        <DashboardProvider>
            <PrivateRoutesContent />
        </DashboardProvider>
    );
};

const PrivateRoutesContent = () => {
    const { loading } = useDashboard();
    return (
        <DashboardLayout>
            {loading ? <Spinner /> : <Outlet />}
        </DashboardLayout>
    );
};


const RootRedirect = () => {
    const auth = useAuth();
    return <Navigate to={auth ? "/users" : "/sign-in"} replace />;
};

const UsersPage = () => {
    const { profile } = useDashboard();
    const isSuperAdmin = profile.clinic_role === "Super admin";
    const { selectedProfile } = useUsers();
    return isSuperAdmin && selectedProfile?.email ? <UserPage /> : <Users />;
};

const SuperAdminRoute = ({ children }: { children: JSX.Element }) => {
    const { profile } = useDashboard();
    return profile.clinic_role === "Super admin" ? children : <Navigate to="/users" replace />;
};

export const Routes = () => {
    const auth = useAuth();
    const isAuth = Boolean(auth);

    const router = createBrowserRouter([
        { path: "/", element: <RootRedirect /> },
        {
            path: "/sign-in",
            element: (
                <AuthLayout>
                    <SignIn />
                </AuthLayout>
            ),
        },
        ...(isAuth
            ? [
                {
                    path: "/",
                    element: <PrivateRoutesWrapper />,
                    children: [
                        {
                            path: "users",
                            element:
                                <UsersProvider>
                                    <Outlet />
                                </UsersProvider>,
                            children: [
                                {
                                    index: true,
                                    element: <UsersPage />
                                },
                                {
                                    path: "creating/new",
                                    element:
                                        <SuperAdminRoute>
                                            <CreateUser />
                                        </SuperAdminRoute>
                                },
                            ],
                        },
                        {
                            path: "accountsettings",
                            element: <AccountSettings />
                        },
                        {
                            path: "medicationdirectory",
                            element:
                                <MedsProvider>
                                    <MedicationDirectory />
                                </MedsProvider>
                        },
                        {
                            path: "devices",
                            element:
                                <DeviceProvider>
                                    <Outlet />
                                </DeviceProvider>,
                            children: [
                                {
                                    index: true,
                                    element: <Devices />
                                },
                                {
                                    path: "adding/new",
                                    element:
                                        <SuperAdminRoute>
                                            <CreateDevice />
                                        </SuperAdminRoute>
                                },
                                {
                                    path: "editing",
                                    element: <EditDevice />
                                },
                            ],
                        },
                        {
                            path: "prescriptions",
                            element:
                                <PrescriptionProvider>
                                    <Outlet />
                                </PrescriptionProvider>,
                            children: [
                                {
                                    index: true,
                                    element: <Prescriptions />
                                },
                                {
                                    path: "/prescriptions/:id",
                                    element: <PrescriptionDetail />
                                }
                            ],
                        },
                        {
                            path: "orders",
                            element:
                                <OrderProvider>
                                    <Outlet />
                                </OrderProvider>,
                            children: [
                                {
                                    index: true,
                                    element: <Orders />
                                },
                                {
                                    path: "/orders/:id",
                                    element: <OrderDetail />
                                }
                            ],
                        },
                    ],
                },
            ]
            : []),
        { path: "*", element: <Navigate to={isAuth ? "/users" : "/sign-in"} replace /> },
    ]);

    return <RouterProvider router={router} />;
};
