import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
import CustomError from "./components/common/CustomError";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { data: authUser, isPending:isLoading } = useQuery({
    //we use queryKey to identify the query uniquely and to invalidate the query when needed
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) throw new Error(data.error || "An error occurred");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return (
    <div className="flex max-w-6xl mx-auto">
      {/*Common component because it doesn't change with the route*/}
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />

        <Route
          path="*"
          element={<CustomError/>} // Add the error page route
        />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;
