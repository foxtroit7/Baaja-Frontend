import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Card, Row } from "react-bootstrap";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Reviews = ({ user_id }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://35.154.161.226:5000/api/reviews/${user_id}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) fetchReviews();
  }, [user_id]);

  if (loading) return <p className="text-center">Loading reviews...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!data) return <p className="text-center">No reviews found.</p>;

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", padding: "30px" }}>
      <h2 className="mb-4 text-center" style={{ fontWeight: "bold" }}>
        Artist Reviews
      </h2>

      {/* Rating Summary */}
      <div className="mb-4 text-center">
        <h4>
          Average Rating: <span style={{ color: "#f39c12" }}>{data.avg_rating}</span> / 5
        </h4>
        <p>Total Reviews: {data.total_review}</p>
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <p>⭐ 5 Stars: {data.avg_five_star_rating}</p>
          <p>⭐ 4 Stars: {data.avg_four_star_rating}</p>
          <p>⭐ 3 Stars: {data.avg_three_star_rating}</p>
          <p>⭐ 2 Stars: {data.avg_two_star_rating}</p>
          <p>⭐ 1 Star: {data.avg_one_star_rating}</p>
        </div>
      </div>

      {/* Reviews Grid */}
      <Row>
        {data.reviews && data.reviews.length > 0 ? (
          data.reviews.map((review, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <Card
                className="p-3 shadow-lg bg-main"
                style={{
                  borderRadius: "15px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <Card.Body>
                  {/* User Info */}
                  <div className="mb-3">
                    <Card.Title style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                      {review.user_name}
                    </Card.Title>
                    <div>
                      {Array.from({ length: review.rating }, (_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          style={{ color: "#f39c12", marginRight: "3px" }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <Card.Text style={{ fontSize: "1rem", fontStyle: "italic" }}>
                    "{review.review}"
                  </Card.Text>
  {/* User Info */}
                  <div className="mb-2">
                    <Card.Title style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                      {review.user_name} ({review.user_id})
                    </Card.Title>
                    <div>
                      {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          style={{ color: "#f39c12", marginRight: "3px" }}
                        />
                      ))}
                      <span style={{ marginLeft: "5px" }}>{review.rating}</span>
                    </div>
                  </div>

                  {/* Booking & Artist Info */}
                  <div>
                    <p>Artist ID: {review.artist_id}</p>
                    <p>Booking ID: {review.booking_id}</p>
                  </div>
                  {/* Review Images */}
                  {review.file && review.file.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        marginTop: "10px",
                        
                      }}
                    >
                      {review.file.map((img, i) => (
                        <img
                          key={i}
                          src={`http://35.154.161.226:5000/${img}`}
                          alt="review"
                          style={{
                            maxWidth: "200px",
                            height: "auto",
                            borderRadius: "10px",
                            objectFit: "cover",
                            flex: "1 1 45%",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center w-100">No reviews available.</p>
        )}
      </Row>
    </div>
  );
};

export default Reviews;
