import { StrictMode } from "react";

import {
    createRoot
} from "react-dom/client";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import AdminNewsPage
    from "./pages/admin/AdminNewsPage.jsx";


/* =================================================
   PÁGINAS PÚBLICAS
================================================= */

import App
    from "./App.jsx";

import LivePage
    from "./pages/LivePage.jsx";

import ProgrammingPage
    from "./pages/ProgrammingPage.jsx";

import ProgramsPage
    from "./pages/ProgramsPage.jsx";

import NewsPage
    from "./pages/NewsPage.jsx";

import AboutPage
    from "./pages/AboutPage.jsx";

import SeriesDetailPage
    from "./pages/SeriesDetailPage.jsx";

import DonationsPage
    from "./pages/DonationsPage.jsx";


/* =================================================
   AUTENTICACIÓN
================================================= */

import {
    AuthProvider
} from "./context/AuthContext.jsx";


import ProtectedRoute
    from "./components/ProtectedRoute.jsx";

import UserProtectedRoute
    from "./components/UserProtectedRoute.jsx";


/* =================================================
   AUTENTICACIÓN / USUARIOS
================================================= */

import AdminLoginPage
    from "./pages/AdminLoginPage.jsx";

import AdminPage
    from "./pages/AdminPage.jsx";

import RegisterPage
    from "./pages/RegisterPage.jsx";

import UserLoginPage
    from "./pages/UserLoginPage.jsx";

import ProfilePage
    from "./pages/ProfilePage.jsx";

import RecommendationPage
    from "./pages/RecommendationPage.jsx";


/* =================================================
   ADMINISTRACIÓN
================================================= */

import SeriesPage
    from "./pages/admin/SeriesPage.jsx";

import SeasonsPage
    from "./pages/admin/SeasonsPage.jsx";

import EpisodesPage
    from "./pages/admin/EpisodesPage.jsx";

import MediaContentPage
    from "./pages/admin/MediaContentPage.jsx";

import SchedulesPage
    from "./pages/admin/SchedulesPage.jsx";

import ProgrammingBlocksPage
    from "./pages/admin/ProgrammingBlocksPage.jsx";

import AdminRecommendationsPage
    from "./pages/admin/AdminRecommendationsPage.jsx";


/* =================================================
   ESTILOS
================================================= */

import "./index.css";


createRoot(
    document.getElementById("root")
).render(

    <StrictMode>

        <AuthProvider>

            <BrowserRouter>

                <Routes>


                    {/* =================================================
                        PÁGINA PRINCIPAL
                    ================================================= */}

                    <Route
                        path="/"
                        element={<App />}
                    />


                    {/* =================================================
                        EN VIVO
                    ================================================= */}

                    <Route
                        path="/en-vivo"
                        element={<LivePage />}
                    />


                    {/* =================================================
                        PROGRAMACIÓN PÚBLICA
                    ================================================= */}

                    <Route
                        path="/programacion"
                        element={<ProgrammingPage />}
                    />


                    {/* =================================================
                        PROGRAMAS
                    ================================================= */}

                    <Route
                        path="/programas"
                        element={<ProgramsPage />}
                    />


                    {/* =================================================
                        DETALLE DE SERIE
                    ================================================= */}

                    <Route
                        path="/programas/:id"
                        element={<SeriesDetailPage />}
                    />


                    {/* =================================================
                        NOTICIAS
                    ================================================= */}

                    <Route
                        path="/noticias"
                        element={<NewsPage />}
                    />


                    {/* =================================================
                        ACERCA DE
                    ================================================= */}

                    <Route
                        path="/acerca"
                        element={<AboutPage />}
                    />

                    {/* =================================================
                        DONACIONES
                    ================================================= */}

                    <Route
                        path="/donaciones"
                        element={<DonationsPage />}
                    />


                    {/* =================================================
                        LOGIN ADMIN
                    ================================================= */}

                    <Route
                        path="/admin/login"
                        element={<AdminLoginPage />}
                    />


                    {/* =================================================
                        RUTAS ADMIN PROTEGIDAS
                    ================================================= */}

                    <Route
                        element={<ProtectedRoute />}
                    >


                        {/* =============================================
                            PANEL ADMINISTRATIVO
                        ============================================= */}

                        <Route
                            path="/admin"
                            element={<AdminPage />}
                        />


                        {/* =============================================
                            SERIES
                        ============================================= */}

                        <Route
                            path="/admin/series"
                            element={<SeriesPage />}
                        />


                        {/* =============================================
                            TEMPORADAS
                        ============================================= */}

                        <Route
                            path="/admin/seasons"
                            element={<SeasonsPage />}
                        />


                        {/* =============================================
                            EPISODIOS
                        ============================================= */}

                        <Route
                            path="/admin/episodes"
                            element={<EpisodesPage />}
                        />


                        {/* =============================================
                            CONTENIDO MULTIMEDIA
                        ============================================= */}

                        <Route
                            path="/admin/media-content"
                            element={
                                <MediaContentPage />
                            }
                        />


                        {/* =============================================
                            PROGRAMACIÓN
                        ============================================= */}

                        <Route
                            path="/admin/schedules"
                            element={
                                <SchedulesPage />
                            }
                        />


                        {/* =============================================
                            BLOQUES DE PROGRAMACIÓN
                        ============================================= */}

                        <Route
                            path="/admin/programming-blocks"
                            element={
                                <ProgrammingBlocksPage />
                            }
                        />


                        {/* =============================================
                            RECOMENDACIONES
                        ============================================= */}

                        <Route
                            path="/admin/recommendations"
                            element={
                                <AdminRecommendationsPage />
                            }
                        />
                        {/* =================================================
                           NOTICIAS
                           ================================================= */}

                        <Route
                            path="/admin/news"
                            element={
                                <AdminNewsPage />
                            }
                        />

                    </Route>


                    {/* =================================================
                        REGISTRO DE USUARIO
                    ================================================= */}

                    <Route
                        path="/registro"
                        element={<RegisterPage />}
                    />


                    {/* =================================================
                        LOGIN DE USUARIO
                    ================================================= */}

                    <Route
                        path="/login"
                        element={<UserLoginPage />}
                    />


                    {/* =================================================
                        RUTAS PROTEGIDAS DEL USUARIO
                    ================================================= */}

                    <Route
                        element={<UserProtectedRoute />}
                    >

                        {/* =============================================
                            PERFIL
                        ============================================= */}

                        <Route
                            path="/perfil"
                            element={
                                <ProfilePage />
                            }
                        />


                        {/* =============================================
                            RECOMENDAR UNA SERIE
                        ============================================= */}

                        <Route
                            path="/recomendar"
                            element={
                                <RecommendationPage />
                            }
                        />

                    </Route>


                </Routes>

            </BrowserRouter>

        </AuthProvider>

    </StrictMode>
);