import React, {useEffect, useState} from "react";
import {Container, Row, Button, Form, Col} from "react-bootstrap";
import {fetchEngines} from "../../api";
import {Engine} from "../../api/data.ts";
import './EnginesList.css'
import EngineCard from "../../components/EngineCard/EngineCard.tsx";
import iconSearch from '../../assets/img/search.png'

const EnginesList: React.FC = () => {
    const [query, setQuery] = useState("");
    const [engines, setEngines] = useState<Engine[]>([]);

    const updateEngines = async (query: string | undefined) => {
        try {
            const data = await fetchEngines(query)
            console.log(data);
            setEngines(data);
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    };

    useEffect(() => {
        updateEngines(query);
    }, [query]);

    return (
        <Container fluid className="engines-section">
            <Col md={12} lg={10} xl={8}>
                <Row className="engines-header w-100">
                    <h2 className="engines-big-title mb-4">ДВИГАТЕЛИ В НАЛИЧИИ</h2>
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
                    <Button variant="outline-dark" className="search-button" onClick={() => updateEngines(query)}>
                        <img src={iconSearch} alt='Поиск'/>
                    </Button>
                </Form>

                {/* Список двигателей */}
                <Row className="w-100">
                    {engines.length > 0 ? (
                        engines.map((engine) => (
                            <EngineCard key={engine.id} engine={engine}/>
                        ))
                    ) : (
                        <p className="text-center">Ничего не найдено</p>
                    )}
                </Row>
            </Col>
        </Container>
    );
};

export default EnginesList;
