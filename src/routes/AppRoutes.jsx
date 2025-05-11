import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MainLayout from '../layouts/MainLayout';
import FoodSearch from "../pages/FoodSearch";
import AddFoodEntry from "../pages/AddFoodEntry";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/buscar-alimento" element={<FoodSearch />} />
                <Route path="/agregar-alimento" element={<AddFoodEntry />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes
