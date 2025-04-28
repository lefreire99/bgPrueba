import React, { useState, useEffect } from "react";
import { dataOptions } from "../utils/menu";
import { Link } from "react-router";

const Board = () => {
    const currentUser = JSON.parse(sessionStorage.getItem("usuario"));

    return (
        <div className="container">
            <h3>Panel General</h3>
            <div className="row justify-content-sm-center justify-content-md-start mt-3">
                {dataOptions.map((option) => {
                    if (option.allowedRoles.includes(currentUser.roles)) {
                        return <CardOption key={option.id} title={option.title} subtitle={option.subtitle} text={option.text} link={option.link}/>
                    }
                })}
            </div>
        </div>
    );
};

const CardOption = ({ title, subtitle, text, link }) => {
    const cardWidth = {
        width: '18rem',
        maxWidth: '18rem',
        maxHeight: 'auto'
    };

    return (
        <div className="col-sm-12 col-md-6 col-lg-4 col-xxl-3">
            <div className="card shadow-sm text-bg-light mt-3" style={cardWidth}>
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