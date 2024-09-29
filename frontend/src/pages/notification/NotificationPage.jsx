import { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formatNotificationDate } from "../../utils/date";
import { FaTrash } from "react-icons/fa";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const [deletingNotificationId, setDeletingNotificationId] = useState(null); // State to track the ID of the notification being deleted

  const { data: notifications, isPending } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/notifications", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteNotificationById } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(`/api/notifications/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Notification deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setDeletingNotificationId(null); // Reset the deleting notification ID
    },
    onError: (error) => {
      toast.error(error.message);
      setDeletingNotificationId(null); // Reset the deleting notification ID
    },
  });

  const handleDeleteNotification = (id) => {
    setDeletingNotificationId(id); // Set the deleting notification ID
    deleteNotificationById(id);
  };

  // Sort notifications by createdAt in descending order
  const sortedNotifications = notifications?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r sticky border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isPending && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {sortedNotifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              <Link to={`/profile/${notification.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2 justify-normal items-center">
                  <div className="flex gap-1">
                    <span className="font-bold">
                      @{notification.from.username}
                    </span>{" "}
                    {notification.type === "follow"
                      ? "followed you"
                      : "liked your post"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatNotificationDate(notification.createdAt)}
                  </div>
                </div>
              </Link>
              <span className="flex justify-end flex-1">
                {deletingNotificationId === notification._id ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => handleDeleteNotification(notification._id)}
                  />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationPage;