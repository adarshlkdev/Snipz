import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchUsers", searchTerm],
    queryFn: async () => {
      if (searchTerm.length < 3) return []; // Only search if term is 3 or more characters
      const res = await fetch(`/api/users/search/${searchTerm}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data; // Return the array of users
    },
    enabled: searchTerm.length >= 3, // Enable query only if searchTerm is 3 or more characters
  });

  return (
    <div className="mb-4 relative">
      <input
        type="text"
        className="w-full p-2 rounded-md bg-gray-800 text-white pr-10"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <LoadingSpinner size="sm" />
        </div>
      )}
      {isError && <p className="text-red-500 mt-2 mx-4">User not found</p>}
      {!isLoading && searchResults?.length === 0 && searchTerm.length >= 3 && (
        <p className="text-gray-500">User not found</p>
      )}
      {searchResults?.length > 0 && (
        <ul className="mt-2 bg-gray-800 rounded-md p-2">
          {searchResults.map((user) => (
            <li key={user._id} className="p-2 hover:bg-gray-700 cursor-pointer">
              <Link
                to={`/profile/${user.username}`}
                onClick={() => setSearchTerm("")}
              >
                <div className="avatar flex flex-row justify-center items-center gap-2">
                  <div className="w-8 rounded-full">
                    <img src={user.profileImg || "/avatar-placeholder.png"} />
                  </div>
                  {user.fullName} (@{user.username})
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;