import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Custom hook for handling user authentication actions.
 * Provides methods for signing up, logging in, and logging out,
 * as well as managing authentication error states.
 *
 * @returns {Object} An object containing the following properties:
 * @returns {function} signup - A function that takes an email and password
 *                              to create a new user account.
 * @returns {function} login - A function that takes an email and password
 *                             to log in an existing user.
 * @returns {function} logout - A function to log out the currently authenticated user.
 * @returns {string|null} error - An error message if an authentication action fails; otherwise, null.
 */
export function useAuth() {
  const router = useRouter();
  const [error, setError] = useState(null);

  /**
   * Signs up a new user with the provided email and password.
   * Redirects to the login page upon successful signup.
   *
   * @async
   * @function signup
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @throws {Error} Throws an error if the signup request fails.
   */
  const signup = async (email, fullName, phoneNumber, password) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, phoneNumber, password }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Logs in an existing user with the provided email and password.
   * Redirects to the home page upon successful login.
   *
   * @async
   * @function login
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @throws {Error} Throws an error if the login request fails.
   */
  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      localStorage.setItem("loggedInUserEmail", data.email);
      localStorage.setItem("userData", JSON.stringify(data));
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Logs out the currently authenticated user.
   * Redirects to the login page after logging out.
   *
   * @async
   * @function logout
   */
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return { signup, login, logout, error };
}
