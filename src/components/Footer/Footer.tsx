import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark text-light py-4">
            <Container>
                <Row className="align-items-center">
                    <Col md={6}>
                        <p className="mb-0">Коровин Кирилл 2024</p>
                    </Col>
                    <Col md={6} className="text-end">
                        <a href="#" className="text-light mx-2">VK</a>
                        <a href="#" className="text-light mx-2">Telegram</a>
                        <a href="#" className="text-light mx-2">GitHub</a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
