import React, { useState } from "react";
import { Modal, Button, Form, Image, Spinner, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { addEngineAsync, uploadEngineImageAsync } from "../../slices/enginesSlice";
import noImage from "../../assets/img/no_image.png";

interface EngineCreateModalProps {
    show: boolean;
    onHide: () => void;
}

const EngineCreateModal: React.FC<EngineCreateModalProps> = ({ show, onHide }) => {
    const dispatch = useDispatch<AppDispatch>();

    // Состояние формы
    const [engineData, setEngineData] = useState({
        title: "",
        description: "",
        engine_data: "",
        status: "active",
    });

    // Состояние загрузки изображения
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(noImage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Обработчик изменения полей формы
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEngineData((prev) => ({ ...prev, [name]: value }));
    };

    // Обработчик загрузки изображения
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Отправка формы
    const handleCreateEngine = async () => {
        setLoading(true);
        setError(null);

        try {
            // Создание двигателя
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const result = await dispatch(addEngineAsync(engineData)).unwrap();

            if (image) {
                // Если есть изображение, загружаем его
                const formData = new FormData();
                formData.append("image", image);
                await dispatch(uploadEngineImageAsync({ id: result.id || NaN, file: image }));
            }

            onHide(); // Закрываем модалку
        } catch (err) {
            setError("Ошибка при создании двигателя");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Создание двигателя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Основная форма */}
                <Form>
                    <Form.Group controlId="title" className="mb-3">
                        <Form.Label>Название</Form.Label>
                        <Form.Control type="text" name="title" value={engineData.title} onChange={handleInputChange} />
                    </Form.Group>

                    <Form.Group controlId="description" className="mb-3">
                        <Form.Label>Описание</Form.Label>
                        <Form.Control as="textarea" rows={2} name="description" value={engineData.description} onChange={handleInputChange} />
                    </Form.Group>

                    <Form.Group controlId="engine_data" className="mb-3">
                        <Form.Label>Данные о двигателе</Form.Label>
                        <Form.Control as="textarea" rows={2} name="engine_data" value={engineData.engine_data} onChange={handleInputChange} />
                    </Form.Group>

                    <Form.Group controlId="status" className="mb-3">
                        <Form.Label>Статус</Form.Label>
                        <Form.Select name="status" value={engineData.status} onChange={handleInputChange}>
                            <option value="active">Активен</option>
                            <option value="deleted">Удален</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Форма загрузки изображения */}
                    <Form.Group controlId="image" className="mb-3">
                        <Form.Label>Изображение</Form.Label>
                        <div className="text-center mb-3">
                            <Image src={previewImage || noImage} alt="Двигатель" fluid rounded />
                        </div>
                        <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button variant="success" onClick={handleCreateEngine} disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : "Создать"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EngineCreateModal;
