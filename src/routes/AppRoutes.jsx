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
            </Route>
        </Routes>
    );
}

export default AppRoutes
