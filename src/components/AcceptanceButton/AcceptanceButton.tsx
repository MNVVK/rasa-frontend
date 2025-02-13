import React from 'react';
import { Link } from 'react-router-dom';
import './AcceptanceButton.css';
import {useSelector} from "react-redux";
import {RootState} from "../../store.ts"; // Добавьте стили, если они нужны

interface AcceptanceButtonProps {
    draftId?: number;
    draftCount?: number;
}

const AcceptanceButton: React.FC<AcceptanceButtonProps> = ({ draftId, draftCount }) => {
    const {isAuthenticated} = useSelector((state: RootState) => state.users);
    return (
        <div className="acceptance-container">
            {(draftId && isAuthenticated) ? (
                <Link to={`/acceptances/${draftId}`} className="acceptance-btn">
                    {(draftCount && draftCount > 0) ? (
                        <span className="cart-count">{draftCount}</span>
                    ) : (<></>)}
                </Link>
            ) : (
                <div className="acceptance-btn disabled"></div>
            )}
        </div>
    );
};

export default AcceptanceButton;
