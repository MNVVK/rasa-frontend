import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {Container, Card, Button, Form, Row, Col, Spinner, Alert} from 'react-bootstrap';
import {RootState, AppDispatch} from '../../store';
import {
    getAcceptance,
    deleteEngineFromAcceptance, deleteAcceptance, updateAcceptanceAsync, submitAcceptance, updateEngineAcceptance,
} from '../../slices/draftSlice';
import EngineAcceptanceCard from '../../components/EngineAcceptanceCard/EngineAcceptanceCard';
import './AcceptancePage.css'
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";

const statusTranslations: Record<string, string> = {
    draft: "Черновик",
    deleted: "Удалена",
    formed: "Сформирована",
    completed: "Завершена",
    rejected: "Отклонена"
};

const AcceptancePage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { isAuthenticated } = useSelector((state: RootState) => state.users);
    const {acceptanceData, engineAcceptanceSet, isDraft, loading, error} = useSelector(
        (state: RootState) => state.draft
    );

    const [title, setTitle] = useState("");
    const [name, setName] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        console.log(title)
        if (id) {
            dispatch(getAcceptance(parseInt(id))).then(() => {
                    setTitle(acceptanceData.title || "")
                    setName(acceptanceData.name || "")
                    console.log(title)
                    setIsSaved(Boolean(title?.trim() && name?.trim()));
                }
            )
        }
    }, [id, dispatch]);

    useEffect(() => {
        setReady(Boolean(title?.trim() && name?.trim()));
    }, [title, name]);

    const handleSave = () => {
        if (id) {
            dispatch(updateAcceptanceAsync({
                id: parseInt(id), data: {
                    title: title,
                    name: name
                }
            }));
            setIsSaved(true);
        }
    };

    const handleDelete = async () => {
        if (id) {
            try {
                await dispatch(deleteAcceptance(parseInt(id)));
                navigate('/acceptances');
            } catch (error) {
                console.error('Ошибка при удалении заявки:', error);
            }
        }
    };

    const handleSubmit = async () => {
        if (id) {
            try {
                await dispatch(submitAcceptance(parseInt(id)));
                navigate('/acceptances');
            } catch (error) {
                console.error('Ошибка при формировании заявки:', error);
            }
        }
    };

    const handleUpdateStatus = async (status: string, engineId: number) => {
        console.log(status);
        if (status) {
            dispatch(updateEngineAcceptance(
                {id: engineId, accepted: status}
            ))
        }
    }

    if (loading) {
        return (
            <Container className="mt-5 d-flex justify-content-center align-items-center" style={{minHeight: '200px'}}>
                <Spinner animation="border" variant="primary"/>
                <span className="ms-2">Загрузка...</span>
            </Container>
        );
    }

    if (!isAuthenticated) {
        navigate('/login')
        return
    }

    if (error) {
        if (error.includes('404')) {
            navigate('/not-found');
            return
        }
        if (error.includes('403')) {
            navigate('/forbidden');
            return
        }
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="min-vh-100">
            <Breadcrumbs
                items={[
                    {label: 'Главная', path: '/'},
                    {label: 'Приёмки', path: '/acceptances'},
                    {label: acceptanceData.title || "Приёмка " + acceptanceData.id},
                ]}
            />
            <Row className="justify-content-center mt-5 mb-5">
                <Col sm={12} lg={6}>
                    <Card className="shadow-sm p-4">
                        <h2 className="text-center mb-4">Приёмка {acceptanceData.id}</h2>
                        <hr/>
                        <Form className="acceptance-form">
                            <Row className="justify-content-center align-items-center">
                                <Col md={6} className="align-items-center justify-content-center">
                                    <Row className="mb-3 align-items-center">
                                        <Form.Label className="text-center">Статус: <span>{statusTranslations[acceptanceData.status || 'draft']}</span>
                                        </Form.Label>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Form.Label
                                            className="text-center">Создатель: <span>{acceptanceData.creator}</span></Form.Label>
                                    </Row>
                                    {acceptanceData.formation_date && (
                                        <Row className="mb-3 align-items-center">
                                            <Form.Label
                                                className="text-center">Дата формирования: <span>{new Date(acceptanceData.formation_date).toLocaleDateString()}</span></Form.Label>
                                        </Row>
                                    )}
                                    {acceptanceData.moderator && (
                                        <Row className="mb-3 align-items-between">
                                            <Form.Label
                                                className="text-center">Модератор: <span>{acceptanceData.moderator}</span></Form.Label>
                                        </Row>
                                    )}
                                    {acceptanceData.total_accepted && (
                                        <Row className="mb-3 align-items-center">
                                            <Form.Label
                                                className="text-center">Принятых двигателей: <span>{acceptanceData.total_accepted}</span></Form.Label>
                                        </Row>
                                    )}
                                    <hr/>
                                    <Form.Group controlId="title" className="mb-3">
                                        <Row className="mb-3 align-items-center">
                                            <Form.Label className="text-center">Название</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={(isDraft ? title : acceptanceData.title) || ""}
                                                onChange={(e) => setTitle(e.target.value)}
                                                disabled={!isDraft}
                                            />
                                        </Row>
                                    </Form.Group>
                                    <Form.Group controlId="name" className="mb-3">
                                        <Row className="mb-3 align-items-center">
                                            <Form.Label className="text-center">Имя эксперта</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={(isDraft ? name : acceptanceData.name) || ""}
                                                onChange={(e) => setName(e.target.value)}
                                                disabled={!isDraft}
                                            />
                                        </Row>
                                    </Form.Group>
                                    {
                                        isDraft && (
                                            <Row>
                                                <Button variant="success" onClick={handleSave} disabled={!name || !title}>
                                                    Сохранить данные
                                                </Button>
                                            </Row>
                                        )
                                    }
                                </Col>
                            </Row>
                        </Form>
                        <hr/>
                        <Col className="engine-acceptance-cards mt-4">
                            {engineAcceptanceSet.map((engineAcceptance) => (
                                <EngineAcceptanceCard
                                    key={engineAcceptance.engine.id}
                                    engineAcceptance={engineAcceptance}
                                    isEditable={isDraft}
                                    onDelete={() => dispatch(deleteEngineFromAcceptance(engineAcceptance.engine.id || NaN))}
                                    onChangeStatus={handleUpdateStatus}
                                />
                            ))}
                        </Col>
                        <hr/>
                        {isDraft && (
                            <Row className="justify-content-center align-items-center mt-4 gap-2">
                                <Col sm={12} md={"auto"} className="justify-content-center align-items-center">
                                    <Row>
                                        <Button variant="success" onClick={handleSubmit} disabled={!ready || !isSaved}>
                                            Сформировать
                                        </Button>
                                    </Row>
                                </Col>
                                <Col xs={12} md={"auto"} className="justify-content-center align-items-center">
                                    <Row>
                                        <Button variant="danger" onClick={handleDelete}>
                                            Удалить
                                        </Button>
                                    </Row>
                                </Col>
                            </Row>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AcceptancePage;
