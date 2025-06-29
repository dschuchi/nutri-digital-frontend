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
import Exercise from '../pages/Exercise';
import Reports from '../pages/Reports';
import PatientReport from '../pages/PatientReport';
import NewFood from '../pages/NewFood';
import Review from '../pages/Review';
import MealPlanningPage from '../pages/MealPlanningPage';

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
                <Route path="/ejercicios" element={<Exercise />} />
                <Route path="/reportes" element={<Reports />} />
                <Route path="/reporte-paciente" element={<PatientReport />} />
                <Route path="/nuevo-alimento" element={<NewFood />} />
                <Route path="/review/:id" element={<Review />} />
                <Route path="/planificador" element={<MealPlanningPage />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes
