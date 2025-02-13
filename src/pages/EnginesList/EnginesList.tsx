import React, {useEffect, useState} from "react";
import {Container, Row, Button, Form} from "react-bootstrap";
import {fetchEngines} from "../../api";
import {Engine} from "../../api/data.ts";
import './EnginesList.css'
import EngineCard from "../../components/EngineCard/EngineCard.tsx";
import iconSearch from '../../assets/img/search.png'
import {AppDispatch} from "../../store.ts";
import {useDispatch, useSelector} from "react-redux";
import {setEngineTitle} from "../../slices/enginesSlice.ts";

const EnginesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const engineTitle = useSelector((state: any) => state.engines.engineTitle);

    const [query, setQuery] = useState(engineTitle);
    const [engines, setEngines] = useState<Engine[]>([]);

    const handleSearch = (query: string) => {
        dispatch(setEngineTitle(query));
    }

    useEffect(() => {
        const updateEngines = async (query: string | undefined) => {
            try {
                const data = await fetchEngines(query)
                console.log(data);
                setEngines(data);
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            }
        };

        updateEngines(engineTitle);
    }, [engineTitle]);

    return (
        <Container fluid className="engines-section">
            <div className="d-flex flex-column align-items-center main-col">
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
                    <Button variant="outline-dark" className="search-button" onClick={() => {handleSearch(query)}}>
                        <img src={iconSearch} alt='Поиск'/>
                    </Button>
                </Form>

                {/* Список двигателей */}
                <Row className="align-items-center w-100">
                    {engines.length > 0 ? (
                        engines.map((engine) => (
                            <EngineCard key={engine.id} engine={engine}/>
                        ))
                    ) : (
                        <p className="text-center">Ничего не найдено</p>
                    )}
                </Row>
            </div>
        </Container>
    );
};

export default EnginesList;
