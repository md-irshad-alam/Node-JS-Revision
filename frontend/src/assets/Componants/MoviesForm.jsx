import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import apiClient from "../../config/axiosConfig";
const MoviesForm = () => {
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      releaseYear: "",
      genre: "",
      director: "",
      rating: "",
      image: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
      releaseYear: Yup.number()
        .required("Release Year is required")
        .min(1888, "Year must be after 1888"),
      genre: Yup.string().required("Genre is required"),
      director: Yup.string().required("Director is required"),
      rating: Yup.number()
        .min(0, "Rating must be at least 0")
        .max(10, "Rating must be at most 10")
        .required("Rating is required"),
      image: Yup.mixed()
        .required("Image is required")
        .test("fileSize", "File size is too large", (value) => {
          return value && value.size <= 2000000; // 2MB limit
        })
        .test("fileType", "Unsupported file format", (value) => {
          return (
            value &&
            ["image/jpeg", "image/png", "image/gif"].includes(value.type)
          );
        }),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Form values:", values);
        const response = await apiClient.post("/movies/create", {
          ...values,
        });

        if (response.status === 200) {
          console.log("✅ Movie created successfully:", response.data);
          alert("Movie created successfully!");
          navigate("/movies");
          formik.resetForm();
        } else {
          console.error("❌ Failed to create movie:", response.data);
        }
      } catch (error) {
        console.error(
          "🚨 Error occurred while creating movie:",
          error?.response?.data || error.message
        );
      }
    },
  });

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Movie Title</label>
          <input
            type="text"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            placeholder="Enter movie title"
            className="w-full border border-gray-300 p-2 rounded"
          />
          {formik.errors.title && formik.touched.title && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Description</label>
          <input
            type="text"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            placeholder="Enter description"
            className="w-full border border-gray-300 p-2 rounded"
          />
          {formik.errors.description && formik.touched.description && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Release Year</label>
          <input
            type="number"
            name="releaseYear"
            onChange={formik.handleChange}
            value={formik.values.releaseYear}
            placeholder="Enter release year"
            className="w-full border border-gray-300 p-2 rounded"
          />
          {formik.errors.releaseYear && formik.touched.releaseYear && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.releaseYear}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Genre</label>
          <input
            type="text"
            name="genre"
            onChange={formik.handleChange}
            value={formik.values.genre}
            placeholder="Enter genre"
            className="w-full border border-gray-300 p-2 rounded"
          />
          {formik.errors.genre && formik.touched.genre && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.genre}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Director</label>
          <input
            type="text"
            name="director"
            onChange={formik.handleChange}
            value={formik.values.director}
            placeholder="Enter director's name"
            className="w-full border border-gray-300 p-2 rounded"
          />
          {formik.errors.director && formik.touched.director && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.director}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Rating</label>
          <input
            type="number"
            name="rating"
            onChange={formik.handleChange}
            value={formik.values.rating}
            placeholder="Enter rating (0–10)"
            className="w-full border border-gray-300 p-2 rounded"
          />
          {formik.errors.rating && formik.touched.rating && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.rating}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(event) => {
              formik.setFieldValue("image", event.currentTarget.files[0]);
            }}
            className="w-full border border-gray-300 p-2 rounded file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {/* <input
            type="file"
            name="image"
            onChange={(event) =>
              formik.setFieldValue("image", event.currentTarget.files[0])
            }
           
          /> */}
          {formik.errors.image && formik.touched.image && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MoviesForm;
