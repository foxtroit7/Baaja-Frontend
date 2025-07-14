// Layout.jsx
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../common-componets/SideBar";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import "./toggle.css";

const Layout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [collapsed, setCollapsed] = useState(false);

  /* keep the dark/light toggle checkbox in sync */
  useEffect(() => {
    const cb = document.getElementById("theme-toggle");
    if (cb) cb.checked = theme === "dark";
  }, [theme]);

  return (
    <div className={`app-layout ${theme} d-flex`} >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* main area grows to fill whatever space is left */}
      <main
        className="flex-fill"
        style={{
          padding: "20px",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* theme switch */}
        <div className="d-flex justify-content-end mb-3">
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
