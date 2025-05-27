import MoviesForm from "./assets/Componants/MoviesForm";
import Signup from "./assets/Componants/Signup";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MoviesList from "./assets/Componants/MoviesList";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "./config/axiosConfig";

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  const handleLoginClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    apiClient
      .get("/auth/check")
      .then((res) => {
        if (res.data?.authenticated) {
          setUsername(res.data?.user?.name);
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
          <Link to="/login" onClick={handleLoginClick}>
            Login
          </Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<MoviesForm />} />
        <Route path="/login" element={<Signup />} />
        <Route path="/movies" element={<MoviesList />} />
      </Routes>
    </>
  );
}

export default App;
