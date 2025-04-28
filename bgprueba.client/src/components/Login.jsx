import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Alert from "./Alert";
import AuthService from "../Services/auth.service";
import { useNavigate } from "react-router";
import { ExclamationCircle } from "react-bootstrap-icons";
import { ErrorMessage } from "./ErrorMessage";
import { inputStyle } from "../utils/functions";

const Login = (props) => {
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [generalError, setGeneralError] = useState();
    const [usuario, setUsuario] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const name = e.target.name;
        const valor = e.target.value;
        setUsuario(prev => ({ ...prev, [name]: valor }));
    }

    const handleSubmit = async () => {
        try {
            const { email, password } = usuario;
            setLoadingLogin(true);
            if (email && email != "") {
                if (password && password != "") {
                    setGeneralError();
                    const response = await AuthService.login(email, password);
                    console.log(response);
                    setLoadingLogin(false);
                    if (response) {
                        navigate("/panel");
                        window.location.reload();
                    } else {
                        setGeneralError("No ha sido posible validar el usuario. Revisar email y contraseña.");
                    }
                } else {
                    setGeneralError("Contraseña es requerida.")
                    setLoadingLogin(false);
                }
            } else {
                setGeneralError("Email es requerido.")
                setLoadingLogin(false);
            }
        } catch (error) {
            setLoadingLogin(false);
            setGeneralError("Error en el login");
        }
    }

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="row w-100">
                <div className="col-12 col-sm-8 col-md-6 col-lg-4 mx-auto">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Login</h2>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                onChange={handleChange}
                                id="email"
                                name="email"
                                placeholder="Ingrese correo electrónico"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                onChange={handleChange}
                                id="password"
                                name="password"
                                placeholder="Ingrese contraseña"
                            />
                        </div>

                        {generalError && (
                            <div className="mt-3">
                                <Alert tipo={"danger"}>
                                    <ExclamationCircle /> {generalError}
                                </Alert>
                            </div>
                        )}

                        <button
                            type="button"
                            className="btn btn-primary w-100 mt-3"
                            onClick={handleSubmit}
                            disabled={loadingLogin}
                        >
                            {loadingLogin && (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            )}
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;