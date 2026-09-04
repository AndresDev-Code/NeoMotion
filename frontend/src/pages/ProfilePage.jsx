import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext.jsx";

import {
    getFavorites,
    removeFavorite,
    getMyRecommendations,
    getResourceUrl,
    deleteMyRecommendation
} from "../api/api.js";


function ProfilePage() {

    const {
        user,
        logout
    } = useAuth();


    const [
        favorites,
        setFavorites
    ] = useState([]);


    const [
        recommendations,
        setRecommendations
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    // =================================================
    // CARGAR DATOS DEL PERFIL
    // =================================================

    useEffect(() => {

        async function loadProfileData() {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                const [
                    favoritesData,
                    recommendationsData
                ] = await Promise.all([

                    getFavorites(
                        token
                    ),

                    getMyRecommendations(
                        token
                    )

                ]);


                setFavorites(
                    Array.isArray(
                        favoritesData
                    )
                        ? favoritesData
                        : []
                );


                setRecommendations(
                    Array.isArray(
                        recommendationsData
                    )
                        ? recommendationsData
                        : []
                );


            } catch (error) {

                console.error(
                    "Error cargando perfil:",
                    error
                );


                setError(
                    error.message ||
                    "No fue posible cargar tu perfil."
                );


            } finally {

                setLoading(
                    false
                );

            }

        }


        loadProfileData();

    }, []);


    // =================================================
    // ELIMINAR FAVORITO
    // =================================================

    async function eliminarFavorito(
        seriesId
    ) {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );


            await removeFavorite(
                seriesId,
                token
            );


            setFavorites(
                previous =>
                    previous.filter(
                        favorite =>
                            favorite.seriesId !==
                            seriesId
                    )
            );


        } catch (error) {

            console.error(
                "Error eliminando favorito:",
                error
            );


            setError(
                error.message ||
                "No fue posible eliminar el favorito."
            );

        }

    }
    // =================================================
// ELIMINAR RECOMENDACIÓN
// =================================================

    async function eliminarRecomendacion(
        recommendationId
    ) {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );


            await deleteMyRecommendation(
                recommendationId,
                token
            );


            setRecommendations(
                previous =>
                    previous.filter(
                        recommendation =>
                            recommendation.id !==
                            recommendationId
                    )
            );


        } catch (error) {

            console.error(
                "Error eliminando recomendación:",
                error
            );


            setError(
                error.message ||
                "No fue posible eliminar la recomendación."
            );

        }

    }


    // =================================================
    // ESTADO DE RECOMENDACIÓN
    // =================================================

    function getRecommendationStatus(
        status
    ) {

        const normalizedStatus =
            String(
                status || ""
            ).toUpperCase();


        switch (
            normalizedStatus
            ) {

            case "APPROVED":
                return "APROBADA";

            case "REJECTED":
                return "NO APROBADA";

            case "REVIEWED":
                return "REVISADA";

            case "PENDING":
                return "PENDIENTE";

            default:
                return status || "PENDIENTE";
        }

    }


    // =================================================
    // CARGANDO
    // =================================================

    if (loading) {

        return (

            <main className="profile-page profile-page-loading">

                <section className="profile-hero">

                    <p className="section-label">
                        NEO MOTION
                    </p>


                    <h1>
                        MI PERFIL
                    </h1>


                    <p>
                        Preparando tu espacio personal...
                    </p>

                </section>

            </main>
        );
    }


    // =================================================
    // RENDER
    // =================================================

    return (

        <main className="profile-page">


            {/* =================================================
                HERO DEL PERFIL
            ================================================= */}

            <section className="profile-hero">

                <div className="profile-hero-content">

                    <p className="section-label">
                        TU ESPACIO NEO MOTION
                    </p>


                    <h1>
                        MI PERFIL
                    </h1>


                    <p className="profile-hero-description">

                        Bienvenido a tu espacio personal
                        dentro de NeoMotion.

                        <br />

                        Aquí puedes organizar tus series favoritas
                        y compartir con el canal las series
                        que te gustaría ver.

                    </p>

                </div>


                <div className="profile-hero-status">

                    <span className="profile-status-label">
                        CUENTA ACTIVA
                    </span>


                    <strong>
                        {user?.username || "USUARIO"}
                    </strong>


                    <span className="profile-status-line">
                        NEO MOTION MEMBER
                    </span>

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="profile-error">

                    <span>
                        AVISO
                    </span>


                    <p>
                        {error}
                    </p>

                </div>

            )}


            {/* =================================================
                INFORMACIÓN DE LA CUENTA
            ================================================= */}

            <section className="profile-account">

                <div className="profile-account-header">

                    <div>

                        <p className="section-label">
                            MI CUENTA
                        </p>


                        <h2>
                            Información personal
                        </h2>

                    </div>

                </div>


                <div className="profile-account-grid">


                    <div className="profile-account-item">

                        <span>
                            USUARIO
                        </span>


                        <strong>
                            {user?.username || "—"}
                        </strong>

                    </div>


                    <div className="profile-account-item">

                        <span>
                            NOMBRE
                        </span>


                        <strong>

                            {user?.firstName || ""}

                            {" "}

                            {user?.lastName || ""}

                        </strong>

                    </div>


                    <div className="profile-account-item">

                        <span>
                            CORREO
                        </span>


                        <strong>
                            {user?.email || "—"}
                        </strong>

                    </div>


                    <div className="profile-account-item">

                        <span>
                            TIPO DE CUENTA
                        </span>


                        <strong>
                            USUARIO NEO MOTION
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                RESUMEN DE ACTIVIDAD
            ================================================= */}

            <section className="profile-stats">

                <div className="profile-stat">

                    <span className="profile-stat-number">
                        {favorites.length}
                    </span>


                    <span className="profile-stat-label">
                        SERIES FAVORITAS
                    </span>

                </div>


                <div className="profile-stat">

                    <span className="profile-stat-number">
                        {recommendations.length}
                    </span>


                    <span className="profile-stat-label">
                        RECOMENDACIONES
                    </span>

                </div>


                <div className="profile-stat">

                    <span className="profile-stat-number">
                        24/7
                    </span>


                    <span className="profile-stat-label">
                        CANAL NEO MOTION
                    </span>

                </div>

            </section>


            {/* =================================================
                FAVORITOS
            ================================================= */}

            <section className="profile-section">

                <div className="profile-section-header">

                    <div>

                        <p className="section-label">
                            TU CATÁLOGO
                        </p>


                        <h2 className="profile-section-title">

                            <span className="section-mark favorite-mark"></span>

                            MIS FAVORITOS

                        </h2>


                        <p className="profile-section-description">

                            Guarda las series que no quieres
                            perder de vista.

                        </p>

                    </div>


                    <Link
                        to="/programas"
                        className="profile-section-link"
                    >
                        EXPLORAR PROGRAMAS →
                    </Link>

                </div>


                {favorites.length === 0 ? (

                    <div className="profile-empty-card">

                        <span className="profile-empty-mark">
                            +
                        </span>


                        <h3>
                            Tu catálogo está esperando.
                        </h3>


                        <p>

                            Explora las series disponibles
                            y guarda tus favoritas para
                            encontrarlas rápidamente desde
                            tu perfil.

                        </p>


                        <Link
                            to="/programas"
                            className="profile-primary-action"
                        >

                            EXPLORAR SERIES

                        </Link>

                    </div>

                ) : (

                    <div className="program-grid profile-favorites-grid">

                        {favorites.map(
                            favorite => (

                                <article
                                    key={
                                        favorite.id
                                    }
                                    className="program-card profile-favorite-card"
                                >

                                    <Link
                                        to={`/programas/${favorite.seriesId}`}
                                        className="profile-favorite-link"
                                    >

                                        <div className="program-image">

                                            {favorite.imageUrl ? (

                                                <img
                                                    src={
                                                        getResourceUrl(
                                                            favorite.imageUrl
                                                        )
                                                    }
                                                    alt={
                                                        favorite.seriesTitle
                                                    }
                                                />

                                            ) : (

                                                <span>
                                                    NEO
                                                </span>

                                            )}

                                        </div>


                                        <div className="program-content">

                                            <span>
                                                FAVORITO
                                            </span>


                                            <h3>
                                                {
                                                    favorite.seriesTitle
                                                }
                                            </h3>


                                            <p>
                                                {
                                                    favorite.seriesDescription ||
                                                    "Serie guardada en tu catálogo personal."
                                                }
                                            </p>

                                        </div>

                                    </Link>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            eliminarFavorito(
                                                favorite.seriesId
                                            )
                                        }
                                        className="profile-remove-button"
                                    >

                                        QUITAR DE FAVORITOS

                                    </button>

                                </article>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                RECOMENDACIONES
            ================================================= */}

            <section className="profile-section profile-recommendations-section">

                <div className="profile-section-header">

                    <div>

                        <p className="section-label">
                            COMUNIDAD
                        </p>


                        <h2 className="profile-section-title">

                            <span className="section-mark recommendation-mark"></span>

                            MIS RECOMENDACIONES

                        </h2>


                        <p className="profile-section-description">

                            Comparte con NeoMotion las series
                            que te gustaría ver en el canal.

                        </p>

                    </div>


                    <Link
                        to="/recomendar"
                        className="profile-section-link"
                    >
                        RECOMENDAR UNA SERIE →
                    </Link>

                </div>


                {recommendations.length === 0 ? (

                    <div className="profile-empty-card recommendation-empty">

                        <span className="profile-empty-mark recommendation-empty-mark">
                            +
                        </span>


                        <h3>
                            Tu opinión también forma parte del canal.
                        </h3>


                        <p>

                            Recomienda una serie, cuéntanos por qué
                            te gustaría verla en NeoMotion y consulta
                            después el estado de tu sugerencia.

                        </p>


                        <Link
                            to="/recomendar"
                            className="profile-primary-action"
                        >

                            HACER UNA RECOMENDACIÓN

                        </Link>

                    </div>

                ) : (

                    <div className="recommendations-list profile-recommendations-list">

                        {recommendations.map(
                            recommendation => (

                                <article
                                    key={
                                        recommendation.id
                                    }
                                    className="recommendation-card profile-recommendation-card"
                                >

                                    <div className="recommendation-card-header">

        <span className="recommendation-status">

            {
                getRecommendationStatus(
                    recommendation.status
                )
            }

        </span>

                                    </div>


                                    <h3>

                                        {
                                            recommendation.title
                                        }

                                    </h3>


                                    {recommendation.reason && (

                                        <p>

                                            {
                                                recommendation.reason
                                            }

                                        </p>

                                    )}


                                    <button
                                        type="button"
                                        onClick={() =>
                                            eliminarRecomendacion(
                                                recommendation.id
                                            )
                                        }
                                        className="profile-remove-button"
                                    >

                                        ELIMINAR RECOMENDACIÓN

                                    </button>

                                </article>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                PROPUESTA DE VALOR
            ================================================= */}

            <section className="profile-member-section">

                <div>

                    <p className="section-label">
                        SER PARTE DE NEO MOTION
                    </p>


                    <h2>
                        Tu cuenta le da una identidad
                        a tu experiencia.
                    </h2>

                </div>


                <div className="profile-member-benefits">

                    <div>

                        <span>
                            01
                        </span>


                        <strong>
                            TU CATÁLOGO
                        </strong>


                        <p>
                            Conserva tus series favoritas
                            en un solo lugar.
                        </p>

                    </div>


                    <div>

                        <span>
                            02
                        </span>


                        <strong>
                            TU VOZ
                        </strong>


                        <p>
                            Recomienda series y comparte
                            tus preferencias con NeoMotion.
                        </p>

                    </div>


                    <div>

                        <span>
                            03
                        </span>


                        <strong>
                            TU CANAL
                        </strong>


                        <p>
                            Forma parte de una comunidad
                            alrededor de la programación.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                ACCIONES
            ================================================= */}

            <section className="profile-actions">

                <Link
                    to="/programas"
                    className="profile-action-primary"
                >
                    VER PROGRAMAS
                </Link>


                <button
                    type="button"
                    onClick={logout}
                    className="profile-action-logout"
                >
                    CERRAR SESIÓN
                </button>

            </section>

        </main>
    );
}


export default ProfilePage;