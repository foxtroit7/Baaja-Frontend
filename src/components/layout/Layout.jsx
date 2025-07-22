import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../common-componets/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import "./toggle.css";

const Layout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  /* keep the dark/light toggle checkbox in sync */
  useEffect(() => {
    const cb = document.getElementById("theme-toggle");
    if (cb) cb.checked = theme === "dark";
  }, [theme]);

  const handleBack = () => {
    navigate(-1); // navigates to previous page
  };

  return (
    <div className={`app-layout ${theme} d-flex`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* main area grows to fill remaining space */}
      <main
        className="flex-fill"
        style={{
          padding: "20px",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* top controls: back button (left) and toggle (right) */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* 🔙 Back Button */}
          <button
            className="btn bg-main"
            onClick={handleBack}
          >
           <span className="fw-bold">Back</span>
          </button>

          {/* 🌗 Theme Toggle */}
          <div className="checkbox-wrapper-3">
            <input
              type="checkbox"
              id="theme-toggle"
              onChange={toggleTheme}
            />
            <label htmlFor="theme-toggle" className="toggle">
              <span></span>
            </label>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
