import React, { useState } from "react";
import { Modal, Button, Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSlash } from "@fortawesome/free-solid-svg-icons";
import Person from "../../assets/person.jpeg";

const NewArtist = () => {
  // States for expanded descriptions
  const [expandedId, setExpandedId] = useState(null);

  // Toggle Read More/Read Less
  const toggleReadMore = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const users = [
    {
      id: "1",
      name: "John Doe",
      profilePicture: Person,
      phone: "123-456-7890",
      categoryOrdered: "Singer",
      items: [
        {
          id: "a1",
          title: "Performance Details",
          desc:
            "The sitar’s captivating tones and deep cultural roots make it a symbol of Indian heritage and artistry. The sitar is a classical string instrument widely associated with Indian music, known for its distinctive, resonant sound. A sitar player, often referred to as a sitarist, uses a combination of plucking techniques and intricate fingerwork to create melodic and rhythmic patterns.",
        },
      ],
      videos: [
        { title: "Learning Flute", videoId: "https://www.youtube.com/embed/mGC-S7n_HkE?si=e_JnQ4RLSl5mGKJj" },
        { title: "Best Flute Music", videoId: "https://www.youtube.com/embed/Cnfj6QCGLyA?si=QpaKcjXeyAvjZsYm" },
        { title: "Instrumental Song", videoId: "https://www.youtube.com/embed/73vpHngEQpA?si=-u5wTeNORaamRfbo" },
        { title: "Flute Event", videoId: "https://www.youtube.com/embed/bLpHR0xL_Xo?si=wl_idfeczT0WPv1E" },
      ],
    },
  ];

  return (
    <Container>
      {users.map((user) => (
        <div
          key={user.id}
          className="text-center mb-4 p-4 rounded shadow"
          style={{
            backgroundColor: "#f8f9fa",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          <img
            src={user.profilePicture}
            alt={user.name}
            className="rounded-circle mb-3"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              border: "3px solid #007bff",
            }}
          />

          <h3 className="fw-bold">Owner Name: {user.name}</h3>
          <h5
            className="text-primary"
            style={{
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            Category Of Artist: {user.categoryOrdered}
          </h5>
          <p
            className="text-muted"
            style={{
              fontWeight: 300,
              fontSize: "1rem",
              margin: "0 0 15px",
            }}
          >
            {user.phone}
          </p>

          <h5 className="text-secondary fw-bold">About:</h5>
          <div>
            {user.items.map((item) => {
              const isExpanded = expandedId === item.id;
              const previewText =
                item.desc.length > 300 ? `${item.desc.slice(0, 300)}...` : item.desc;

              return (
                <div
                  key={item.id}
                  className="mb-3 p-3 rounded"
                  style={{
                    border: "1px solid #dee2e6",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <h5 className="fw-bold text-dark">{item.title}</h5>
                  <p
                    className="text-muted"
                    style={{
                      fontWeight: 400,
                      fontSize: "1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {isExpanded ? item.desc : previewText}
                  </p>
                  {item.desc.length > 100 && (
                    <h5
                      className="text-decoration-none fw-bolder fs-6 text-primary"
                      onClick={() => toggleReadMore(item.id)}
                      style={{
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        textAlign: "right",
                      }}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </h5>
                  )}
                </div>
              );
            })}
          </div>

          {/* Videos Section */}
          <Row className="mt-4">
            {user.videos.map((video, index) => (
              <Col key={index} md={3} className="mb-4">
                <Card
                  className="shadow-sm"
                  style={{
                    transition: "transform 0.2s",
                    fontFamily: "'Roboto', sans-serif",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        color: "#343a40",
                        textAlign: "center",
                      }}
                    >
                      {video.title}
                    </Card.Title>
                    <div className="ratio ratio-16x9 mt-3">
                      <iframe
                        src={video.videoId}
                        title={video.title}
                        style={{ borderRadius: "12px" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <Button
                      href={video.videoId}
                      target="_blank"
                      variant="primary"
                      style={{
                        marginTop: "15px",
                        width: "100%",
                        backgroundColor: "#28a745",
                        border: "none",
                        fontWeight: "bold",
                        borderRadius: "8px",
                      }}
                    >
                      Watch on YouTube
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default NewArtist;
