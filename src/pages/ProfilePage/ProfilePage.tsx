import React, { useState } from 'react';
import {Container, Card, Button, Modal, Form, Alert} from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import './ProfilePage.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAsync } from '../../slices/usersSlice';
import { RootState, AppDispatch } from '../../store';
import {useNavigate} from "react-router-dom";

const ProfilePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.users);
    const { id, username, error } = useSelector((state: RootState) => state.users);

    const [login, setLogin] = useState(username);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const navigate = useNavigate();

    const handleEditLogin = () => {
        dispatch(updateUserAsync({ id, username: login }))
            .then((result) => {
                if (result.meta.requestStatus === 'fulfilled') {
                    console.log('Login updated successfully');
                } else {
                    console.error('Failed to update login');
                }
            });
    };

    const handleChangePassword = () => {
        dispatch(updateUserAsync({ id, password: newPassword }))
            .then((result) => {
                if (result.meta.requestStatus === 'fulfilled') {
                    console.log('Password changed successfully');
                    setShowPasswordModal(false);
                } else {
                    console.error('Failed to change password');
                }
            });
    };

    if (!isAuthenticated) {
        navigate('/login');
        return
    }

    if (error) {
        if (error.includes('404')) {
            navigate('/not-found');
            return
        }
        if (error.includes('403')) {
            navigate('/forbidden');
            return
        }
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4 profile-card shadow">
                <h2 className="text-center mb-4">Профиль</h2>
                <div className="mb-4 profile-info d-flex flex-column align-items-center">
                    <Form.Label>Имя пользователя</Form.Label>
                    <Form.Control
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="profile-input"
                    />
                    <Button variant="outline-primary" className="mt-3" onClick={handleEditLogin}>
                        <PencilSquare /> Сохранить
                    </Button>
                </div>
                <Button variant="warning" onClick={() => setShowPasswordModal(true)}>
                    Изменить пароль
                </Button>

                {/* Модальное окно для изменения пароля */}
                <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} size="lg" centered className='modal'>
                    <Modal.Header closeButton>
                        <Modal.Title>Изменить пароль</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="newPassword" className="mb-4">
                                <Form.Label>Новый пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Введите новый пароль"
                                    className="password-input"
                                    required
                                />
                            </Form.Group>
                            {error && <p className="text-danger text-center">{error}</p>}
                            <Button variant="primary" className="w-100" onClick={handleChangePassword}>
                                Сохранить
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Card>
        </Container>
    );
};

export default ProfilePage;
