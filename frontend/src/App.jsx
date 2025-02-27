import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedPage from "./components/ProtectedPage";
import Main from "./components/Main";
import Header from "./components/Header";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateReservation from "./pages/CreateReservation";
import AdminReservations from "./pages/AdminReservations";
import UpdateReservationStatus from "./pages/UpdateReservationStatus";
import UserReservations from "./pages/UserReservations";
import CancelReservation from "./pages/CancelReservation";
import ErrorPopup from "./components/ErrorPopup";
import {ErrorBoundary} from "react-error-boundary";
import { useState } from "react";

const protectedElement = (Component) => (
  <ProtectedPage>
    <Header />
    <Main>
      <Component />
    </Main>
  </ProtectedPage>
);

const router = createBrowserRouter([
  { path: "/", element: <Main><Login /></Main> },
  { path: "/register", element: <Main><Register /></Main> },
  { path: "/home", element: protectedElement(Home) },
  { path: "/reservations/create", element: protectedElement(CreateReservation) },
  { path: "/admin/reservations", element: protectedElement(AdminReservations) },
  { path: "/admin/reservations/:id/status", element: protectedElement(UpdateReservationStatus) },
  { path: "/user/reservations", element: protectedElement(UserReservations) },
  { path: "/user/reservations/:id/cancel", element: protectedElement(CancelReservation) }
]);

const App = () => {
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleError = (error) => {
    setError(error);
    setShowError(true);
  };
  const handleCloseError = () => {
    setShowError(false);
  };
  return (
    <div>
      {showError && (
        <ErrorPopup error={error} onClose={handleCloseError} />
      )}
      <ErrorBoundary FallbackComponent={() => null} onError={handleError}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
