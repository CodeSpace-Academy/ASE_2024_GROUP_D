"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/loadingSpinner"

export default function EditDetails() {
  const [userDetails, setUserDetails] = useState({
    email: "",
    fullName: "Not set",
    password: "********",
    phoneNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
      if (loggedInUserEmail) {
        setUserDetails((prev) => ({ ...prev, email: loggedInUserEmail }));

        try {
          const response = await fetch(
            `/api/auth/user/${loggedInUserEmail}/profile`
          );
          if (response.ok) {
            const data = await response.json();
            setUserDetails({
              email: data.email,
              fullName: data.fullName || "Not set",
              password: "********",
              phoneNumber: data.phoneNumber || "",
            });
          } else {
            console.error("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
    setShowSuccessMessage(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
      if (!loggedInUserEmail) throw new Error("User email not found");

      const response = await fetch(
        `/api/auth/user/${loggedInUserEmail}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userDetails.email,
            fullName: userDetails.fullName,
            phoneNumber: userDetails.phoneNumber,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update user details");
      setShowSuccessMessage(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 ease-in-out">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-teal-700 tracking-tight">
              KWAMAIMAI
            </h1>
            <p className="text-sm text-gray-500">
              Logged in as:{" "}
              <span className="font-medium text-gray-700">{userDetails.email}</span>
            </p>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium">
                Profile updated successfully!
              </p>
            </div>
          )}

          {/* Edit Form */}
          {isEditing ? (
            <form className="space-y-4" onSubmit={handleUpdate}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={userDetails.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={userDetails.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleToggleEdit}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-gray-900 font-medium">{userDetails.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{userDetails.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-gray-900 font-medium">
                    {userDetails.phoneNumber || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Password</p>
                  <p className="text-gray-900 font-medium">********</p>
                </div>
              </div>

              <button
                onClick={handleToggleEdit}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
              >
                Edit Details
              </button>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
            >
              Back to Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}