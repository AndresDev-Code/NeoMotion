import {
    useEffect,
    useState
} from "react";

import "../App.css";

import {
    getPlaybackState,
    getTodaySchedule
} from "../api/api.js";


function ProgrammingPage() {

    // =================================================
    // PROGRAMACIÓN PÚBLICA
    // =================================================

    const [
        schedules,
        setSchedules
    ] = useState([]);


    // =================================================
    // PROGRAMA ACTUAL
    // =================================================

    const [
        currentProgram,
        setCurrentProgram
    ] = useState(null);


    // =================================================
    // CARGANDO
    // =================================================

    const [
        loading,
        setLoading
    ] = useState(true);


    // =================================================
    // ERROR
    // =================================================

    const [
        error,
        setError
    ] = useState(null);


    // =================================================
    // CARGAR PROGRAMACIÓN
    // =================================================

    useEffect(() => {

        async function loadSchedule() {

            try {

                setError(null);


                const [
                    playbackState,
                    todaySchedule
                ] = await Promise.all([

                    getPlaybackState(),

                    getTodaySchedule()

                ]);


                // =====================================
                // CONTENIDO ACTUAL
                // =====================================

                setCurrentProgram(
                    playbackState.current
                );


                // =====================================
                // PROGRAMACIÓN PÚBLICA
                // =====================================

                /*
                 * El backend mantiene toda la programación
                 * técnica del canal.
                 *
                 * Para el espectador solamente mostramos
                 * episodios/programas.
                 *
                 * Se ocultan:
                 *
                 * - PROMO
                 * - COMMERCIAL
                 * - BUMPER
                 * - OTHER
                 */

                const publicSchedule =
                    todaySchedule.filter(
                        schedule =>
                            schedule.contentType ===
                            "EPISODE"
                    );


                setSchedules(
                    publicSchedule
                );

            } catch (error) {

                console.error(
                    "Error cargando programación:",
                    error
                );


                setError(
                    "No fue posible cargar la programación."
                );

            } finally {

                setLoading(false);

            }

        }


        // =============================================
        // PRIMERA CARGA
        // =============================================

        loadSchedule();


        // =============================================
        // ACTUALIZAR CADA 5 SEGUNDOS
        // =============================================

        const interval =
            setInterval(
                loadSchedule,
                5000
            );


        // =============================================
        // LIMPIEZA
        // =============================================

        return () => {

            clearInterval(interval);

        };

    }, []);


    // =================================================
    // CARGANDO
    // =================================================

    if (loading) {

        return (

            <main className="schedule-page">

                <section className="schedule-page-header">

                    <p className="section-label">

                        TELEVISIÓN NEOMOTION

                    </p>


                    <h1>

                        PROGRAMACIÓN

                    </h1>


                    <p>

                        Cargando programación...

                    </p>

                </section>

            </main>

        );

    }


    // =================================================
    // ERROR
    // =================================================

    if (error) {

        return (

            <main className="schedule-page">

                <section className="schedule-page-header">

                    <p className="section-label">

                        TELEVISIÓN NEOMOTION

                    </p>


                    <h1>

                        PROGRAMACIÓN

                    </h1>


                    <p>

                        {error}

                    </p>

                </section>

            </main>

        );

    }


    // =================================================
    // RENDER PRINCIPAL
    // =================================================

    return (

        <main className="schedule-page">


            {/* =========================================
                HEADER
            ========================================= */}

            <section className="schedule-page-header">

                <p className="section-label">

                    TELEVISIÓN NEOMOTION

                </p>


                <h1>

                    PROGRAMACIÓN

                </h1>


                <p>

                    Consulta los programas que
                    forman parte de la señal de NeoMotion.

                </p>

            </section>


            {/* =========================================
                LISTA DE PROGRAMACIÓN
            ========================================= */}

            <section className="schedule-page-content">


                {schedules.length > 0 ? (

                    <div className="full-schedule-list">

                        {schedules.map(
                            (schedule) => {

                                const isCurrent =
                                    currentProgram &&
                                    currentProgram.contentType ===
                                    "EPISODE" &&
                                    schedule.id ===
                                    currentProgram.scheduleId;


                                return (

                                    <article
                                        key={schedule.id}
                                        className={
                                            "full-schedule-item " +

                                            (
                                                isCurrent
                                                    ? "current"
                                                    : ""
                                            )
                                        }
                                    >


                                        {/* =====================
                                            HORARIO
                                        ===================== */}

                                        <div className="full-schedule-time">

                                            <strong>

                                                {
                                                    schedule
                                                        .startTime
                                                        ?.slice(0, 5)
                                                }

                                            </strong>


                                            <span>

                                                {
                                                    schedule
                                                        .endTime
                                                        ?.slice(0, 5)
                                                }

                                            </span>

                                        </div>


                                        {/* =====================
                                            INFORMACIÓN
                                        ===================== */}

                                        <div className="full-schedule-info">

                                            <h2>

                                                {
                                                    schedule
                                                        .seriesTitle
                                                }

                                            </h2>


                                            <p>

                                                Episodio{" "}

                                                {
                                                    schedule
                                                        .episodeNumber
                                                }

                                                {" — "}

                                                {
                                                    schedule
                                                        .episodeTitle
                                                }

                                            </p>

                                        </div>


                                        {/* =====================
                                            PROGRAMA AL AIRE
                                        ===================== */}

                                        {isCurrent && (

                                            <div className="on-air-badge">

                                                <span
                                                    className="on-air-dot"
                                                >
                                                </span>

                                                <span>

                                                    AHORA AL AIRE

                                                </span>

                                            </div>

                                        )}

                                    </article>

                                );

                            }
                        )}

                    </div>

                ) : (

                    <p className="empty-schedule">

                        No hay programación disponible
                        para hoy.

                    </p>

                )}

            </section>

        </main>

    );

}


export default ProgrammingPage;