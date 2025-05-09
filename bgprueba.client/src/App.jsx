import { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes, Link } from 'react-router';
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import Home from "./components/Home";
import EventBus from "./common/EventBus.js";
import Board from './components/Board';
import AuthService from './Services/auth.service';
import Producto from './components/Productos.jsx';
import Movimientos from './components/productos_components/Movimientos.jsx';

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser();
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            Prueba BG
          </Link>

          {/* Toggler button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/home" className="nav-link">
                  Home
                </Link>
              </li>

              {currentUser && (
                <li className="nav-item">
                  <Link to="/panel" className="nav-link">
                    Panel
                  </Link>
                </li>
              )}
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {currentUser ? (
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={logOut}>
                    LogOut
                  </a>
                </li>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route exact path={"/"} element={<Home />} />
          <Route exact path={"/*"} element={<Home />} />
          <Route exact path={"/home"} element={<Home />} />
          {!currentUser && (<Route exact path="/login" element={<Login />} />)}
          {currentUser && (
            <>
              <Route path="/panel" element={<Board />} />
              <Route path="/panel/productos" element={<Producto />} />
              <Route path="/panel/productos/movimientos/:id" element={<Movimientos />} />
            </>
          )}
        </Routes>
      </div>

      {/* <AuthVerify logOut={logOut}/> */}
      <ToastContainer />
    </div>
  );
};

export default App;