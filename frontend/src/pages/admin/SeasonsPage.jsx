import {
    useEffect,
    useState
} from "react";

import {
    getAdminSeasons,
    getAdminSeriesForSeasons,
    createSeason,
    updateSeason,
    deleteSeason
} from "../../api/api.js";


function SeasonsPage() {

    // =================================================
    // DATOS
    // =================================================

    const [
        seasons,
        setSeasons
    ] = useState([]);


    const [
        series,
        setSeries
    ] = useState([]);


    // =================================================
    // ESTADOS
    // =================================================

    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        showForm,
        setShowForm
    ] = useState(false);


    const [
        editingId,
        setEditingId
    ] = useState(null);


    // =================================================
    // FORMULARIO
    // =================================================

    const [
        form,
        setForm
    ] = useState({

        seasonNumber: "",
        title: "",
        description: "",
        seriesId: ""

    });


    // =================================================
    // CARGA INICIAL
    // =================================================

    useEffect(() => {

        async function loadData() {

            try {

                setLoading(true);

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


                const [
                    seasonsData,
                    seriesData
                ] = await Promise.all([

                    getAdminSeasons(
                        token
                    ),

                    getAdminSeriesForSeasons(
                        token
                    )

                ]);


                setSeasons(
                    Array.isArray(seasonsData)
                        ? seasonsData
                        : []
                );


                setSeries(
                    Array.isArray(seriesData)
                        ? seriesData
                        : []
                );


            } catch (error) {

                console.error(
                    "Error cargando temporadas:",
                    error
                );


                setError(
                    error.message ||
                    "No fue posible cargar las temporadas."
                );


            } finally {

                setLoading(
                    false
                );

            }

        }


        loadData();

    }, []);


    // =================================================
    // CAMBIAR FORMULARIO
    // =================================================

    function handleChange(
        event
    ) {

        const {
            name,
            value
        } = event.target;


        setForm(
            previous => ({

                ...previous,

                [name]:
                value

            })
        );

    }


    // =================================================
    // INICIAR EDICIÓN
    // =================================================

    function iniciarEdicion(
        season
    ) {

        setEditingId(
            season.id
        );


        setForm({

            seasonNumber:
                season.seasonNumber || "",

            title:
                season.title || "",

            description:
                season.description || "",

            seriesId:
                season.seriesId || ""

        });


        setShowForm(
            true
        );


        setError("");

    }


    // =================================================
    // LIMPIAR FORMULARIO
    // =================================================

    function limpiarFormulario() {

        setForm({

            seasonNumber: "",
            title: "",
            description: "",
            seriesId: ""

        });


        setEditingId(
            null
        );


        setShowForm(
            false
        );


        setError("");

    }


    // =================================================
    // GUARDAR TEMPORADA
    // =================================================

    async function guardarSeason(
        event
    ) {

        event.preventDefault();

        setError("");


        try {

            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                throw new Error(
                    "No hay una sesión activa."
                );

            }


            const seasonData = {

                seasonNumber:
                    Number(
                        form.seasonNumber
                    ),

                title:
                    form.title.trim(),

                description:
                    form.description.trim(),

                seriesId:
                    Number(
                        form.seriesId
                    )

            };


            let savedSeason;


            // =================================================
            // ACTUALIZAR
            // =================================================

            if (
                editingId
            ) {

                savedSeason =
                    await updateSeason(
                        editingId,
                        seasonData,
                        token
                    );


                setSeasons(
                    previousSeasons =>
                        previousSeasons.map(
                            season =>
                                season.id ===
                                editingId

                                    ? savedSeason

                                    : season
                        )
                );


                // =================================================
                // CREAR
                // =================================================

            } else {

                savedSeason =
                    await createSeason(
                        seasonData,
                        token
                    );


                setSeasons(
                    previousSeasons => [

                        ...previousSeasons,

                        savedSeason

                    ]
                );

            }


            limpiarFormulario();


        } catch (error) {

            console.error(
                "Error guardando temporada:",
                error
            );


            setError(
                error.message ||
                "No fue posible guardar la temporada."
            );

        }

    }


    // =================================================
    // ELIMINAR TEMPORADA
    // =================================================

    async function eliminarSeason(
        id
    ) {

        const confirmar =
            window.confirm(
                "¿Seguro que deseas eliminar esta temporada?"
            );


        if (!confirmar) {

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


            await deleteSeason(
                id,
                token
            );


            setSeasons(
                previousSeasons =>
                    previousSeasons.filter(
                        season =>
                            season.id !== id
                    )
            );


        } catch (error) {

            console.error(
                "Error eliminando temporada:",
                error
            );


            setError(
                error.message ||
                "No fue posible eliminar la temporada."
            );

        }

    }


    // =================================================
    // RENDER
    // =================================================

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
                    TEMPORADAS
                </h1>


                <p>
                    Administra las temporadas que forman
                    parte de las series de NeoMotion.
                </p>

            </section>


            <section className="admin-content">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="admin-toolbar">

                    <div>

                        <span className="admin-toolbar-label">
                            CATÁLOGO
                        </span>


                        <strong>
                            {seasons.length}
                        </strong>


                        <span className="admin-toolbar-count">

                            {seasons.length === 1
                                ? " temporada registrada"
                                : " temporadas registradas"
                            }

                        </span>

                    </div>


                    <button
                        type="button"
                        className="admin-primary-button"
                        onClick={() => {

                            if (
                                showForm
                            ) {

                                limpiarFormulario();

                            } else {

                                setError("");

                                setShowForm(
                                    true
                                );

                            }

                        }}
                    >

                        {showForm
                            ? "CANCELAR"
                            : "+ NUEVA TEMPORADA"
                        }

                    </button>

                </div>


                {/* =================================================
                    FORMULARIO
                ================================================= */}

                {showForm && (

                    <form
                        onSubmit={
                            guardarSeason
                        }
                        className="series-form"
                    >

                        <div className="series-form-header">

                            <div>

                                <span className="admin-form-label">

                                    {editingId
                                        ? "EDICIÓN"
                                        : "NUEVO REGISTRO"
                                    }

                                </span>


                                <h2>

                                    {editingId
                                        ? "Editar temporada"
                                        : "Nueva temporada"
                                    }

                                </h2>

                            </div>

                        </div>


                        <div className="series-form-grid">


                            {/* =========================================
                                SERIE
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    SERIE
                                </label>


                                <select
                                    name="seriesId"
                                    value={
                                        form.seriesId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Selecciona una serie
                                    </option>


                                    {series.map(
                                        serie => (

                                            <option
                                                key={
                                                    serie.id
                                                }
                                                value={
                                                    serie.id
                                                }
                                            >

                                                {
                                                    serie.title
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =========================================
                                TEMPORADA
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    NÚMERO DE TEMPORADA
                                </label>


                                <input
                                    type="number"
                                    name="seasonNumber"
                                    min="1"
                                    value={
                                        form.seasonNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* =========================================
                                TÍTULO
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    TÍTULO
                                </label>


                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Ej. Temporada Única"
                                />

                            </div>


                            {/* =========================================
                                DESCRIPCIÓN
                            ========================================= */}

                            <div className="admin-field admin-field-full">

                                <label>
                                    DESCRIPCIÓN
                                </label>


                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows={5}
                                    placeholder="Descripción de la temporada..."
                                />

                            </div>

                        </div>


                        <div className="series-form-actions">

                            <button
                                type="button"
                                className="admin-secondary-button"
                                onClick={
                                    limpiarFormulario
                                }
                            >
                                CANCELAR
                            </button>


                            <button
                                type="submit"
                                className="admin-primary-button"
                            >

                                {editingId

                                    ? "GUARDAR CAMBIOS"

                                    : "CREAR TEMPORADA"

                                }

                            </button>

                        </div>

                    </form>

                )}


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
                    CARGANDO
                ================================================= */}

                {loading ? (

                    <div className="admin-empty-state">

                        <span>
                            CARGANDO
                        </span>


                        <p>
                            Cargando temporadas...
                        </p>

                    </div>

                ) : seasons.length === 0 ? (

                    /* =================================================
                       VACÍO
                    ================================================= */

                    <div className="admin-empty-state">

                        <span>
                            CATÁLOGO VACÍO
                        </span>


                        <p>
                            No hay temporadas registradas.
                        </p>


                        {!showForm && (

                            <button
                                type="button"
                                className="admin-primary-button"
                                onClick={() => {

                                    setError("");

                                    setShowForm(
                                        true
                                    );

                                }}
                            >
                                + NUEVA TEMPORADA
                            </button>

                        )}

                    </div>

                ) : (

                    /* =================================================
                       TABLA
                    ================================================= */

                    <div className="seasons-table-wrapper">

                        <table className="seasons-table">

                            <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    SERIE
                                </th>

                                <th>
                                    TEMPORADA
                                </th>

                                <th>
                                    DESCRIPCIÓN
                                </th>

                                <th>
                                    ACCIONES
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {seasons.map(
                                (
                                    season,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            season.id
                                        }
                                    >

                                        {/* =================================
                                                ÍNDICE
                                            ================================= */}

                                        <td className="seasons-table-index">

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

                                        <td className="seasons-table-series">

                                            <strong>
                                                {
                                                    season.seriesTitle
                                                }
                                            </strong>

                                        </td>


                                        {/* =================================
                                                TEMPORADA
                                            ================================= */}

                                        <td className="seasons-table-season">

                                                <span>

                                                    {
                                                        season.title ||
                                                        `Temporada ${season.seasonNumber}`
                                                    }

                                                </span>

                                            <small>

                                                N.º{" "}
                                                {
                                                    season.seasonNumber
                                                }

                                            </small>

                                        </td>


                                        {/* =================================
                                                DESCRIPCIÓN
                                            ================================= */}

                                        <td className="seasons-table-description">

                                            {
                                                season.description ||
                                                "Sin descripción"
                                            }

                                        </td>


                                        {/* =================================
                                                ACCIONES
                                            ================================= */}

                                        <td>

                                            <div className="season-actions">

                                                <button
                                                    type="button"
                                                    className="season-edit-button"
                                                    onClick={() =>
                                                        iniciarEdicion(
                                                            season
                                                        )
                                                    }
                                                >
                                                    EDITAR
                                                </button>


                                                <button
                                                    type="button"
                                                    className="season-delete-button"
                                                    onClick={() =>
                                                        eliminarSeason(
                                                            season.id
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


export default SeasonsPage;