import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getEngineById } from '../../slices/enginesSlice.ts';
import { RootState } from '../../store';
import noImage from '../../assets/img/no_image.png';
import './EngineDetail.css';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";

const EngineDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const { engines, loading, error } = useSelector((state: RootState) => state.engines);

    useEffect(() => {
        if (id) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            dispatch(getEngineById(parseInt(id)));
        }
    }, [id, dispatch]);

    const engine = engines.find((engine) => engine.id === Number(id));

    if (loading) {
        return <p className="text-center">Загрузка...</p>;
    }

    if (error) {
        return <p className="text-center">Ошибка при загрузке данных: {error}</p>;
    }

    return (
        <Container fluid className="content">
            <Breadcrumbs
                items={[
                    { label: 'Главная', path: '/' },
                    { label: 'Двигатели', path: '/engines' },
                    { label: engine ? engine.title : "Двигатель" },
                ]}
            />
            <section>
                <div className="container">
                    <div className="engine-title-section">
                        <span className="ellipse-title"></span>
                        <h2 className="engine-title">{engine?.title || 'Без названия'}</h2>
                        <span className="ellipse-title"></span>
                    </div>

                    <div className="content-grid">
                        <div className="image-block">
                            <img
                                src={engine?.image_url || noImage}
                                alt={engine?.title || 'Нет изображения'}
                                className="image-block"
                            />
                        </div>
                        <div className="text-block">
                            <p className="description-title">
                                <span className="ellipse-description"></span>
                                Описание
                                <span className="ellipse-description"></span>
                            </p>
                            <p className="description agressive-font">{engine?.description || 'Описание отсутствует'}</p>
                            <p className="engine-data agressive-font">{engine?.engine_data || 'Данные отсутствуют'}</p>
                        </div>
                    </div>
                </div>
            </section>
        </Container>
    );
};

export default EngineDetail;
