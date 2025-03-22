import React from 'react';
import { Button } from 'react-bootstrap';
import '../css/sidebar.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faDrum, faSignsPost, faVideo, faBox, faTableColumns, faBell, faMoneyBill, faQuestion, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="d-flex">
      <div
        className="vh-100 bg-primary p-3 rounded-end shadow-lg position-fixed"
        style={{ width: '250px', borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}
      >
        <div className="flex-column mt-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `d-block text-decoration-none hover-effect ${isActive ? 'active-link' : ''}`
            }
          >
            <FontAwesomeIcon icon={faTableColumns} className="me-2" /> Dashboard
          </NavLink>
          <NavLink
            to="/artists"
            className={({ isActive }) =>
              `d-block text-decoration-none hover-effect ${isActive ? 'active-link' : ''}`
            }
          >
            <FontAwesomeIcon icon={faUser} className="me-2" /> Artists
          </NavLink>
          <NavLink
            to="/category"
            className={({ isActive }) =>
              `d-block text-decoration-none hover-effect ${isActive ? 'active-link' : ''}`
            }
          >
            <FontAwesomeIcon icon={faDrum} className="me-2" /> Category
          </NavLink>
          <NavLink
            to="/banner"
            className={({ isActive }) =>
              `d-block text-decoration-none hover-effect ${isActive ? 'active-link' : ''}`
            }
          >
            <FontAwesomeIcon icon={faSignsPost} className="me-2" /> Banner
          </NavLink>
          <NavLink
            to="/videos"
            className={({ isActive }) =>
              `d-block text-decoration-none hover-effect ${isActive ? 'active-link' : ''}`
            }
          >
            <FontAwesomeIcon icon={faVideo} className="me-2" /> Videos
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `d-block text-decoration-none hover-effect ${isActive ? 'active-link' : ''}`
            }
          >
            <FontAwesomeIcon icon={faUser} className="me-2" /> Users
          </NavLink>
          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `d-block text-decoration-none hover-effect ${isActive ? 'active-link' : ''}`
            }
          >
            <FontAwesomeIcon icon={faBox} className="me-2" /> Bookings
          </NavLink>
          <NavLink
            to="/des"
            className={({ isActive }) =>
              `d-block text-decoration-none hover-effect ${isActive ? 'active-link' : ''}`
            }
          >
            <FontAwesomeIcon icon={faBell} className="me-2" /> Notification
          </NavLink>
          <NavLink
            to="/payment"
            className={({ isActive }) =>
              `d-block text-decoration-none hover-effect ${isActive ? 'active-link' : ''}`
            }
          >
            <FontAwesomeIcon icon={faMoneyBill} className="me-2" /> Payment
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `d-block text-decoration-none hover-effect ${isActive ? 'active-link' : ''}`
            }
          >
            <FontAwesomeIcon icon={faQuestionCircle} className="me-2" /> FAQ's
          </NavLink>
        </div>

        <div className="mt-4 d-flex justify-content-center align-items-center">
          <NavLink to="/login" className="text-decoration-none mt-4 mb-3">
            <Button variant="light" className="text-primary font-600 fw-bold mt-4">
              logout
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
