import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../contents/AuthContext";
import ChatModal from "./ChatModal";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <div className="flex items-center justify-between p-4 z-[100] w-full absolute">
      <Link to="/">
        <h1 className="text-yellow-600 text-xl md:text-3xl font-bold cursor-pointer">
          Showmate
        </h1>
      </Link>
      {user?.email ? (
        <div>
          <button 
            className="bg-gray-600 rounded cursor-pointer text-white px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-2 md:text-base"
            onClick={toggleModal}
          >
            Chat with AI Assistant
          </button>
          <Link to="/account">
            <button className="text-white pl-4 pr-4 text-xs sm:text-sm md:text-base">Account</button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-yellow-600 rounded cursor-pointer px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-2 md:text-base"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button className="text-white pr-4">Sign In</button>
          </Link>
          <Link to="/signup">
            <button className="bg-yellow-600 px-6 py-2 rounded cursor-pointer">
              Sign Up
            </button>
          </Link>
        </div>
      )}
      {isModalOpen && <ChatModal onClose={toggleModal} />}
    </div>
  );
};

export default Navbar;
