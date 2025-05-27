import React, { useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isloging, setlogin] = useState(true);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (!isloging) {
          let response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            }
          );
          if (response.ok) {
            setSuccess("Account created successfully");
            setError("");
            formik.resetForm();
            setlogin(true);
          } else {
            setError(data.message || "Something went wrong");
          }
        } else {
          let response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(values),
          });
          if (response.ok) {
            console.log(response);
            setSuccess(response.message);
            setError("");
            formik.resetForm();
          } else {
            setError(data.message || "Something went wrong");
          }
        }
      } catch (err) {
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm text-center mb-2">{success}</p>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {!isloging && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                placeholder="Enter username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.email && formik.touched.email && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.password && formik.touched.password && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          >
            {isloging
              ? loading
                ? "login..."
                : "Login"
              : loading
              ? "Creating..."
              : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setlogin(!isloging)}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
