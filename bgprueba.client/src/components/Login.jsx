import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Alert from "./Alert";
import AuthService from "../Services/auth.service";
import { useNavigate } from "react-router";

const Login = (props) => {
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [generalError, setGeneralError] = useState();

    const navigate = useNavigate();

    const schema = yup
        .object({
            email: yup.string().required(),
            password: yup.string().required(),
        })
        .required()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data) => {
        try {
            const { email, password } = data;
            setLoadingLogin(true);
            const response = await AuthService.login(email, password);
            setLoadingLogin(false);
            if (response) {
                navigate("/panel");
                window.location.reload();
            } else {
                setGeneralError("Error");
            }
        } catch (error) {
            setLoadingLogin(false);
            setGeneralError("Error en el login");
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: "22rem" }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Correo Electrónico
                        </label>
                        <input type="email" className="form-control" id="email" {...register("email", { required: true })} placeholder="Ingrese correo electrónico" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Contraseña
                        </label>
                        <input type="password" className="form-control" id="password" {...register("password", { required: true })} placeholder="Ingrese contraseña" />
                    </div>
                    {generalError && (
                        <div className="d-flex">
                            <Alert tipo={"danger"}>{generalError}</Alert>
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary w-100">
                        {loadingLogin && (
                            <span className="spinner-border spinner-border-sm"></span>
                        )}
                        Login
                    </button>
                </form>
                {/*<div className="mt-3 text-center">
                    <small className="text-muted">Don't have an account? Sign up</small>
                </div>*/}
            </div>
        </div>
    );
}

export default Login;