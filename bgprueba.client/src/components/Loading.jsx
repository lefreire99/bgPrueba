import React, { useState, useEffect } from "react";
import "./loading.css"

const Loading = () => {

  return (
    <div className="container-bg">
        <div className="spinner-container">
            <div className="loading-spinner"></div>
        </div>
    </div>
  );
};

export default Loading;