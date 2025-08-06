import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Card } from "react-bootstrap";
import axios from "axios";
import Person from "../../assets/person.jpeg";
import { useParams } from 'react-router-dom';
import Clips from './Cips';

const NewArtist = () => {
  const { user_id } = useParams();
  const [expandedId, setExpandedId] = useState(null);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://35.154.161.226:5000/api/pending_artists_details?user_id=${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", res.data);
      setUser(res.data[0]); // assuming only one user is returned
    } catch (error) {
      console.error("Error fetching artist:", error);
    }
  };

  fetchData();
}, [user_id]);


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
            Category Of Artist: {user.category_type}
          </h5>
          <h6>Location: {user.location}</h6>

          <p className="text-muted" style={{ fontWeight: 300, fontSize: "1rem" }}>
            {user.phone}
          </p>

          <h5 className="text-main fw-bold">About: {user.description}</h5>

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

      <Clips user_id={user_id} />
    </Container>
  );
};

export default NewArtist;
