import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Container, Row, Col, Form, Button, Image, Alert, Spinner} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import {getEngineById, updateEngineAsync, uploadEngineImageAsync} from "../../slices/enginesSlice";
import './EngineEditPage.css'
import noImage from "../../assets/img/no_image.png";
import VerticalAttributesTable from "../../components/VerticalAttributesTable/VerticalAttributesTable.tsx";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";

const EngineEditPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {isStaff} = useSelector((state: RootState) => state.users);
    const {engines, loading, error} = useSelector((state: RootState) => state.engines);

    // Локальное состояние формы
    const [engineData, setEngineData] = useState({
        title: "",
        description: "",
        engine_data: "",
        status: "active",
    });

    // Локальное состояние изображения
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const selectedEngine = engines.find((engine) => engine.id === Number(id));

    // Загрузка данных при монтировании
    useEffect(() => {
        if (id) {
            dispatch(getEngineById(parseInt(id)));
        }
    }, [dispatch, id]);

    // Обновление локального состояния при получении данных
    useEffect(() => {
        if (selectedEngine) {
            setEngineData({
                title: selectedEngine.title,
                description: selectedEngine.description || "",
                engine_data: selectedEngine.engine_data || "",
                status: selectedEngine.status || "active",
            });
            setPreviewImage(selectedEngine.image_url || noImage);
        }
    }, [selectedEngine]);

    // Обработчик изменения полей формы
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setEngineData((prev) => ({...prev, [name]: value}));
    };

    // Сохранение данных двигателя
    const handleSave = () => {
        if (id) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            dispatch(updateEngineAsync({id: parseInt(id), updatedEngine: engineData}));
            navigate("/engines");
        }
    };

    // Обработчик загрузки изображения
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Отправка изображения
    const handleUploadImage = async () => {
        if (id && image) {
            setUploading(true);
            await dispatch(uploadEngineImageAsync({id: parseInt(id), file: image}));
            setUploading(false);
        }
    };

    if (!isStaff) {
        navigate('/forbidden')
        return
    }

    return (
        <Container fluid className={"min-vh-100"}>
            <Breadcrumbs
                items={[
                    { label: 'Главная', path: '/' },
                    { label: 'Редактировать двигатели', path: '/engines-table' },
                    { label: selectedEngine ? selectedEngine.title : "Двигатель" },
                ]}
            />
            <h2 className="text-center my-5">Редактирование двигателя</h2>

            {/* Ошибки */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Загрузка */}
            {loading && (
                <div className="text-center">
                    <Spinner animation="border"/>
                    <p>Загрузка...</p>
                </div>
            )}

            {!loading && selectedEngine && (
                <Row className="edit-form g-4 mx-auto">
                    {/* Левая часть – Форма редактирования */}
                    <Col md={4}>
                        <Form className="p-4 border rounded shadow-sm bg-light">
                            <h4>Основные данные</h4>

                            <Form.Group controlId="title" className="mb-3">
                                <Form.Label>Название</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={engineData.title}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="description" className="mb-3">
                                <Form.Label>Описание</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={engineData.description}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="engine_data" className="mb-3">
                                <Form.Label>Данные о двигателе</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="engine_data"
                                    value={engineData.engine_data}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="status" className="mb-3">
                                <Form.Label>Статус</Form.Label>
                                <Form.Select name="status" value={engineData.status} onChange={handleInputChange}>
                                    <option value="active">Активен</option>
                                    <option value="deleted">Удален</option>
                                </Form.Select>
                            </Form.Group>

                            <Button variant="primary" className="w-100" onClick={handleSave}>
                                Сохранить изменения
                            </Button>
                        </Form>
                    </Col>

                    {/* Правая часть – Загрузка изображения */}
                    <Col md={4}>
                        <Form className="p-4 border rounded shadow-sm bg-light">
                            <h4>Изображение</h4>
                            <div className="text-center mb-3">
                                <Image src={previewImage || noImage} alt="Двигатель" fluid rounded/>
                            </div>

                            <Form.Group controlId="image" className="mb-3">
                                <Form.Label>Выберите изображение</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleImageChange}/>
                            </Form.Group>

                            <Button
                                variant="success"
                                className="w-100"
                                onClick={handleUploadImage}
                                disabled={uploading || !image}
                            >
                                {uploading ? "Загрузка..." : "Сохранить изображение"}
                            </Button>
                        </Form>
                    </Col>

                    <Col md={4}>
                        <Form className="px-4 pb-4 border rounded shadow-sm bg-light">
                            <VerticalAttributesTable isEditable={true} engineId={parseInt(id || "")}/>
                        </Form>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default EngineEditPage;
