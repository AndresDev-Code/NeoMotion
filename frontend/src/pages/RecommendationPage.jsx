import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    createRecommendation,
    getMyRecommendations
} from "../api/api.js";

import {
    useAuth
} from "../context/AuthContext.jsx";

import neoMotionLogo
    from "../assets/neomotion-logo.svg";


function RecommendationPage() {

    const {
        isAuthenticated,
        logout
    } = useAuth();


    const [
        title,
        setTitle
    ] = useState("");


    const [
        reason,
        setReason
    ] = useState("");


    const [
        recommendations,
        setRecommendations
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        saving,
        setSaving
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    // =================================================
    // CARGAR MIS RECOMENDACIONES
    // =================================================

    useEffect(() => {

        async function loadRecommendations() {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                const data =
                    await getMyRecommendations(
                        token
                    );


                setRecommendations(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Error cargando recomendaciones:",
                    error
                );


                setError(
                    error.message ||
                    "No fue posible cargar tus recomendaciones."
                );

            } finally {

                setLoading(
                    false
                );

            }

        }


        if (isAuthenticated) {

            loadRecommendations();

        } else {

            setLoading(false);

        }

    }, [
        isAuthenticated
    ]);


    // =================================================
    // ENVIAR RECOMENDACIÓN
    // =================================================

    async function handleSubmit(
        event
    ) {

        event.preventDefault();


        setError("");

        setSuccess("");

        setSaving(true);


        try {

            const token =
                localStorage.getItem(
                    "token"
                );


            const recommendation =
                await createRecommendation(
                    {
                        title:
                            title.trim(),

                        reason:
                            reason.trim()
                    },
                    token
                );


            setRecommendations(
                previous => [

                    recommendation,

                    ...previous

                ]
            );


            setTitle("");

            setReason("");


            setSuccess(
                "Tu recomendación fue enviada correctamente."
            );


        } catch (error) {

            console.error(
                "Error enviando recomendación:",
                error
            );


            setError(
                error.message ||
                "No fue posible enviar la recomendación."
            );

        } finally {

            setSaving(false);

        }

    }


    // =================================================
    // ESTADO DE RECOMENDACIÓN
    // =================================================

    function getRecommendationStatus(
        status
    ) {

        const normalized =
            String(
                status || ""
            ).toUpperCase();


        switch (
            normalized
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

                return status ||
                    "PENDIENTE";
        }

    }


    // =================================================
    // CARGANDO
    // =================================================

    if (loading) {

        return (

            <main className="recommendation-page">

                <header className="page-navbar">

                    <Link
                        to="/"
                        className="page-navbar-logo"
                    >

                        <img
                            src={neoMotionLogo}
                            alt="NeoMotion"
                        />

                    </Link>

                </header>


                <section className="recommendation-header">

                    <p className="section-label">
                        COMUNIDAD NEO MOTION
                    </p>


                    <h1>
                        RECOMIENDA UNA SERIE
                    </h1>


                    <p>
                        Cargando tu espacio de recomendaciones...
                    </p>

                </section>

            </main>

        );

    }


    // =================================================
    // RENDER
    // =================================================

    return (

        <main className="recommendation-page">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="page-navbar">

                <Link
                    to="/"
                    className="page-navbar-logo"
                >

                    <img
                        src={neoMotionLogo}
                        alt="NeoMotion"
                    />

                </Link>


                <nav className="page-navbar-menu">

                    <Link to="/">
                        Inicio
                    </Link>


                    <Link
                        to="/en-vivo"
                        className="page-live-link"
                    >

                        <span className="page-live-dot">
                        </span>

                        En vivo

                    </Link>


                    <Link to="/programacion">
                        Programación
                    </Link>


                    <Link to="/programas">
                        Programas
                    </Link>


                    <Link to="/noticias">
                        Noticias
                    </Link>


                    <Link to="/acerca">
                        Acerca de
                    </Link>


                    <Link to="/donaciones">
                        Apoya NeoMotion
                    </Link>

                </nav>


                <div className="page-navbar-actions">

                    <span className="page-navbar-status">
                        ● SEÑAL 24/7
                    </span>


                    <Link to="/perfil">
                        Mi perfil
                    </Link>


                    <button
                        type="button"
                        onClick={logout}
                    >
                        Cerrar sesión
                    </button>

                </div>

            </header>


            {/* =================================================
                HERO
            ================================================= */}

            <section className="recommendation-header">

                <div className="recommendation-header-main">

                    <p className="section-label">
                        COMUNIDAD NEO MOTION
                    </p>


                    <h1>
                        RECOMIENDA
                        <br />
                        UNA SERIE
                    </h1>


                    <p className="recommendation-intro">

                        ¿Hay una serie que te gustaría
                        volver a ver en NeoMotion?

                        <br />

                        Cuéntanos cuál y por qué debería
                        formar parte del canal.

                    </p>

                </div>


                <div className="recommendation-header-side">

                    <span>
                        TU VOZ
                    </span>


                    <strong>
                        NEO MOTION
                    </strong>


                    <p>
                        Las recomendaciones de la comunidad
                        ayudan a construir el futuro catálogo
                        del canal.
                    </p>

                </div>

            </section>


            {/* =================================================
                CONTENIDO
            ================================================= */}

            <section className="recommendation-content">


                {/* =================================================
                    FORMULARIO
                ================================================= */}

                <div className="recommendation-form-panel">

                    <div className="recommendation-panel-heading">

                        <p className="section-label">
                            NUEVA RECOMENDACIÓN
                        </p>


                        <h2>
                            Cuéntanos qué quieres ver
                        </h2>


                        <p>
                            Puedes recomendar cualquier serie
                            que te gustaría ver en la programación
                            de NeoMotion.
                        </p>

                    </div>


                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="recommendation-form"
                    >


                        {/* =================================================
                            SERIE
                        ================================================= */}

                        <div className="recommendation-field">

                            <label htmlFor="recommendation-title">
                                NOMBRE DE LA SERIE
                            </label>


                            <input
                                id="recommendation-title"
                                type="text"
                                value={title}
                                onChange={
                                    event =>
                                        setTitle(
                                            event.target.value
                                        )
                                }
                                maxLength={200}
                                required
                                disabled={saving}
                                placeholder="Ej. Cowboy Bebop"
                            />

                        </div>


                        {/* =================================================
                            MOTIVO
                        ================================================= */}

                        <div className="recommendation-field">

                            <label htmlFor="recommendation-reason">
                                ¿POR QUÉ TE GUSTARÍA VERLA?
                            </label>


                            <textarea
                                id="recommendation-reason"
                                value={reason}
                                onChange={
                                    event =>
                                        setReason(
                                            event.target.value
                                        )
                                }
                                maxLength={1000}
                                disabled={saving}
                                placeholder="Cuéntanos por qué esta serie debería estar en NeoMotion."
                                rows={7}
                            />

                        </div>


                        {/* =================================================
                            MENSAJES
                        ================================================= */}

                        {error && (

                            <div className="recommendation-message error">

                                <span>
                                    AVISO
                                </span>


                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        {success && (

                            <div className="recommendation-message success">

                                <span>
                                    ENVIADA
                                </span>


                                <p>
                                    {success}
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            BOTÓN
                        ================================================= */}

                        <button
                            type="submit"
                            className="recommendation-submit"
                            disabled={
                                saving
                            }
                        >

                            {saving

                                ? "ENVIANDO..."

                                : "ENVIAR RECOMENDACIÓN"

                            }

                        </button>

                    </form>

                </div>


                {/* =================================================
                    MIS RECOMENDACIONES
                ================================================= */}

                <section className="my-recommendations">

                    <div className="recommendation-list-header">

                        <div>

                            <p className="section-label">
                                TU PARTICIPACIÓN
                            </p>


                            <h2>
                                MIS RECOMENDACIONES
                            </h2>

                        </div>


                        <span className="recommendation-count">

                            {recommendations.length}

                            {" "}

                            {recommendations.length === 1
                                ? "RECOMENDACIÓN"
                                : "RECOMENDACIONES"
                            }

                        </span>

                    </div>


                    {recommendations.length === 0 ? (

                        <div className="recommendation-empty">

                            <span className="recommendation-empty-mark">
                                +
                            </span>


                            <h3>
                                Todavía no has recomendado
                                ninguna serie.
                            </h3>


                            <p>
                                Tu primera recomendación aparecerá
                                aquí y podrás consultar su estado
                                posteriormente.
                            </p>

                        </div>

                    ) : (

                        <div className="recommendation-history">

                            {recommendations.map(
                                (
                                    recommendation,
                                    index
                                ) => (

                                    <article
                                        key={
                                            recommendation.id
                                        }
                                        className="recommendation-history-card"
                                    >

                                        <div className="recommendation-history-number">

                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </div>


                                        <div className="recommendation-history-content">

                                            <div className="recommendation-history-meta">

                                                <span>
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

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}

                </section>

            </section>


            {/* =================================================
                FOOTER DE ACCIONES
            ================================================= */}

            <section className="recommendation-actions">

                <Link
                    to="/perfil"
                    className="recommendation-action-secondary"
                >
                    VOLVER A MI PERFIL
                </Link>


                <Link
                    to="/programas"
                    className="recommendation-action-primary"
                >
                    EXPLORAR PROGRAMAS
                </Link>

            </section>

        </main>
    );
}


export default RecommendationPage;