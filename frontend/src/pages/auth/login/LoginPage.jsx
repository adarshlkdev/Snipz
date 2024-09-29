import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Footer from "../../../components/common/Footer";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to login");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col h-screen">
      <div className="flex-1 flex lg:flex-row flex-col">
        <div className="flex-1 hidden lg:flex items-center justify-center p-8">
          <XSvg className="lg:w-2/3 fill-white" />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center p-8">
          <form
            className="flex gap-6 flex-col w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <h1 className="text-2xl font-extrabold text-white">
              {"Let's"} go wih{" "}
              <span className="text-4xl font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Snipz
              </span>
            </h1>
            <label className="input input-bordered rounded flex items-center gap-2 p-2">
              <MdOutlineMail />
              <input
                type="text"
                className="grow"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>

            <label className="input input-bordered rounded flex items-center gap-2">
              <MdPassword />
              <input
                type={showPassword ? "text" : "password"}
                className="grow"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
              />
              <div
                className="cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </label>
            <button className="btn rounded-full btn-primary text-white">
              {isPending ? <LoadingSpinner size="md" /> : "Login"}
            </button>
            {isError && <p className="text-red-500">{error.message}</p>}
          </form>
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-white text-lg">{"Don't"} have an account?</p>
            <Link to="/signup">
              <button className="btn rounded-full btn-primary text-white btn-outline w-full">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default LoginPage;
