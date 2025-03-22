import { faArrowRightArrowLeft, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

const PaymentDetails = () => {
  const { transactionId } = useParams();

  const data = [
    {
      transactionId: "TXN001",
      name: "John Doe",
      booking_id: "BID123",
      amount: 200,
      status: "Paid",
      date: "2025-01-08",
      creditedAccount: "ACC1001",
      debitedAccount: "ACC2001",
      transactionTime: "2025-01-08 10:00 AM",
    },
    {
      transactionId: "TXN002",
      name: "Alice Johnson",
      booking_id: "BID124",
      amount: 150,
      status: "Pending",
      date: "2025-01-07",
      creditedAccount: "ACC1002",
      debitedAccount: "ACC2002",
      transactionTime: "2025-01-07 02:00 PM",
    },
    {
      transactionId: "TXN003",
      name: "Alice Johnson",
      booking_id: "BID124",
      amount: 150,
      status: "Refunded",
      date: "2025-01-07",
      creditedAccount: "ACC1002",
      debitedAccount: "ACC2002",
      transactionTime: "2025-01-07 02:00 PM",
    },
  ];

  const transaction = data.find((item) => item.transactionId === transactionId);

  if (!transaction) {
    return <div>Transaction not found</div>;
  }

  const downloadPDF = () => {
    const element = document.getElementById("payment-details");
    const options = {
      margin: 1,
      filename: `Transaction-${transaction.transactionId}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <Container style={{ padding: "30px" }}>
      {/* Download PDF Button */}
      <Row>
        <Col className="d-flex justify-content-end  mb-4">
          <Button onClick={downloadPDF}><FontAwesomeIcon icon={faDownload} /></Button>
        </Col>
     </Row>

      <div id="payment-details">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src="https://cdn-icons-png.freepik.com/256/8176/8176383.png?semt=ais_hybrid"
              alt="Credited Account"
              style={{
                borderRadius: "50%",
                border: "2px solid #28a745",
                width: "150px",
                height: "150px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            />
            <p style={{ marginTop: "10px", fontWeight: "bold" }}>
              {transaction.creditedAccount}
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <p
              className="text-primary"
              style={{ fontSize: "1.2rem", fontWeight: "bold" }}
            >
              Payment Process
            </p>
            <FontAwesomeIcon
              icon={faArrowRightArrowLeft}
              className="h3 text-primary"
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2910/2910254.png"
              alt="Debited Account"
              style={{
                borderRadius: "50%",
                border: "2px solid #dc3545",
                width: "150px",
                height: "150px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            />
            <p style={{ marginTop: "10px", fontWeight: "bold" }}>
              {transaction.debitedAccount}
            </p>
          </div>
        </div>

        <Card style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <Card.Body>
            <Card.Title
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "20px",
                color: "#007bff",
              }}
            >
              Transaction Details
            </Card.Title>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <div style={{ width: "45%", marginBottom: "15px" }}>
                <strong>Transaction ID:</strong> {transaction.transactionId}
              </div>
              <div style={{ width: "45%", marginBottom: "15px" }}>
                <strong>User Name:</strong> {transaction.name}
              </div>
              <div style={{ width: "45%", marginBottom: "15px" }}>
                <strong>Booking ID:</strong> {transaction.booking_id}
              </div>
              <div style={{ width: "45%", marginBottom: "15px" }}>
                <strong>Amount:</strong> ${transaction.amount}
              </div>
              <div style={{ width: "45%", marginBottom: "15px" }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      transaction.status === "Paid"
                        ? "#28a745"
                        : transaction.status === "Pending"
                        ? "#ffc107"
                        : "#dc3545",
                  }}
                >
                  {transaction.status}
                </span>
              </div>
              <div style={{ width: "45%", marginBottom: "15px" }}>
                <strong>Transaction Date:</strong> {transaction.date}
              </div>
              <div style={{ width: "45%", marginBottom: "15px" }}>
                <strong>Transaction Time:</strong> {transaction.transactionTime}
              </div>
              <div style={{ width: "45%", marginBottom: "15px" }}>
                <strong>Credited Account:</strong>{" "}
                {transaction.creditedAccount}
              </div>
              <div style={{ width: "45%", marginBottom: "15px" }}>
                <strong>Debited Account:</strong> {transaction.debitedAccount}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default PaymentDetails;
