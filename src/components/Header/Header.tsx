import React from "react";
import { Container, Navbar, Nav, NavbarBrand, NavbarToggle, NavbarCollapse } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Header.css';

const Header: React.FC = () => {
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
                    </Nav>
                </NavbarCollapse>
            </Container>
        </Navbar>
    );
};

export default Header;
