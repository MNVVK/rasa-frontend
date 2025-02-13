import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ErrorPages.css";
import forbiddenImage from "../../assets/img/403.png"; // Добавьте картинку в assets

const ForbiddenPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container fluid className="error-container text-center">
            <img src={forbiddenImage} alt="403 Forbidden" className="error-image" width={300} height={300} />
            <h1 className="error-title">403</h1>
            <p className="error-text">У вас нет доступа к этой странице.</p>
            <Button variant="outline-dark" onClick={() => navigate("/")}>
                Вернуться на главную
            </Button>
        </Container>
    );
};

export default ForbiddenPage;
