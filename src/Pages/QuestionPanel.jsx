import React from "react";
import { Offcanvas, Button, Row, Col } from "react-bootstrap";
import { questionCategories } from "../config/questionTypes";

export default function QuestionPanel({
  showCanvas,
  handleCloseCanvas,
  handleQuestionTypeSelect,
}) {
  return (
    <Offcanvas show={showCanvas} onHide={handleCloseCanvas} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add New Question</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {questionCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-4">
            <h6>{category.category}</h6>
            <Row>
              {category.types.map((question, questionIndex) => (
                <Col xs={4} key={questionIndex} className="mb-3">
                  <Button
                    variant="outline-secondary"
                    className="w-100 h-100 d-flex align-items-center justify-content-start"
                    onClick={() => handleQuestionTypeSelect(question.type)}
                  >
                    <img src={question.icon} alt={question.type} style={{
                      width: "24px", height: "24px", marginRight: "8px",
                    }}
                    />
                    <span>{question.type}</span>
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
