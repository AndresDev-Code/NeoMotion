import {
    Link
} from "react-router-dom";


function AdminPage() {

    return (

        <main className="admin-dashboard">


            {/* =================================================
                HEADER PRINCIPAL
            ================================================= */}

            <section className="admin-dashboard-header">

                <div>

                    <p className="section-label">
                        ADMINISTRACIÓN DE NEOMOTION
                    </p>


                    <h1>
                        CENTRAL DE
                        <br />
                        CONTROL
                    </h1>


                    <p className="admin-dashboard-description">

                        Gestiona el contenido, la emisión,
                        la automatización y la comunidad
                        de NeoMotion desde un solo lugar.

                    </p>

                </div>


                <div className="admin-dashboard-mark">

                    <span>
                        NEO
                    </span>


                    <strong>
                        MOTION
                    </strong>


                    <small>
                        TELEVISION
                    </small>


                    <small>
                        24 / 7
                    </small>

                </div>

            </section>


            {/* =================================================
                ESTADO GENERAL
            ================================================= */}

            <section className="admin-status-bar">


                <div className="admin-status-main">

                    <span className="admin-status-dot">
                    </span>


                    <div>

                        <span>
                            ESTADO DE LA SEÑAL
                        </span>


                        <strong>
                            OPERATIVA 24 / 7
                        </strong>

                    </div>

                </div>


                <div className="admin-status-divider">
                </div>


                <div className="admin-status-info">

                    <span>
                        PANEL ADMINISTRATIVO
                    </span>


                    <strong>
                        CONTROL CENTRAL
                    </strong>

                </div>


                <div className="admin-status-divider">
                </div>


                <div className="admin-status-info">

                    <span>
                        MÓDULOS
                    </span>


                    <strong>
                        08 ACTIVOS
                    </strong>

                </div>

            </section>


            {/* =================================================
                CONTENIDO
            ================================================= */}

            <section className="admin-dashboard-group">

                <div className="admin-dashboard-group-header">

                    <div>

                        <span>
                            01
                        </span>


                        <div>

                            <p>
                                CONTENIDO
                            </p>


                            <h2>
                                CATÁLOGO
                            </h2>

                        </div>

                    </div>


                    <p>
                        Administra el contenido que
                        alimenta la programación.
                    </p>

                </div>


                <div className="admin-dashboard-grid">


                    {/* =================================================
                        SERIES
                    ================================================= */}

                    <Link
                        to="/admin/series"
                        className="admin-dashboard-card"
                    >

                        <div className="admin-card-index">
                            01
                        </div>


                        <div className="admin-card-content">

                            <span>
                                CATÁLOGO
                            </span>


                            <h3>
                                SERIES
                            </h3>


                            <p>
                                Administra las series que
                                forman parte del catálogo
                                de NeoMotion.
                            </p>

                        </div>


                        <span className="admin-card-arrow">
                            →
                        </span>

                    </Link>


                    {/* =================================================
                        TEMPORADAS
                    ================================================= */}

                    <Link
                        to="/admin/seasons"
                        className="admin-dashboard-card"
                    >

                        <div className="admin-card-index">
                            02
                        </div>


                        <div className="admin-card-content">

                            <span>
                                ESTRUCTURA
                            </span>


                            <h3>
                                TEMPORADAS
                            </h3>


                            <p>
                                Organiza las temporadas
                                y su contenido asociado.
                            </p>

                        </div>


                        <span className="admin-card-arrow">
                            →
                        </span>

                    </Link>


                    {/* =================================================
                        EPISODIOS
                    ================================================= */}

                    <Link
                        to="/admin/episodes"
                        className="admin-dashboard-card"
                    >

                        <div className="admin-card-index">
                            03
                        </div>


                        <div className="admin-card-content">

                            <span>
                                CONTENIDO
                            </span>


                            <h3>
                                EPISODIOS
                            </h3>


                            <p>
                                Gestiona episodios, videos,
                                miniaturas y metadatos.
                            </p>

                        </div>


                        <span className="admin-card-arrow">
                            →
                        </span>

                    </Link>


                    {/* =================================================
                        MULTIMEDIA
                    ================================================= */}

                    <Link
                        to="/admin/media-content"
                        className="admin-dashboard-card"
                    >

                        <div className="admin-card-index">
                            04
                        </div>


                        <div className="admin-card-content">

                            <span>
                                CONTINUIDAD
                            </span>


                            <h3>
                                MULTIMEDIA
                            </h3>


                            <p>
                                Administra promos,
                                comerciales, bumpers
                                y otros contenidos.
                            </p>

                        </div>


                        <span className="admin-card-arrow">
                            →
                        </span>

                    </Link>

                </div>

            </section>


            {/* =================================================
                EMISIÓN
            ================================================= */}

            <section className="admin-dashboard-group">

                <div className="admin-dashboard-group-header">

                    <div>

                        <span>
                            02
                        </span>


                        <div>

                            <p>
                                EMISIÓN
                            </p>


                            <h2>
                                TRANSMISIÓN
                            </h2>

                        </div>

                    </div>


                    <p>
                        Controla qué se transmite,
                        cuándo y cómo.
                    </p>

                </div>


                <div className="admin-dashboard-grid admin-dashboard-grid-emission">


                    {/* =================================================
                        PROGRAMACIÓN
                    ================================================= */}

                    <Link
                        to="/admin/schedules"
                        className="admin-dashboard-card admin-dashboard-card-large"
                    >

                        <div className="admin-card-index">
                            05
                        </div>


                        <div className="admin-card-content">

                            <span>
                                PARRILLA
                            </span>


                            <h3>
                                PROGRAMACIÓN
                            </h3>


                            <p>
                                Consulta y administra
                                la parrilla real de
                                NeoMotion.
                            </p>

                        </div>


                        <div className="admin-card-meta">

                            <span>
                                CONTROL DE EMISIÓN
                            </span>


                            <strong>
                                ABRIR →
                            </strong>

                        </div>

                    </Link>


                    {/* =================================================
                        BLOQUES
                    ================================================= */}

                    <Link
                        to="/admin/programming-blocks"
                        className="admin-dashboard-card admin-dashboard-card-large featured"
                    >

                        <div className="admin-card-index">
                            06
                        </div>


                        <div className="admin-card-content">

                            <span>
                                AUTOMATIZACIÓN
                            </span>


                            <h3>
                                BLOQUES DE PROGRAMACIÓN
                            </h3>


                            <p>
                                Crea plantillas reutilizables
                                y genera automáticamente
                                la parrilla de transmisión.
                            </p>

                        </div>


                        <div className="admin-card-meta">

                            <span>
                                MOTOR DE PROGRAMACIÓN
                            </span>


                            <strong>
                                ABRIR →
                            </strong>

                        </div>

                    </Link>

                </div>

            </section>


            {/* =================================================
                COMUNIDAD
            ================================================= */}

            <section className="admin-dashboard-group">

                <div className="admin-dashboard-group-header">

                    <div>

                        <span>
                            03
                        </span>


                        <div>

                            <p>
                                COMUNIDAD
                            </p>


                            <h2>
                                PARTICIPACIÓN
                            </h2>

                        </div>

                    </div>


                    <p>
                        Escucha a la audiencia y
                        mantén actualizado el canal.
                    </p>

                </div>


                <div className="admin-dashboard-grid">


                    {/* =================================================
                        RECOMENDACIONES
                    ================================================= */}

                    <Link
                        to="/admin/recommendations"
                        className="admin-dashboard-card"
                    >

                        <div className="admin-card-index">
                            07
                        </div>


                        <div className="admin-card-content">

                            <span>
                                AUDIENCIA
                            </span>


                            <h3>
                                RECOMENDACIONES
                            </h3>


                            <p>
                                Revisa y modera las series
                                sugeridas por los usuarios.
                            </p>

                        </div>


                        <span className="admin-card-arrow">
                            →
                        </span>

                    </Link>


                    {/* =================================================
                        NOTICIAS
                    ================================================= */}

                    <Link
                        to="/admin/news"
                        className="admin-dashboard-card"
                    >

                        <div className="admin-card-index">
                            08
                        </div>


                        <div className="admin-card-content">

                            <span>
                                COMUNICACIÓN
                            </span>


                            <h3>
                                NOTICIAS
                            </h3>


                            <p>
                                Publica y administra
                                noticias, novedades
                                y anuncios de NeoMotion.
                            </p>

                        </div>


                        <span className="admin-card-arrow">
                            →
                        </span>

                    </Link>

                </div>

            </section>


            {/* =================================================
                PIE DEL DASHBOARD
            ================================================= */}

            <section className="admin-dashboard-footer">

                <div>

                    <span>
                        NEO MOTION
                    </span>


                    <strong>
                        CENTRAL DE CONTROL
                    </strong>

                </div>


                <p>
                    SISTEMA DE ADMINISTRACIÓN
                </p>


                <p>
                    24 / 7
                </p>

            </section>

        </main>
    );
}


export default AdminPage;