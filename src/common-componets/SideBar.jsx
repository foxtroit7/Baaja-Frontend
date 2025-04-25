import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import '../css/sidebar.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faDrum, faSignsPost, faVideo, faBox,
  faTableColumns, faBell, faMoneyBill, faQuestionCircle,
  faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [activeDropdowns, setActiveDropdowns] = useState({});

  const handleToggle = (title) => {
    setActiveDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const renderDropdown = (title, icon, links) => (
    <div className="my-3">
      <div
        className="text-white w-100 d-flex justify-content-between align-items-center fs-5"
        onClick={() => handleToggle(title)}
        style={{ cursor: 'pointer' }}
      >
        <div>
          <FontAwesomeIcon icon={icon} className="me-2" /> {title}
        </div>
        <FontAwesomeIcon icon={activeDropdowns[title] ? faChevronUp : faChevronDown} />
      </div>

      {activeDropdowns[title] && (
        <div className="ps-4 mt-2">
          {Array.isArray(links) ? (
            links.map((item, idx) => (
              <NavLink
                to={item.path}
                key={idx}
                className={({ isActive }) =>
                  `d-block text-decoration-none text-white fs-6 py-1 ${isActive ? 'fw-bold' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))
          ) : (
            <NavLink
              to={links}
              className={({ isActive }) =>
                `d-block text-decoration-none text-white fs-6 py-1 ${isActive ? 'fw-bold' : ''}`
              }
            >
              {title}
            </NavLink>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="d-flex">
      <div
        className="vh-100 bg-primary p-3 rounded-end shadow-lg position-fixed overflow-auto"
        style={{ width: '250px', borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}
      >
        <div className="flex-column mt-4">

          {renderDropdown('Dashboard', faTableColumns, '/dashboard')}
          {renderDropdown('Artists', faUser,[ {label: 'Artists',path: '/artists'}, {label: 'Featured Artists',path: '/featured'}])}
          {renderDropdown('Category', faDrum, '/category')}
          {renderDropdown('Banners', faSignsPost, [
            { label: 'Banners', path: '/banner' },
            // { label: 'Promotions', path: '/promotions' }
          ])}
          {renderDropdown('Booking Purpose', faVideo, '/purpose')}
          {renderDropdown('Users', faUser, '/users')}
          {renderDropdown('Bookings', faBox, '/bookings')}
          {renderDropdown('Notification', faBell, '/des')}
          {renderDropdown('Payment', faMoneyBill, '/payment')}
          {renderDropdown("FAQ's", faQuestionCircle, '/faq')}
        </div>

        {/* Logout Button */}
        <div className="mt-5 d-flex justify-content-center align-items-center">
          <NavLink to="/login" className="text-decoration-none">
            <Button variant="light" className="text-primary font-600 fw-bold">
              Logout
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
