import React, { useState, useEffect } from "react";
import { dataOptions } from "../utils/menu";
import { Link } from "react-router";

const Board = () => {
    const currentUser = JSON.parse(sessionStorage.getItem("usuario"));

    return (
        <div className="container my-4">
            <h3 className="text-center text-md-start">Panel General</h3>

            <div className="row justify-content-center justify-content-md-start g-4 mt-3">
                {dataOptions.map((option) => {
                    if (option.allowedRoles.includes(currentUser.roles)) {
                        return (
                            <CardOption
                                key={option.id}
                                title={option.title}
                                subtitle={option.subtitle}
                                text={option.text}
                                link={option.link}
                            />
                        );
                    }
                    return null; // <== important: always return something or null
                })}
            </div>
        </div>
    );
};

const CardOption = ({ title, subtitle, text, link }) => {
    return (
        <div className="col-12 col-sm-6 col-lg-4 col-xxl-3 d-flex">
            <div className="card shadow-sm text-bg-light flex-fill">
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{subtitle}</h6>
                    <p className="card-text">{text}</p>
                    <Link to={link} className="card-link">Ir...</Link>
                </div>
            </div>
        </div>
    );
}

export default Board;