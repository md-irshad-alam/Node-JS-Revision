import MoviesForm from "./assets/Componants/MoviesForm";
import Signup from "./assets/Componants/Signup";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MoviesList from "./assets/Componants/MoviesList";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "./config/axiosConfig";
import axios from "axios";

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [isActhenticated, setauthenticatd] = useState(null);

  const handleLoginClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    apiClient
      .get("http://localhost:5000/api/auth/check")
      .then((res) => {
        if (res.data?.authenticated) {
          setauthenticatd(res.data.authenticated);
          setUsername(res.data?.user);
        }
      })
      .catch(() => {
        setUsername(null);
      });
  }, []);
  console.log(username);
  const handlelogout = () => {
    sessionStorage.clear();
    navigate("/login");
    window.location.reload();
  };
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
            {username ? (
              <div className="flex items-center justify-center gap-x-4">
                <p className=" bg-green-400 p-1 rounded-sm">{username}</p>
                <button onClick={handlelogout}>Logout</button>
              </div>
            ) : (
              "login"
            )}
          </Link>
        </div>
      </nav>
      <Routes>
        {isActhenticated === true ? (
          <>
            <Route path="/" element={<MoviesForm />} />
            <Route path="/movies" element={<MoviesList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
