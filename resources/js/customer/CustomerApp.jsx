import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './styles/customer.css';

function CustomerApp() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default CustomerApp;

