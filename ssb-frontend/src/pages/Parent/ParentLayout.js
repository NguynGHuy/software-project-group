import React, { useEffect } from "react"; 
import { Outlet } from "react-router-dom";
import "./parent.css"; 

export default function ParentLayout() {

  useEffect(() => {
   
    document.body.classList.add("parent-app-body");
    return () => {
      document.body.classList.remove("parent-app-body");
    };
  }, []);

  return (
    <div className="parent-app-shell">
      <div className="parent-topbar">
        <button className="icon-btn menu-btn" aria-label="menu">
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none"><rect width="20" height="2" rx="1" fill="white"/><rect y="6" width="20" height="2" rx="1" fill="white"/><rect y="12" width="20" height="2" rx="1" fill="white"/></svg>
        </button>
        <div className="parent-title">Parent App</div>
        <button className="icon-btn bell-btn" aria-label="notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2Z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 17H5v-1c0-3.1 1.6-5.8 4.3-7.1V8a3.7 3.7 0 0 1 7.4 0v.9C17.4 10.2 19 12.9 19 16v1z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="badge">3</span>
        </button>
      </div>

      <div className="parent-container">
        <Outlet />
      </div>
    </div>
  );
}