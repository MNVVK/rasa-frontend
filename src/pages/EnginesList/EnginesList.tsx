import React, {useEffect, useState} from "react";
import {Container, Row, Button, Form, Col} from "react-bootstrap";
import './EnginesList.css';
import EngineCard from "../../components/EngineCard/EngineCard.tsx";
import iconSearch from '../../assets/img/search.png';
import {AppDispatch} from "../../store.ts";
import {useDispatch, useSelector} from "react-redux";
import {getEnginesList} from "../../slices/enginesSlice.ts";
import {setEngineTitle} from "../../slices/enginesSlice.ts";
import {RootState} from "../../store";
import AcceptanceButton from "../../components/AcceptanceButton/AcceptanceButton.tsx";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";
import {PencilSquare} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";

const EnginesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {engines, loading, engineTitle} = useSelector((state: RootState) => state.engines);
    const {id, enginesCount} = useSelector((state: RootState) => state.draft)
    const {isStaff} = useSelector((state: RootState) => state.users)

    const [query, setQuery] = useState(engineTitle);

    const navigate = useNavigate();

    const handleSearch = (query: string) => {
        dispatch(setEngineTitle(query));
        dispatch(getEnginesList());
    };

    useEffect(() => {
        dispatch(getEnginesList());
    }, [engineTitle, dispatch]);

    return (
        <Container fluid className="engines-section">
            <Breadcrumbs
                items={[
                    {label: 'Главная', path: '/'},
                    {label: 'Двигатели', path: '/engines'},
                ]}
            />
            {
                isStaff && (
                    <Button variant="outline-dark" onClick={() => {
                        navigate('/engines-table')
                    }}>
                        <PencilSquare/> Редактировать
                    </Button>
                )
            }
            <Col className="align-items-center main-col">
                <Row className="engines-header w-100 justify-content-between">
                    <Col><h2 className="engines-big-title mb-4">ДВИГАТЕЛИ В НАЛИЧИИ</h2></Col>
                    <Col><AcceptanceButton draftId={id} draftCount={enginesCount}/></Col>
                </Row>
                {/* Форма поиска */}
                <Form className="d-flex search-form" onSubmit={(e) => e.preventDefault()}>
                    <Form.Control
                        type="text"
                        placeholder="Поиск двигателя..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />
                    <Button variant="outline-dark" className="search-button" onClick={() => handleSearch(query)}>
                        <img src={iconSearch} alt='Поиск'/>
                    </Button>
                </Form>

                {/* Список двигателей */}
                <Row className="align-items-center w-100">
                    {loading ? (
                        <p className="text-center">Загрузка...</p>
                    ) : engines.length > 0 ? (
                        engines.map((engine) => (
                                engine.status === 'active' && (
                                    <EngineCard key={engine.id} engine={engine}/>
                                )
                            )
                        )) : (
                        <p className="text-center">Ничего не найдено</p>
                    )}
                </Row>
            </Col>
        </Container>
    );
};

export default EnginesList;
