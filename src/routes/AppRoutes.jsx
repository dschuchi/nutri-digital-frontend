import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MainLayout from '../layouts/MainLayout';
import FoodSearch from "../pages/FoodSearch";
import AddFoodEntry from "../pages/AddFoodEntry";
import ProtectedRoute from './ProtectedRoute';
import Goals from '../pages/Goals';
import Hydration from '../pages/Hydration';
import { Professionals } from '../pages/Professionals';
import ConsumedEntries from '../pages/FoodConsumed';
import { ChatPage } from '../pages/ChatPage';
import SitesPage from '../pages/PlaceSearch'
import { Patients } from '../pages/Patients';
import { Requests } from '../pages/Requests';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            }>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/buscar-alimento" element={<FoodSearch />} />
                <Route path="/agregar-alimento" element={<AddFoodEntry />} />
                <Route path="/objetivos" element={<Goals />} />
                <Route path="/hidratacion" element={<Hydration />} />
                <Route path="/profesionales" element={<Professionals />} />
                <Route path="/alimentos-consumidos" element={<ConsumedEntries />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/lugares" element={<SitesPage />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/requests" element={<Requests />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes
