import React, {useState} from "react";
import {Form, Row, Col, Button,} from "react-bootstrap";

interface FilterProps {
    defaultFilter: { status: string; date_start: string; date_end: string }
    onFilterChange: (filter: { status: string; date_start: string; date_end: string }) => void;
}

const AcceptanceFilter: React.FC<FilterProps> = ({ defaultFilter, onFilterChange }) => {
    const [filter, setFilter] = useState({
        status: defaultFilter.status,
        date_start: defaultFilter.date_start,
        date_end: defaultFilter.date_end,
    });

    // Обработчик изменения полей фильтра
    const handleInputChange = (e: React.ChangeEvent<never>) => {
        const { name, value } = e.target;

        setFilter((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    // Отправка фильтра
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange(filter);
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-4 p-3">
            <Row className="g-3">
                {/* Выбор статуса */}
                <Col md={4}>
                    <Form.Group controlId="status">
                        <Form.Label>Статус</Form.Label>
                        <Form.Select name="status" value={filter.status} onChange={handleInputChange}>
                            <option value="">Все</option>
                            <option value="draft">Черновик</option>
                            <option value="deleted">Удалена</option>
                            <option value="formed">Сформирована</option>
                            <option value="completed">Завершена</option>
                            <option value="rejected">Отклонена</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Дата начала */}
                <Col md={4}>
                    <Form.Group controlId="date_start">
                        <Form.Label>Дата начала</Form.Label>
                        <Form.Control type="date" name="date_start" value={filter.date_start}
                                      onChange={handleInputChange}/>
                    </Form.Group>
                </Col>

                {/* Дата окончания */}
                <Col md={4}>
                    <Form.Group controlId="date_end">
                        <Form.Label>Дата окончания</Form.Label>
                        <Form.Control type="date" name="date_end" value={filter.date_end} onChange={handleInputChange}/>
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3">
                <Button variant="outline-dark" type="submit">
                    Применить фильтр
                </Button>
            </div>
        </Form>
    );
};

export default AcceptanceFilter;
