import MoviesForm from "./assets/Componants/MoviesForm";
import Signup from "./assets/Componants/Signup";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MoviesList from "./assets/Componants/MoviesList";
import { Link, useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch("https://node-js-revision.onrender.com/api/auth/check", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data?.authenticated);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  const handleLoginClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    fetch("https://node-js-revision.onrender.com/api/auth/check", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated) {
          setUsername(data?.user?.name);
        }
      })
      .catch(() => {
        setUsername(null);
      });
  }, []);

  return (
    <>
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Link to="/">Movies</Link>
        <Link to="/movies">List Movies</Link>
        <div style={{ marginLeft: "auto" }}>
          {username !== null ? (
            <span>Welcome, {username}</span>
          ) : (
            <button onClick={handleLoginClick}>Login</button>
          )}
        </div>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {" "}
              <MoviesForm />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Signup />} />
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              {" "}
              <MoviesList />{" "}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
