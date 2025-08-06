import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDrum,
  faSignsPost,
  faVideo,
  faBox,
  faTableColumns,
  faBell,
  faMoneyBill,
  faQuestionCircle,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faSignOutAlt,
  faMusic,
  faTicket
} from "@fortawesome/free-solid-svg-icons";

import "../css/sidebar.css";

/**
 * Sidebar receives collapsed + setCollapsed from Layout
 * so both stay in sync and Layout can resize main content.
 */
const Sidebar = ({ collapsed, setCollapsed }) => {
  const [activeDropdowns, setActiveDropdowns] = useState({});

  /* auto-collapse on small screens */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 991.98px)");
    const handler = (e) => setCollapsed(e.matches);
    handler(mq);                 // set initial
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setCollapsed]);

  const handleToggleDropdown = (title) =>
    setActiveDropdowns((prev) => ({ ...prev, [title]: !prev[title] }));

  const renderDropdown = (title, icon, links) => (
    <div className="my-3" key={title}>
      <div
        className={`sidebar-item d-flex align-items-center ${
          collapsed ? "justify-content-center" : "justify-content-between"
        }`}
        style={{ cursor: "pointer" }}
        data-label={title}
        onClick={() => handleToggleDropdown(title)}
      >
        <FontAwesomeIcon icon={icon} className={collapsed ? "" : "me-2"} />
        {!collapsed && (
          <>
            <span>{title}</span>
            <FontAwesomeIcon
              icon={activeDropdowns[title] ? faChevronUp : faChevronDown}
              className="ms-auto"
            />
          </>
        )}
      </div>

      {!collapsed && activeDropdowns[title] && (
        <div className="ps-4 mt-2">
          {Array.isArray(links) ? (
            links.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `d-block text-decoration-none text-white fs-6 py-1 ${
                    isActive ? "fw-bold" : ""
                  }`
                }
              >
                {label}
              </NavLink>
            ))
          ) : (
            <NavLink
              to={links}
              className={({ isActive }) =>
                `d-block text-decoration-none text-white fs-6 py-1 ${
                  isActive ? "fw-bold" : ""
                }`
              }
            >
              {title}
            </NavLink>
          )}
        </div>
      )}
    </div>
  );

  /* all menu sections */
  const sections = [
    ["Dashboard", faTableColumns, "/dashboard"],
    [
      "Artists",
      faUser,
      [
        { label: "Artists", path: "/artists" },
        { label: "Featured Artists", path: "/featured" },
        { label: "Upload Posters", path: "/posters" },
        { label: "Category Artists", path: "/category-artist" },
        { label: "Approval Requests", path: "/approved" },
      ],
    ],
     ["Users", faUser, "/users"],
     ["Bookings", faBox, "/bookings"],
    ["Category", faDrum, "/category"],
    ["Banners", faSignsPost, [{ label: "Banners", path: "/banner" }]],
    ["Purpose", faVideo, "/purpose"],
    ["Youtube", faMusic, "/videos"],
    [
      "Notification",
      faBell,
      [
        { label: "Artist Notifications", path: "/des" },
        { label: "Push Notifications", path: "/push" },
      ],
    ],
    ["Payment", faMoneyBill, "/payment"],
    ["Coupons", faTicket, "/coupons"],
    ["FAQ's", faQuestionCircle, "/faq"],
  ];

  return (
    <nav                      /* no position-fixed */
      className={`bg-main sidebar p-3 shadow-lg overflow-auto ${
        collapsed ? "sidebar--collapsed" : ""
      }`}
      style={{ height: "100vh" }}
    >
      {/* collapse / expand button */}
      <Button
        variant="link"
        className="toggle-btn text-white p-0 mb-3"
        onClick={() => setCollapsed(!collapsed)}
      >
        <FontAwesomeIcon
          icon={collapsed ? faChevronRight : faChevronLeft}
          size="lg"
        />
      </Button>

      <div className="flex-column mt-4">
        {sections.map(([t, i, l]) => renderDropdown(t, i, l))}
      </div>

      <div className="mt-5 d-flex justify-content-center">
        <NavLink to="/" className="text-decoration-none w-100">
          <Button variant="light" className="bg-light text-dark fw-bold w-100">
            <FontAwesomeIcon icon={faSignOutAlt} />
            {!collapsed && <span className="ms-2">Logout</span>}
          </Button>
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
