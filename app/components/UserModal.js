"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, getSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserModal({ show, onClose }) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
  });
  const [authState, setAuthState] = useState({
    isCheckingUser: false,
    isLogin: null,
    loggedInUser: null,
    isLoggingIn: false,
    isConfirmingLogout: false,
    isVerifyingGoogle: false,
    isLoggingOut: false,
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedEmail = localStorage.getItem("loggedInUserEmail");
      if (storedEmail) {
        setAuthState((prev) => ({ ...prev, loggedInUser: storedEmail }));
      }

      const session = await getSession();
      if (session?.user?.email) {
        localStorage.setItem("loggedInUserEmail", session.user.email);
        setAuthState((prev) => ({ ...prev, loggedInUser: session.user.email }));
      }
    };

    initializeAuth();
  }, []);

  // Google Sign In
  const handleGoogleSignIn = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isVerifyingGoogle: true }));
    try {
      const result = await signIn("google", { redirect: false });
      if (result?.ok) {
        const session = await getSession();
        if (session?.user?.email) {
          localStorage.setItem("loggedInUserEmail", session.user.email);
          setAuthState((prev) => ({
            ...prev,
            loggedInUser: session.user.email,
          }));
          onClose();
        } else {
          alert("Error: Unable to retrieve email.");
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert("Error signing in with Google");
    } finally {
      setAuthState((prev) => ({ ...prev, isVerifyingGoogle: false }));
    }
  }, [onClose]);

  // Email check
  const handleEmailCheck = useCallback(async () => {
    if (!formState.email) {
      alert("Please enter an email.");
      return;
    }

    setAuthState((prev) => ({ ...prev, isCheckingUser: true }));
    try {
      const response = await fetch("/api/auth/checkuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formState.email }),
      });

      setAuthState((prev) => ({
        ...prev,
        isCheckingUser: false,
        isLogin: response.status === 200,
      }));
    } catch (error) {
      console.error("Error checking user:", error);
      alert("Error checking user. Please try again.");
      setAuthState((prev) => ({ ...prev, isCheckingUser: false }));
    }
  }, [formState.email]);

  // Form submission
  const handleSubmit = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoggingIn: true }));
    try {
      if (authState.isLogin) {
        const result = await signIn("credentials", {
          email: formState.email,
          password: formState.password,
          redirect: false,
        });

        if (result?.error) {
          alert("Login failed. Please check your credentials.");
          return;
        }
      } else {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formState.fullName,
            email: formState.email,
            phone: formState.phoneNumber,
            password: formState.password,
          }),
        });

        if (!response.ok) {
          const result = await response.json();
          alert(result.message || "Sign-up failed. Please try again.");
          return;
        }
      }

      localStorage.setItem("loggedInUserEmail", formState.email);
      setAuthState((prev) => ({ ...prev, loggedInUser: formState.email }));
      router.push("/");
      onClose();
    } finally {
      setAuthState((prev) => ({ ...prev, isLoggingIn: false }));
    }
  }, [authState.isLogin, formState, router, onClose]);

  // Logout handling
  const handleLogout = () =>
    setAuthState((prev) => ({ ...prev, isConfirmingLogout: true }));
  const confirmLogout = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoggingOut: true }));
    try {
      localStorage.removeItem("loggedInUserEmail");
      setAuthState((prev) => ({ ...prev, loggedInUser: null }));
      await signOut();
      alert("Logged out successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Error logging out. Please try again.");
    } finally {
      setAuthState((prev) => ({ ...prev, isLoggingOut: false }));
    }
  }, [router]);

  const cancelLogout = () =>
    setAuthState((prev) => ({ ...prev, isConfirmingLogout: false }));

  const handleBack = useCallback(() => {
    setAuthState((prev) => ({ ...prev, isLogin: null }));
    setFormState((prev) => ({
      ...prev,
      fullName: "",
      phoneNumber: "",
    }));
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-96 p-6 rounded-l-3xl shadow-lg relative">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-teal-500 font-medium uppercase text-sm"
        >
          &times;
        </button>

        {authState.isLogin !== null && (
          <button
            onClick={handleBack}
            className="absolute top-3 left-3 text-gray-500 text-2xl"
          >
            &#8592;
          </button>
        )}

        <h2 className="text-2xl font-bold text-center mb-4">
          {authState.isCheckingUser
            ? "Verifying..."
            : authState.isLoggingIn
              ? "Logging in..."
              : authState.isLogin === null
                ? "Sign Up or Login"
                : authState.isLogin
                  ? "Login"
                  : "Sign Up"}
        </h2>

        {authState.loggedInUser ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Welcome, {authState.loggedInUser}!
            </h2>
            <Link href="/editdetails">
              <button
                onClick={onClose}
                className="w-full bg-teal-700 text-white py-3 rounded-md mb-4"
              >
                Edit Profile
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-3 rounded-md mb-4"
            >
              Log Out
            </button>
          </div>
        ) : (
          <>
            {authState.isLogin === null && (
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formState.email}
                onChange={handleInputChange}
                className="w-full border rounded-md p-3 text-gray-700 mb-4"
              />
            )}

            {authState.isLogin === false && (
              <>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formState.fullName}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3 text-gray-700 mb-4"
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formState.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3 text-gray-700 mb-4"
                />
              </>
            )}

            {authState.isLogin !== null && (
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formState.password}
                onChange={handleInputChange}
                className="w-full border rounded-md p-3 text-gray-700 mb-4"
              />
            )}

            {authState.isLogin === null ? (
              <button
                onClick={handleEmailCheck}
                className="w-full bg-teal-700 text-white py-3 rounded-md mb-4"
              >
                Continue with Email
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="w-full bg-teal-700 text-white py-3 rounded-md"
              >
                {authState.isLogin ? "Login" : "Sign Up"}
              </button>
            )}
          </>
        )}

        <div className="text-center text-gray-500 mb-4">OR</div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full border rounded-md py-3 flex items-center justify-center mb-2"
          disabled={authState.isVerifyingGoogle}
        >
          {authState.isVerifyingGoogle ? (
            "Verifying..."
          ) : (
            <>
              <Image
                src="/google.svg"
                alt="Google icon"
                width={20}
                height={20}
                className="w-5 mr-2"
              />
              Continue with Google
            </>
          )}
        </button>

        {authState.isConfirmingLogout && (
          <div className="text-center mt-4">
            {authState.isLoggingOut ? (
              <p>Logging out...</p>
            ) : (
              <>
                <p>Are you sure you want to log out?</p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={confirmLogout}
                    className="bg-teal-700 text-white px-4 py-2 rounded-md"
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelLogout}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md"
                  >
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
