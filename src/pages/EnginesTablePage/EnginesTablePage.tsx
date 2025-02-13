import React, {useEffect, useState} from "react";
import {Table, Container, Spinner, Alert, Image, Col, Row, Button} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import {getEnginesList} from "../../slices/enginesSlice";
import noImage from "../../assets/img/no_image.png";
import {useNavigate} from "react-router-dom";
import {PencilSquare} from "react-bootstrap-icons";
import EngineCreateModal from "../../components/EngineCreateModal/EngineCreateModal.tsx";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";

const EnginesTablePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {isStaff} = useSelector((state: RootState) => state.users);
    const {engines, loading, error} = useSelector((state: RootState) => state.engines);

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    // Загружаем список двигателей при загрузке страницы
    useEffect(() => {
        dispatch(getEnginesList());
    }, [dispatch]);

    if (!isStaff) {
        navigate('/forbidden')
        return
    }

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border"/>
                <p>Загрузка...</p>
            </div>
        )
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
                    { label: 'Главная', path: '/' },
                    { label: 'Редактировать двигатели', path: '/engines-table' },
                ]}
            />
            <Row className="justify-content-center mt-5 mb-5">
                <Col sm={12} lg={8}>
                    <h2 className="mt-5 text-center">Список двигателей</h2>
                    <Button variant={"outline-dark"} className="mx-auto mb-4" onClick={() => setShowModal(true)}>
                        Добавить двигатель
                    </Button>
                    <EngineCreateModal show={showModal} onHide={() => setShowModal(false)} />
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Статус</th>
                            <th>Изображение</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {engines ? engines.map((engine) => (
                            <tr key={engine.id}>
                                <td>{engine.id}</td>
                                <td>{engine.title}</td>
                                <td>{engine.description || "—"}</td>
                                <td>{engine.status === "active" ? "Активен" : "Удален"}</td>
                                <td>
                                    <Image
                                        src={engine.image_url || noImage}
                                        alt={engine.title}
                                        width={80}
                                        height={60}
                                        className="rounded"
                                    />
                                </td>
                                <td>
                                    <Button onClick={() => {navigate('/engines/' + engine.id + '/edit')}}><PencilSquare></PencilSquare></Button>
                                </td>
                            </tr>
                        )) : <div>Нет данных</div>}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default EnginesTablePage;
