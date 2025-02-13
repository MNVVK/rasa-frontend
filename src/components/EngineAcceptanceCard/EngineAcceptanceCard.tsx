import React from 'react';
import {Card, Button, Form, Row, Col} from 'react-bootstrap';
import './EngineAcceptanceCard.css';
import {EngineAcceptance} from '../../api/Api.ts';
import noImage from '../../assets/img/no_image.png';

interface EngineAcceptanceCardProps {
    engineAcceptance: EngineAcceptance;
    isEditable: boolean;
    onDelete: () => void;
    onChangeStatus?: (status: 'accepted' | 'rejected', engineId: number) => void;
}

const EngineAcceptanceCard: React.FC<EngineAcceptanceCardProps> = ({
                                                                       engineAcceptance,
                                                                       isEditable,
                                                                       onDelete,
                                                                       onChangeStatus
                                                                   }) => {
    const {engine, accepted} = engineAcceptance;
    return (
        <Card className="engine-acceptance-card shadow-sm mb-3 p-2">
            <Row className="align-items-center">
                <Col xs={3} className="d-flex justify-content-center">
                    <Card.Img src={engine.image_url || noImage} alt={engine.title} className="engine-image"/>
                </Col>
                <Col xs={6}>
                    <Card.Body>
                        <Card.Title className="mb-1">{engine.title}</Card.Title>
                        <Card.Text className="small-text">{engine.description}</Card.Text>
                    </Card.Body>
                </Col>
                <Col xs={3} className="d-flex flex-column align-items-end">
                    <Form.Group controlId={`status-${engine.id}`} className="mb-2">
                        <Form.Label className="small-text">Статус</Form.Label>
                        <Form.Select
                            size="sm"
                            defaultValue={accepted}
                            disabled={!isEditable}
                            onChange={(e) => onChangeStatus && onChangeStatus(e.target.value as 'accepted' | 'rejected', engine.id || NaN)}
                        >
                            <option value="accepted">Принято</option>
                            <option value="rejected">Отклонено</option>
                        </Form.Select>
                    </Form.Group>
                    {isEditable && (
                        <Button variant="danger" size="sm" onClick={onDelete}>
                            Удалить
                        </Button>
                    )}
                </Col>
            </Row>
        </Card>
    );
};

export default EngineAcceptanceCard;
