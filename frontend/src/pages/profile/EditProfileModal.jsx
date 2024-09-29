import { useState } from "react";
import { MdCancel } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditProfileModal = ({ authUser }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <button
            className="absolute top-2 right-2 text-gray-700"
            onClick={() =>
              document.getElementById("edit_profile_modal").close()
            }
          >
            <MdCancel className="w-6 h-6" />
          </button>
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password"
                  className="input border border-gray-700 rounded p-2 input-md w-full"
                  value={formData.currentPassword}
                  name="currentPassword"
                  onChange={handleInputChange}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={toggleCurrentPasswordVisibility}
                >
                  {showCurrentPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </div>
              </div>
              <div className="relative flex-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="input border border-gray-700 rounded p-2 input-md w-full"
                  value={formData.newPassword}
                  name="newPassword"
                  onChange={handleInputChange}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>
            <input
              type="text"
              placeholder="Link"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <button className="btn btn-primary rounded-full btn-sm text-white">
              {isUpdatingProfile ? <LoadingSpinner size="sm" /> : "Update"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
