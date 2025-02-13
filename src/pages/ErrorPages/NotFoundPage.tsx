import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ErrorPages.css";
import notFoundImage from "../../assets/img/404.png"; // Добавьте картинку в assets

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container fluid className="error-container text-center">
            <img src={notFoundImage} alt="404 Not Found" className="error-image"  width={300} height={300} />
            <h1 className="error-title">404</h1>
            <p className="error-text">Страница не найдена.</p>
            <Button variant="outline-dark" onClick={() => navigate("/")}>
                Вернуться на главную
            </Button>
        </Container>
    );
};

export default NotFoundPage;
