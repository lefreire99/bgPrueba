import React, { useState, useEffect } from "react";

const Alert = (props) => {
    const { tipo } = props;
    return (
        <div className={`alert alert-${tipo}`} role="alert">
            {props.children}
        </div>
    );
};

export default Alert;