import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { BiLeftArrow } from "react-icons/bi";

const CustomError = () => {
  return (
    <div className="flex flex-col w-screen items-center justify-center h-screen">
      <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
      <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
      <p className="text-lg text-gray-700 mt-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="mt-6 text-primary">
        <button className="btn rounded-full btn-primary text-white btn-outline flex items-center justify-center gap-2">
          <BiLeftArrow className="inline" /> Go back
        </button>
      </Link>
    </div>
  );
};

export default CustomError;
