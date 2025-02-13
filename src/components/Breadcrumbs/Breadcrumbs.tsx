import React from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css'

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <Container className="mt-3">
            <Breadcrumb>
                {items.map((item, index) => (
                    <Breadcrumb.Item
                        key={index}
                        active={index === items.length - 1}
                        linkAs={item.path ? Link : undefined}
                        linkProps={item.path ? { to: item.path } : undefined}
                    >
                        {item.label}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
        </Container>
    );
};

export default Breadcrumbs;
