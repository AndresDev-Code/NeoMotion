import {
    useEffect,
    useState
} from "react";

import {
    getRecommendations,
    updateRecommendationStatus,
    deleteRecommendation
} from "../../api/api.js";


function AdminRecommendationsPage() {

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
    // CARGAR RECOMENDACIONES
    // =================================================

    async function cargarRecomendaciones() {

        try {

            setLoading(
                true
            );

            setError("");


            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                throw new Error(
                    "No hay una sesión activa."
                );

            }


            const data =
                await getRecommendations(
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
                "No fue posible cargar las recomendaciones."
            );


        } finally {

            setLoading(
                false
            );

        }

    }


    useEffect(() => {

        cargarRecomendaciones();

    }, []);


    // =================================================
    // CAMBIAR ESTADO
    // =================================================

    async function cambiarEstado(
        id,
        status
    ) {

        try {

            setError("");


            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                throw new Error(
                    "No hay una sesión activa."
                );

            }


            const updated =
                await updateRecommendationStatus(
                    id,
                    {
                        status
                    },
                    token
                );


            setRecommendations(
                previous =>
                    previous.map(
                        recommendation =>
                            recommendation.id === id

                                ? updated

                                : recommendation
                    )
            );


        } catch (error) {

            console.error(
                "Error actualizando recomendación:",
                error
            );


            setError(
                error.message ||
                "No fue posible actualizar el estado."
            );

        }

    }


    // =================================================
    // ELIMINAR
    // =================================================

    async function eliminar(
        id
    ) {

        const confirmed =
            window.confirm(
                "¿Seguro que deseas eliminar esta recomendación?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setError("");


            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                throw new Error(
                    "No hay una sesión activa."
                );

            }


            await deleteRecommendation(
                id,
                token
            );


            setRecommendations(
                previous =>
                    previous.filter(
                        recommendation =>
                            recommendation.id !== id
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
    // RENDER
    // =================================================

    if (loading) {

        return (

            <main className="admin-page">

                <section className="admin-page-header">

                    <p className="section-label">
                        ADMINISTRACIÓN DE NEOMOTION
                    </p>


                    <h1>
                        RECOMENDACIONES
                    </h1>


                    <p>
                        Cargando recomendaciones...
                    </p>

                </section>

            </main>

        );

    }


    return (

        <main className="admin-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="admin-page-header">

                <p className="section-label">
                    ADMINISTRACIÓN DE NEOMOTION
                </p>


                <h1>
                    RECOMENDACIONES
                </h1>


                <p>
                    Revisa y modera las series sugeridas
                    por los usuarios.
                </p>

            </section>


            <section className="admin-content">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="admin-toolbar">

                    <div>

                        <span className="admin-toolbar-label">
                            RECOMENDACIONES
                        </span>


                        <strong>
                            {
                                recommendations.length
                            }
                        </strong>


                        <span className="admin-toolbar-count">

                            {
                                recommendations.length === 1
                                    ? " registro"
                                    : " registros"
                            }

                        </span>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="admin-message admin-message-error">

                        <span>
                            AVISO
                        </span>


                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* =================================================
                    VACÍO
                ================================================= */}

                {recommendations.length === 0 ? (

                    <div className="admin-empty-state">

                        <span>
                            SIN RECOMENDACIONES
                        </span>


                        <p>
                            No hay recomendaciones registradas.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                       TABLA
                    ================================================= */

                    <div className="recommendations-table-wrapper">

                        <table className="recommendations-table">

                            <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    SERIE
                                </th>

                                <th>
                                    USUARIO
                                </th>

                                <th>
                                    ESTADO
                                </th>

                                <th>
                                    ACCIONES
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {recommendations.map(
                                (
                                    recommendation,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            recommendation.id
                                        }
                                    >

                                        {/* =================================
                                                ÍNDICE
                                            ================================= */}

                                        <td className="recommendations-table-index">

                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </td>


                                        {/* =================================
                                                SERIE
                                            ================================= */}

                                        <td className="recommendations-table-title">

                                            <strong>

                                                {
                                                    recommendation.title
                                                }

                                            </strong>


                                            {recommendation.reason && (

                                                <span>

                                                        {
                                                            recommendation.reason
                                                        }

                                                    </span>

                                            )}

                                        </td>


                                        {/* =================================
                                                USUARIO
                                            ================================= */}

                                        <td className="recommendations-table-user">

                                            {
                                                recommendation.username ||
                                                "Usuario"
                                            }

                                        </td>


                                        {/* =================================
                                                ESTADO
                                            ================================= */}

                                        <td>

                                                <span
                                                    className={
                                                        `recommendation-status recommendation-status-${String(
                                                            recommendation.status ||
                                                            "PENDING"
                                                        ).toLowerCase()}`
                                                    }
                                                >

                                                    {
                                                        recommendation.status
                                                    }

                                                </span>

                                        </td>


                                        {/* =================================
                                                ACCIONES
                                            ================================= */}

                                        <td>

                                            <div className="admin-recommendation-actions">

                                                <button
                                                    type="button"
                                                    className="recommendation-pending-button"
                                                    onClick={() =>
                                                        cambiarEstado(
                                                            recommendation.id,
                                                            "PENDING"
                                                        )
                                                    }
                                                >
                                                    PENDIENTE
                                                </button>


                                                <button
                                                    type="button"
                                                    className="recommendation-review-button"
                                                    onClick={() =>
                                                        cambiarEstado(
                                                            recommendation.id,
                                                            "REVIEWED"
                                                        )
                                                    }
                                                >
                                                    REVISADA
                                                </button>


                                                <button
                                                    type="button"
                                                    className="recommendation-accept-button"
                                                    onClick={() =>
                                                        cambiarEstado(
                                                            recommendation.id,
                                                            "ACCEPTED"
                                                        )
                                                    }
                                                >
                                                    ACEPTADA
                                                </button>


                                                <button
                                                    type="button"
                                                    className="recommendation-reject-button"
                                                    onClick={() =>
                                                        cambiarEstado(
                                                            recommendation.id,
                                                            "REJECTED"
                                                        )
                                                    }
                                                >
                                                    RECHAZADA
                                                </button>


                                                <button
                                                    type="button"
                                                    className="recommendation-delete-button"
                                                    onClick={() =>
                                                        eliminar(
                                                            recommendation.id
                                                        )
                                                    }
                                                >
                                                    ELIMINAR
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </main>
    );
}


export default AdminRecommendationsPage;