import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { updateUser, logout } from "../store/userSlice"; // Ensure 'logout' is also imported if used for auth check redirection
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios'; // Import axios

const MySwal = withReactContent(Swal);

// Define your backend API base URL
// Make sure this matches your Spring Boot backend URL (e.g., http://localhost:8080)
const API_BASE_URL = 'http://localhost:8080/api'; // Or your deployed backend URL

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Get user, isAuthenticated, and token from Redux state
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    fullname: "", // Initialize empty, will be populated from API
    email: "",
    phone: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true); // New state for initial fetch loading
  const [fetchError, setFetchError] = useState(null); // New state for fetch errors

  // Effect to handle redirection if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      MySwal.fire({
        title: 'Access Denied',
        text: 'Please log in to view your profile.',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/'); // Redirect to your login page
        }
      });
      // Optionally, if you just want to redirect without a modal:
      // navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Function to fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated || !user.accessToken) {
      setFetchingProfile(false);
      return;
    }

    setFetchingProfile(true);
    setFetchError(null); // Clear previous errors

    try {
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`, // Send the JWT token
        },
      });
      const userData = response.data;
      setFormData({
        fullname: userData.fullname || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
  
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setFetchError("Failed to load profile data. Please try again.");
      if (error.response && error.response.status === 401) {
        // Token expired or invalid, log out the user
        MySwal.fire({
          title: 'Session Expired',
          text: 'Your session has expired. Please log in again.',
          icon: 'warning',
          confirmButtonText: 'OK',
        }).then(() => {
          dispatch(logout()); // Dispatch logout action
          navigate('/login');
        });
      } else {
        MySwal.fire({
          title: 'Error!',
          text: 'Failed to fetch profile. ' + (error.response?.data?.message || error.message),
          icon: 'error',
        });
      }
    } finally {
      setFetchingProfile(false);
    }
  }, [isAuthenticated, dispatch, navigate]); // Add dependencies

 
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]); // Depend on the memoized fetchUserProfile function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`${API_BASE_URL}/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the JWT token for update
          'Content-Type': 'application/json',
        },
      });

      const updatedUserData = response.data;
      dispatch(updateUser(updatedUserData)); // Update Redux state with the newly updated data

      MySwal.fire({
        title: 'Success!',
        text: 'Your profile has been updated.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      let errorMessage = 'Failed to update profile. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
      } else if (error.message) {
          errorMessage = error.message;
      }
      MySwal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Render loading state while fetching initial profile
  if (fetchingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Render error message if initial fetch failed
  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-gray-700">{fetchError}</p>
          <button
            onClick={fetchUserProfile} // Allow retrying the fetch
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If not authenticated, the `useEffect` will handle redirection, so this won't be reached.
  // But if it somehow is, ensure the component doesn't break by using `user?.`
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          User Profile
        </h2>

        {/* Display User Information */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-gray-700">
              <p className="font-semibold text-gray-800">Full Name:</p>
              <p className="text-gray-600">{formData.fullname}</p> {/* Use formData */}
            </div>
            <div className="text-gray-700">
              <p className="font-semibold text-gray-800">Email:</p>
              <p className="text-gray-600">{formData.email}</p> {/* Use formData */}
            </div>
            {formData.phone && (
              <div className="text-gray-700">
                <p className="font-semibold text-gray-800">Phone:</p>
                <p className="text-gray-600">{formData.phone}</p> {/* Use formData */}
              </div>
            )}
            {formData.address && (
              <div className="text-gray-700 col-span-1 md:col-span-2">
                <p className="font-semibold text-gray-800">Address:</p>
                <p className="text-gray-600">{formData.address}</p> {/* Use formData */}
              </div>
            )}
            {/* Add more profile fields as needed */}
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleUpdate} className="mt-8 space-y-6">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                readOnly // Email is often read-only, changes might require re-verification
                disabled // Visually indicate it's disabled
              />
              <p className="mt-1 text-sm text-gray-500">
                Email cannot be changed directly. Please contact support.
              </p>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              ></textarea>
            </div>
            {/* Add more editable fields */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Action Buttons */}
        {!isEditing && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;