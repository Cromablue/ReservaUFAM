import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedPage from "./components/ProtectedPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateReservation from "./pages/CreateReservation";
import AdminReservations from "./pages/AdminReservations";
import UpdateReservationStatus from "./pages/UpdateReservationStatus";
import UserReservations from "./pages/UserReservations";
import CancelReservation from "./pages/CancelReservation";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/home", element: <ProtectedPage><Home /></ProtectedPage> },
  { path: "/reservations/create", element: <ProtectedPage><CreateReservation /></ProtectedPage> },
  { path: "/admin/reservations", element: <ProtectedPage><AdminReservations /></ProtectedPage> },
  { path: "/admin/reservations/:id/status", element: <ProtectedPage><UpdateReservationStatus /></ProtectedPage> },
  { path: "/user/reservations", element: <ProtectedPage><UserReservations /></ProtectedPage> },
  { path: "/user/reservations/:id/cancel", element: <ProtectedPage><CancelReservation /></ProtectedPage> }
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
