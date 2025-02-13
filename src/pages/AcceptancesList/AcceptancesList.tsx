import React, {useEffect, useState} from 'react';
import {Table, Container, Spinner, Alert, Col, Row, Button} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store';
import {getAcceptances, moderateAcceptance} from '../../slices/AcceptancesSlice';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";
import {useNavigate} from "react-router-dom";
import AcceptanceFilter from "../../components/AcceptanceFilter/AcceptanceFilter.tsx";
import './AcceptancesList.css'
import linkIcon from '../../assets/img/external-link.png'
import timeIcon from '../../assets/img/time.png'

const statusTranslations: Record<string, string> = {
    draft: "Черновик",
    deleted: "Удалена",
    formed: "Сформирована",
    completed: "Завершена",
    rejected: "Отклонена"
};

const AcceptancesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {isAuthenticated, isStaff} = useSelector((state: RootState) => state.users);
    const {acceptances, loading, error} = useSelector((state: RootState) => state.acceptances);

    const [filter, setFilter] = useState({
        status: '',
        date_start: '',
        date_end: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAcceptances = () => {
            dispatch(getAcceptances(filter));
        };

        fetchAcceptances();

        const interval = setInterval(fetchAcceptances, 5000);

        return () => clearInterval(interval);
    }, [dispatch, filter]);

    const handleModerate = (e: React.MouseEvent, acceptanceId: number, accept: boolean) => {
        e.stopPropagation();
        if (accept) {
            dispatch(moderateAcceptance({id: acceptanceId.toString(), status: 'complete'}));
        } else {
            dispatch(moderateAcceptance({id: acceptanceId.toString(), status: 'reject'}));
        }
    }

    const handleFilterChange = (newFilter: { status: string; date_start: string; date_end: string }) => {
        setFilter(newFilter);
    };

    if (loading) {
        return (
            <Container fluid className="mt-5 text-center min-vh-100">
                <Breadcrumbs
                    items={[
                        {label: 'Главная', path: '/'},
                        {label: 'Приёмки', path: '/acceptances'},
                    ]}
                />
                <Row className="justify-content-center mt-5 mb-5">
                    <Col sm={12} lg={8}>
                        <h2 className="mb-4 text-center">Список приёмок</h2>
                        <Spinner animation="border" variant="primary"/>
                        <p className="mt-2">Загрузка...</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (!isAuthenticated) {
        navigate('/login');
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
                ]}
            />
            <Row className="justify-content-center mt-5 mb-5">
                <Col sm={12} lg={8}>
                    <h2 className="mb-4 text-center">Список приёмок</h2>
                    <AcceptanceFilter defaultFilter={filter} onFilterChange={handleFilterChange}/>
                    <Table striped bordered hover responsive className="mb-5">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Статус</th>
                            <th>Название</th>
                            <th>Имя</th>
                            <th>Создатель</th>
                            <th>Дата</th>
                            <th>Модератор</th>
                            <th>QR</th>
                        </tr>
                        </thead>
                        <tbody>
                        {acceptances.length > 0 ? (
                            acceptances.map((acceptance) => (
                                <tr key={acceptance.id}
                                    onClick={() => navigate(`/acceptances/${acceptance.id}`)}
                                >
                                    <td>{acceptance.id}</td>
                                    <td>{statusTranslations[acceptance.status || 'draft'] || '*'}</td>
                                    <td>{acceptance.title || '*'}</td>
                                    <td>{acceptance.name || '*'}</td>
                                    <td>{acceptance.creator || '*'}</td>
                                    <td>{acceptance.formation_date ? new Date(acceptance.formation_date).toLocaleDateString() : '*'}</td>
                                    <td>{acceptance.moderator || isStaff && (
                                        <th>{(acceptance.status === 'formed') ?
                                            <div>
                                                <Button
                                                    variant={"outline-success"}
                                                    className="mb-2"
                                                    onClick={(e) => handleModerate(e, acceptance.id || NaN, true)}>Принять</Button>
                                                <Button
                                                    variant={"outline-danger"}
                                                    onClick={(e) => handleModerate(e, acceptance.id || NaN, false)}>Отклонить</Button>
                                            </div>
                                            : <div>*</div>}</th>
                                    )
                                    }</td>
                                    <td>
                                        <div className="dinner-icon">
                                            {acceptance.status === 'completed' ? (
                                                <div className="qr-hover-wrapper">
                                                    <img className="status-icon" src={linkIcon} alt="QR Icon"/>
                                                    <div className="qr-hover">
                                                        {acceptance.qr && <img className="qr-code"
                                                                               src={`data:image/png;base64,${acceptance.qr}`}
                                                                               alt="QR Code"/>}
                                                        <p>Принято двигателей: {acceptance.total_accepted}</p>
                                                    </div>
                                                </div>

                                            ) : (
                                                <img className="status-icon" src={timeIcon} alt="Time Icon"/>
                                            )}
                                        </div>
                                    </td>

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
