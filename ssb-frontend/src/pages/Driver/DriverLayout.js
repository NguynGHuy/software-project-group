import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./driver.css";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";

export default function DriverLayout() {
  useEffect(() => {
    document.body.classList.add("driver-app-body");
    return () =>
      document.body.classList.remove("driver-app-body");
  }, []);

  return (
    <div className="driver-app-shell">

      {/* TOPBAR */}
      <div className="driver-topbar">
        <button className="icon-btn" aria-label="menu">
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <rect width="20" height="2" rx="1" fill="white" />
            <rect y="6" width="20" height="2" rx="1" fill="white" />
            <rect y="12" width="20" height="2" rx="1" fill="white" />
          </svg>
        </button>

        <div className="driver-title">Driver App</div>

        <button className="icon-btn bell-btn" aria-label="notifications">
          <DirectionsBusFilledIcon style={{ color: "white" }} />
          <span className="badge">3</span>
        </button>
      </div>

      {/* CONTENT */}
      <div className="driver-container">
        <Outlet />
      </div>
    </div>
  );
}
