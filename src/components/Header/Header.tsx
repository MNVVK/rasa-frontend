import React from "react";
import {Container, Navbar, Nav, NavbarBrand, NavbarToggle, NavbarCollapse, Button} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import './Header.css';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store.ts";
import { logoutUserAsync } from "../../slices/usersSlice";

const Header: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { username, isAuthenticated } = useSelector((state: RootState) => state.users);

    const handleLogout = () => {
        dispatch(logoutUserAsync()).then(() => navigate("/"));
    };

    return (
        <Navbar className="sticky-top header" expand="lg">
            <Container>
                <NavbarBrand as={Link} to="/">
                    <h1 className="logo">RASA.</h1>
                </NavbarBrand>

                {/* Бургер-меню */}
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <NavbarCollapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Link to="/engines" className="logo-button">Двигатели</Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/acceptances" className="logo-button">Приёмки</Link>
                                <Link to="/profile" className="logo-button">{username}</Link>
                                <Nav.Link as={Button} className="logout-button" onClick={handleLogout}>Выйти</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="logo-button">Войти</Link>
                                <Link to="/register" className="logo-button">Регистрация</Link>
                            </>
                        )}
                    </Nav>
                </NavbarCollapse>
            </Container>
        </Navbar>
    );
};

export default Header;
