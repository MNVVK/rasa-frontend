import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { registerUserAsync } from '../../slices/usersSlice';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';

const RegistrationPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { error } = useSelector((state: RootState) => state.users);
    const loading = false;

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUserAsync({ username: login, password })).then((result: { meta: { requestStatus: string; }; }) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/login');
            }
        });
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4 registration-card shadow">
                <h2 className="text-center mb-4">Регистрация в RASA</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="login" className="mb-3">
                        <Form.Label>Имя пользователя</Form.Label>
                        <Form.Control
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Зарегистрироваться'}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default RegistrationPage;
