import React from "react";
import {Button, Card, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Engine} from "../../api/Api.ts";
import './EngineCard.css'
import noImage from '../../assets/img/no_image.png'
import {AppDispatch, RootState} from "../../store.ts";
import {useDispatch, useSelector} from "react-redux";
import {addEngineToAcceptance} from "../../slices/draftSlice.ts";
import {getEnginesList} from "../../slices/enginesSlice.ts";


interface EngineCardProps {
    engine: Engine;
}

const EngineCard: React.FC<EngineCardProps> = ({engine}) => {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated);


    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (engine.id) {
            await dispatch(addEngineToAcceptance(engine.id));
            await dispatch(getEnginesList());
        }
    };


    return (
        <Col key={engine.id} sm={12} md={6} lg={4} className="mb-4">
            <Link to={`/engines/${engine.id}`}>
                <Card className="engines-card">
                    <Card.Img variant="top" src={engine.image_url || noImage} alt={engine.title}
                              className="engine-image"/>
                    <Card.Body>
                        <Card.Title>{engine.title}</Card.Title>
                        {
                            isAuthenticated && (
                                <div className="engine-actions">
                                    <Button variant="dark" onClick={handleAdd}>Добавить</Button>
                                </div>
                            )
                        }
                    </Card.Body>
                </Card>
            </Link>
        </Col>
    );
};

export default EngineCard;
