import React from "react";
import { useEffect, useState } from "react";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/movies/getAll",
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies(data.movieData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [loading]);
  const handleDelete = async (movieId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/movies/delete/${movieId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete movie");
      }
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
      setLoading(true); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  console.log(movies);
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Movies List</h1>
      {loading && (
        <p className="text-center text-gray-500">Loading movies...</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
          >
            <div className="relative">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-56 object-cover"
              />
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
                {movie.genre}
              </span>
              <button
                onClick={() => handleDelete(movie._id)}
                className="absolute bottom-2 right-2 bg-yellow-300 text-white text-xs px-3 py-1 rounded-full shadow"
              >
                Delete
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-between p-5">
              <div>
                <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Year:</span>{" "}
                  {movie.releaseYear}
                </p>
                <p className="text-gray-500 mb-1">
                  <span className="font-semibold">Director:</span>{" "}
                  {movie.director}
                </p>
                <p className="text-gray-700 mb-2">{movie.description}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400">
                  Listed By: {movie.createdBy.name}
                </span>
                <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                  ⭐ {movie.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesList;
