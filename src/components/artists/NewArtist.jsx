import React, { useEffect, useState } from "react";
import { Container , Row, Col} from "react-bootstrap";
import { Card } from "react-bootstrap";
import axios from "axios";
import Person from "../../assets/person.jpeg";
import { useParams } from 'react-router-dom';


const NewArtist = () => {
  const { user_id } = useParams();
  const [expandedId, setExpandedId] = useState(null);
  const [user, setUser] = useState(null);
  const [clips, setClips] = useState([]);
  const token = localStorage.getItem("token");
  const [paymentData, setPaymentData] = useState(null);
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://35.154.161.226:5000/api/pending_artist_by_id?user_id=${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", res.data);
      setUser(res.data); // assuming only one user is returned
    } catch (error) {
      console.error("Error fetching artist:", error);
    }
  };

  fetchData();
}, [user_id]);
  useEffect(() => {
    const fetchClips = async () => {
    

      try {
        const response = await axios.get(
          `http://35.154.161.226:5000/api/artist/clips/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClips(response.data);
      } catch (error) {
        console.error("Error fetching clips.");
      }
    };

    fetchClips();
  }, [user_id, token]);
   useEffect(() => {
  const fetchPaymentData = async () => {
    try {
      const response = await fetch(`http://35.154.161.226:5000/api/artist/payment/${user_id}`);
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
      fetchPaymentData();
  }, [user_id, token]);
  const toggleReadMore = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Container>
      {user && (
        <Card
          className="text-center mb-4 p-4 rounded shadow"
         
        >
    <div className="d-flex justify-content-center">
            <img
            src={user.poster || Person}
            alt={user.name}
            className="rounded-circle mb-3"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              border: "3px solid",
            }}
          />
    </div>

          <h3 className="fw-bold text-main">Owner Name: {user.name}</h3>
          <h4 className="fw-bold text-main">Artist Id: {user.user_id}</h4>
          <h4 className="fw-bold  text-main">Profile Name: {user.profile_name}</h4>
          <h5 className="text-main" style={{ fontWeight: 600, fontSize: "1.1rem" }}>
            Category Of Artist: {user.category_name}
          </h5>
          <p className="fw-bold  text-main" style={{ fontWeight: 300, fontSize: "1rem" }}>
          Phone:  {user.phone_number}
          </p>
             <p className="fw-bold  text-main" style={{ fontWeight: 300, fontSize: "1rem" }}>
          Location:  {user.location}
          </p>
             <p className="fw-bold  text-main" style={{ fontWeight: 300, fontSize: "1rem" }}>
          About:  {user.description}
          </p>
          <div>
            {user.items?.map((item) => {
              const isExpanded = expandedId === item.id;
              const previewText = item.desc.length > 300 ? `${item.desc.slice(0, 300)}...` : item.desc;

              return (
                <div
                  key={item.id}
                  className="mb-3 p-3 rounded"
                  style={{ border: "1px solid #dee2e6", backgroundColor: "#ffffff" }}
                >

                  <p className="text-muted" style={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.6 }}>
                    {isExpanded ? item.desc : previewText}
                  </p>
                  {item.desc.length > 100 && (
                    <h5
                      className="text-decoration-none fw-bolder fs-6 text-main"
                      onClick={() => toggleReadMore(item.id)}
                      style={{ cursor: "pointer", fontSize: "0.9rem", textAlign: "right" }}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </h5>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
      <h2 className="text-center text-main mb-3">Artist Clips</h2>
{clips.length > 0 ? (
  <Row className="mt-4">
    {clips.map((clip) => (
      <Col key={clip._id} md={3} className="mb-4">
        <Card
          className="shadow-sm"
          style={{
            transition: "transform 0.2s",
            fontFamily: "'Roboto', sans-serif",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <Card.Body>
            <div className="ratio ratio-16x9 mt-3">
              <video
                src={`http://35.154.161.226:5000/${clip.video}`}
                controls
                style={{ borderRadius: "12px", width: "100%" }}
              ></video>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
) : (
  <p className="text-main text-center">
    No clips submitted or pending approval from admin.
  </p>
)}

            <h2 className="text-center text-main">Artist Payment Charges</h2>
              <Col  md={12}>
                      <Card className="text-center shadow-lg rounded-3 mb-3 position-relative" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
                        <Card.Body>  
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
                            <p className="text-main">No booking charges submitted or pending aprove from admin.</p>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
    </Container>
  );
};

export default NewArtist;
