import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { Card, Container, Row, Col} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faMoneyBill} from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import ApppointmentScheduler from './ApppointmentScheduler';
import Clips from './Cips'
import 'react-toastify/dist/ReactToastify.css';
import Reviews from './Reviews';
import Booking from './Booking';
const ArtistProfile = () => {
  const { user_id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const fetchArtist = async (user_id, setArtist, setLoading) => {
    setLoading(true);

    try {
        const token = localStorage.getItem("token"); // Get token from localStorage

        if (!token) {
            toast.error("Unauthorized! Please log in again.");
            setLoading(false);
            return;
        }

        const response = await fetch(
            `http://15.206.194.89:5000/api/artists_details?artist_id=${user_id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ✅ Pass token in Authorization header
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch artist details");
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            setArtist(data[0]); // ✅ Extract first object from array
        } else {
            setArtist(null); // ✅ Handle case when no artist is found
        }
    } catch (error) {
        console.error("Error fetching artist:", error);
        toast.error(error.message || "Failed to load artist details.");
        setArtist(null);
    } finally {
        setLoading(false);
    }
};
const fetchPaymentData = async (user_id) => {
  try {
    const response = await fetch(`http://15.206.194.89:5000/api/artist/payment/${user_id}`);
    const data = await response.json();

    if (response.ok) {
      setPaymentData(data.artistPayments);
    } else {
      setPaymentData(null);
      console.error("Error fetching payment data:", data.message);
    }
  } catch (err) {
    console.error("Error:", err);
    setPaymentData(null);
  }
};


  
  useEffect(() => {
    setLoading(true);
    fetchArtist(user_id, setArtist, setLoading);

    fetchPaymentData(user_id);
  }, [user_id]);
  if (loading) {
    return <h2 className="text-center mt-5">Loading artist details...</h2>;
  }

  if (!artist) {
    return <h2 className="text-center mt-5">Artist not found</h2>;
  }


  return (
    <Container className="mt-4">
      <ToastContainer />
      
      {/* Profile Section */}
{artist ? (
  <>
    <div className="text-center mb-4 p-4 rounded shadow" style={{ backgroundColor: '#f8f9fa' }}>
  

      <img
         src={`http://15.206.194.89:5000/${artist.poster}`}
        alt={artist.owner_name}
        className=" mb-3"
        width={120}
        height={140}
        rounded
        style={{ objectFit: 'cover', border: '2px solid #007bff' }}
      />
      <h3 className="fw-bold">Owner Name: {artist.owner_name}</h3>
      <h5 className="text-primary">Category: {artist.category_type}</h5>
      <h6 className="text-muted">{artist.location}</h6>

      <h5>
        Rating: {Array.from({ length: 5 }, (_, i) => (i < artist.rating ? "⭐" : "☆")).join("")}
      </h5>

      <h5 className="text-dark">Experience: {artist.experience}</h5>
      <h5 className="text-secondary fw-bold">About:</h5>
      <p className="text-muted">{artist.description}</p>

      <div>
      </div>
    </div>

    {/* Statistics Cards */}
    <Row className="g-4 mt-4 mb-4">
      <Col md={6}>
        <Card className="text-center shadow-lg rounded-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
          <Card.Body>
            <FontAwesomeIcon icon={faTruck} className="fs-3 text-primary mb-3" />
            <Card.Title>Total Bookings</Card.Title>
            <Card.Text style={{ fontWeight: '500', fontSize: '18px' }}>{artist.total_bookings}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="text-center shadow-lg rounded-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
          <Card.Body>
            <FontAwesomeIcon icon={faMoneyBill} className="fs-3 text-success mb-3" />
            <Card.Title>Total Money</Card.Title>
            <Card.Text style={{ fontWeight: '500', fontSize: '18px' }}>{artist.total_money}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
    {/* <Col md={12}>
        <Card className="text-center shadow-lg rounded-3 mb-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
          <Card.Body>
            <FontAwesomeIcon icon={faTruck} className="fs-3 text-primary mb-3" />
            <Card.Title>required Services</Card.Title>
            <div>
  {artist.required_services.map((service, index) => (
    <span key={index} className="badge bg-primary me-2 mb-2">
      {service}
    </span>
  ))}
</div>

          </Card.Body>
        </Card>
      </Col> */}
      <Row>
  <Col md={6}>
    <Card className="text-center shadow-lg rounded-3 mb-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
      <Card.Body>
        <FontAwesomeIcon icon={faTruck} className="fs-3 text-primary mb-3" />
        <Card.Title>Required Services</Card.Title>
        <div>
          {artist.required_services.map((service, index) => (
            <span key={index} className="badge bg-primary me-2 mb-2">{service}</span>
          ))}
        </div>
      </Card.Body>
    </Card>
  </Col>

  <Col md={6}>
    <Card className="text-center shadow-lg rounded-3 mb-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
      <Card.Body>
        <FontAwesomeIcon icon={faMoneyBill} className="fs-3 text-success mb-3" />
        <Card.Title>Booking Charges of Artist</Card.Title>
        {paymentData ? (
          <div className="text-start">
            <p>First Day: ₹{paymentData.first_day_booking}</p>
            <p>Second Day: ₹{paymentData.second_day_booking}</p>
            <p>Third Day: ₹{paymentData.third_day_booking}</p>
            <p>Fourth Day: ₹{paymentData.fourth_day_booking}</p>
            <p>Fifth Day: ₹{paymentData.fifth_day_booking}</p>
            <p>Sixth Day: ₹{paymentData.sixth_day_booking}</p>
            <p>Seventh Day: ₹{paymentData.seventh_day_booking}</p>
          </div>
        ) : (
          <p className="text-muted">No booking charges available.</p>
        )}
      </Card.Body>
    </Card>
  </Col>
</Row>

    </Row>
  </>
) : (
  <p className="text-center text-danger">No artist found.</p> // ✅ Show message if no artist is found
)}

      <ApppointmentScheduler artist_id={user_id} />
      <Clips user_id={user_id}/>
      <Booking artist_id={user_id}  />
      <Reviews user_id={user_id} />
    </Container>
  );
};

export default ArtistProfile;
