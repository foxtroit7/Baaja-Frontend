import React, { useState } from "react";
import {
  Table,
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Coupons = () => {
  const [couponData, setCouponData] = useState([
    {
      serial: 1,
      code: "WELCOME50",
      description: "500 off for new users",
      discount: "₹50",
      applicableOn: "Full Payment",
    },
    {
      serial: 2,
      code: "FESTIVE100",
      description: "₹100 off on all bookings",
      discount: "₹100",
      applicableOn: "Both",
    },
    {
      serial: 3,
      code: "PARTIAL200",
      description: "200 off on partial payments",
      discount: "₹200",
      applicableOn: "Partial Payment",
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discount: "",
    applicableOn: "Full Payment",
  });

  const handleInputChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const handleAddCoupon = () => {
    const updatedData = [
      ...couponData,
      {
        ...newCoupon,
        serial: couponData.length + 1,
      },
    ];
    setCouponData(updatedData);
    setShowModal(false);
    setNewCoupon({
      code: "",
      description: "",
      discount: "",
      applicableOn: "Full Payment",
    });
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="font-bold">Coupon List</h2>
        <Button className='bg-main'  onClick={() => setShowModal(true)}>
          Add Coupon
        </Button>
      </div>

      <div className="table-responsive">
        <Table responsive className="text-sm shadow-sm table-striped">
          <thead className="bg-main">
            <tr>
              <th className="text-center align-middle py-3">S.No.</th>
              <th className="text-center align-middle py-3">Coupon Code</th>
              <th className="text-center align-middle py-3">Description</th>
              <th className="text-center align-middle py-3">Discount</th>
              <th className="text-center align-middle py-3">Applicable On</th>
             
              <th className="text-center align-middle py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {couponData.map((coupon) => (
              <tr key={coupon.serial}>
                <td className="text-center align-middle py-3">{coupon.serial}</td>
                <td className="text-center align-middle py-3 fw-bold text-warning">{coupon.code}</td>
                <td className="text-center align-middle py-3">{coupon.description}</td>
                <td className="text-center align-middle py-3  fw-bold text-warning">{coupon.discount}</td>
                <td className="text-center align-middle py-3">{coupon.applicableOn}</td>
               
                <td className="text-center align-middle py-3">
                  <div className="action-buttons d-flex justify-content-center align-items-center">
                    <button className="btn btn-danger me-2">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="btn btn-warning text-light">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Adding Coupon */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">Add New Coupon</Modal.Title>
        </Modal.Header>
         <Modal.Body className='text-dark'>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Coupon Code</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={newCoupon.code}
                onChange={handleInputChange}
              
              />
            </Form.Group>
            <Form.Group className="mb-3">
               <Form.Label className="text-dark">Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newCoupon.description}
                onChange={handleInputChange}
              
              />
            </Form.Group>
            <Form.Group className="mb-3">
               <Form.Label className="text-dark">Discount</Form.Label>
              <Form.Control
                type="text"
                name="discount"
                className=""
                value={newCoupon.discount}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
               <Form.Label className="text-dark">Applicable On</Form.Label>
              <Form.Select
                name="applicableOn"
                value={newCoupon.applicableOn}
                onChange={handleInputChange}
              >
                <option>Full Payment</option>
                <option>Partial Payment</option>
                <option>Both</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className="bg-main" onClick={handleAddCoupon}>
            Add 
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Coupons;
