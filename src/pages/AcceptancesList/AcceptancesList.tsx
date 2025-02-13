import React, {useEffect, useState} from 'react';
import {Table, Container, Spinner, Alert, Col, Row} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store';
import {getAcceptances} from '../../slices/AcceptancesSlice';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";
import {useNavigate} from "react-router-dom";

const AcceptancesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {acceptances, loading, error} = useSelector((state: RootState) => state.acceptances);

    const [filter] = useState({
        status: '',
        date_start: '',
        date_end: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAcceptances({}));
    }, [dispatch, filter]);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary"/>
                <p className="mt-2">Загрузка...</p>
            </Container>
        );
    }

    if (error) {
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
                ]}
            />
            <Row className="justify-content-center mt-5 mb-5">
                <Col sm={12} lg={8}>
                    <h2 className="mb-4 text-center">Список приёмок</h2>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Статус</th>
                            <th>Название</th>
                            <th>Имя</th>
                            <th>Создатель</th>
                            <th>Дата формирования</th>
                            <th>Модератор</th>
                            <th>Всего принято</th>
                        </tr>
                        </thead>
                        <tbody>
                        {acceptances.length > 0 ? (
                            acceptances.map((acceptance) => (
                                <tr key={acceptance.id}
                                    onClick={() => navigate(`/acceptances/${acceptance.id}`)}
                                >
                                    <td>{acceptance.id}</td>
                                    <td>{acceptance.status || '*'}</td>
                                    <td>{acceptance.title || '*'}</td>
                                    <td>{acceptance.name || '*'}</td>
                                    <td>{acceptance.creator || '*'}</td>
                                    <td>{acceptance.formation_date ? new Date(acceptance.formation_date).toLocaleDateString() : '*'}</td>
                                    <td>{acceptance.moderator || '*'}</td>
                                    <td>{acceptance.total_accepted ?? '*'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center">Нет данных</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default AcceptancesList;
