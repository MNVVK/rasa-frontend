import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Form, Button, Spinner } from "react-bootstrap";
import { AppDispatch, RootState } from "../../store";
import {
    fetchEngineAttributes,
    addEngineAttribute,
    deleteEngineAttribute,
    updateEngineAttribute,
} from "../../slices/attributesSlice";
import './VerticalAttributesTable.css'

interface VerticalAttributesTableProps {
    engineId: number;
    isEditable?: boolean; // Можно ли редактировать атрибуты
}

const VerticalAttributesTable: React.FC<VerticalAttributesTableProps> = ({ engineId, isEditable = false }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { attributes, loading, error } = useSelector((state: RootState) => state.attribute);

    const [newAttribute, setNewAttribute] = useState({ name: "", value: "" });

    useEffect(() => {
        if (engineId) {
            dispatch(fetchEngineAttributes(engineId));
        }
    }, [dispatch, engineId]);

    // Обработчик изменения значения существующего атрибута
    const handleAttributeChange = (name: string, value: string) => {
        if (!engineId) return;
        dispatch(updateEngineAttribute({ id: engineId, name, value }));
    };

    // Обработчик удаления атрибута
    const handleDeleteAttribute = (name: string) => {
        if (!engineId) return;
        dispatch(deleteEngineAttribute({ id: engineId, name }));
    };

    // Обработчик добавления нового атрибута
    const handleAddAttribute = () => {
        if (!engineId || !newAttribute.name.trim()) return;
        dispatch(addEngineAttribute({ id: engineId, name: newAttribute.name, value: newAttribute.value }));
        setNewAttribute({ name: "", value: "" });
    };

    return (
        <div className="mt-4">
            <h4>Атрибуты двигателя</h4>

            {loading ? (
                <Spinner animation="border" />
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <Table striped bordered hover responsive className="mt-3 transparent-table">
                    {/*<thead>*/}
                    {/*<tr>*/}
                    {/*    <th>Название</th>*/}
                    {/*    <th>Значение</th>*/}
                    {/*    {isEditable && <th>Действия</th>}*/}
                    {/*</tr>*/}
                    {/*</thead>*/}
                    <tbody>
                    {attributes.length > 0 ? (
                        attributes.map((attr) => (
                            <tr key={attr.name}>
                                <td>{attr.name}</td>
                                <td>
                                    {isEditable ? (
                                        <Form.Control
                                            type="text"
                                            value={attr.value || ""}
                                            onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                                        />
                                    ) : (
                                        attr.value || "—"
                                    )}
                                </td>
                                {isEditable && (
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteAttribute(attr.name)}>
                                            Удалить
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={isEditable ? 3 : 2} className="text-center">
                                Нет атрибутов
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            )}

            {isEditable && (
                <div className="mt-3">
                    <h5>Добавить новый атрибут</h5>
                    <Form.Group className="mb-2">
                        <Form.Control
                            type="text"
                            placeholder="Название"
                            value={newAttribute.name}
                            onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Control
                            type="text"
                            placeholder="Значение"
                            value={newAttribute.value}
                            onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
                        />
                    </Form.Group>
                    <Button variant="success" onClick={handleAddAttribute}>
                        Добавить атрибут
                    </Button>
                </div>
            )}
        </div>
    );
};

export default VerticalAttributesTable;
