import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import {Engine} from "../../api/data.ts";
import {fetchEngineById} from "../../api";
import noImage from '../../assets/img/no_image.png'
import './EngineDetail.css';

const EngineDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [engine, setEngine] = useState<Engine>({description: "", engine_data: "", id: 0, image_url: noImage, title: ""});

    const updateEngine = async () => {
        try {
            const data = await fetchEngineById(id)
            console.log(data);
            setEngine(data);
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    };

    useEffect(() => {
        updateEngine();
    }, [id]);

    return (
        <Container fluid className="content">
                <section>
                    <div className="container">
                        <div className="engine-title-section">
                            <span className="ellipse-title"></span>
                            <h2 className="engine-title">{engine.title}</h2>
                            <span className="ellipse-title"></span>
                        </div>

                        <div className="content-grid">
                            <div className="image-block">
                                <img
                                    src={engine.image_url || noImage}
                                    alt={engine.title}
                                    className="image-block"
                                />
                            </div>
                            <div className="text-block">
                                <p className="description-title">
                                    Описание <span className="ellipse-description"></span> Description
                                </p>
                                <p className="description agressive-font">{engine.description}</p>
                                <p className="engine-data agressive-font">{engine.engine_data}</p>
                            </div>
                        </div>
                    </div>
                </section>
        </Container>
    )
};

export default EngineDetail;
