import React from "react";
import { Container, Row, Col} from "react-bootstrap";
import "./HomePage.css";

const HomePage: React.FC = () => {
    return (
        <div className="homepage">
            {/* Секция 1: Заголовок и описание */}
            <section className="hero-section">
                <Container>
                    <Row className="align-items-center text-center text-md-start">
                        <Col md={6}>
                            <h1 className="hero-title">RASA — техприёмка авиационных двигателей</h1>
                            <p className="hero-text">
                                Оформляйте заявки на приёмку и сертификацию авиационных двигателей в несколько кликов.
                                Гарантируем безопасность и соответствие мировым стандартам.
                            </p>
                        </Col>
                        <Col md={6}>
                            <div className="hero-image"></div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Секция 2: Преимущества */}
            <section className="features-section">
                <Container>
                    <Row>
                        <Col md={4} className="feature">
                            <div className="feature-icon">🚀</div>
                            <h3>Быстро</h3>
                            <p>Оформите заявку за пару минут, без лишних бюрократических процедур.</p>
                        </Col>
                        <Col md={4} className="feature">
                            <div className="feature-icon">🔍</div>
                            <h3>Точно</h3>
                            <p>Наши специалисты тщательно проверяют каждый двигатель по строгим стандартам.</p>
                        </Col>
                        <Col md={4} className="feature">
                            <div className="feature-icon">🛠️</div>
                            <h3>Надёжно</h3>
                            <p>Сертифицированная экспертиза с международным признанием.</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Секция 3: CTA */}
            <section className="about-section">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <div className="expert-image"></div>
                        </Col>
                        <Col md={6}>
                            <h2>О нашей команде</h2>
                            <p>
                                Наши эксперты обладают многолетним опытом работы в авиационной индустрии. Мы работаем с
                                ведущими мировыми стандартами качества и безопасности.
                            </p>
                            <p>
                                На фото: главный инженер по сертификации авиационных двигателей, Иван Петров, более 15
                                лет в индустрии.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default HomePage;
