import React from "react";
import {Card, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Engine} from "../../api/data.ts";
import './EngineCard.css'


interface EngineCardProps {
    engine: Engine;
}

const EngineCard: React.FC<EngineCardProps> = ({engine}) => {
    return (
        <Col key={engine.id} sm={12} md={6} lg={4} className="mb-4">
            <Link to={`/engines/${engine.id}`}>
                <Card className="engines-card">
                    <Card.Img variant="top" src={engine.image_url} alt={engine.title} className="engine-image" />

                    <Card.Body>
                        <Card.Title>{engine.title}</Card.Title>
                    </Card.Body>
                </Card>
            </Link>
        </Col>
    );
};

export default EngineCard;
