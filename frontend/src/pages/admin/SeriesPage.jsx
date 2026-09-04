
import {
    useEffect,
    useState
} from "react";

import {
    getAdminSeries,
    getCategories,
    createSeries,
    updateSeries,
    deleteSeries,
    uploadFile
} from "../../api/api.js";



function SeriesPage() {

    // =================================================
    // DATOS
    // =================================================

    const [
        series,
        setSeries
    ] = useState([]);



    const [
        categories,
        setCategories
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



    const [
        uploadingImage,
        setUploadingImage
    ] = useState(false);



    // =================================================
    // FORMULARIO
    // =================================================

    const [
        form,
        setForm
    ] = useState({
        title: "",
        description: "",
        releaseYear: "",
        studio: "",
        imageUrl: "",
        categoryId: ""
    });



    // =================================================
    // ARCHIVO DE IMAGEN SELECCIONADO
    // =================================================

    const [
        imageFile,
        setImageFile
    ] = useState(null);



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
                    seriesData,
                    categoriesData
                ] = await Promise.all([

                    getAdminSeries(
                        token
                    ),

                    getCategories(
                        token
                    )

                ]);



                setSeries(
                    Array.isArray(seriesData)
                        ? seriesData
                        : []
                );



                setCategories(
                    Array.isArray(categoriesData)
                        ? categoriesData
                        : []
                );



            } catch (error) {

                console.error(
                    "Error cargando series:",
                    error
                );



                setError(
                    error.message ||
                    "No fue posible cargar las series."
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
    // INICIAR EDICIÓN
    // =================================================

    function iniciarEdicion(
        serie
    ) {

        const category =
            categories.find(
                category =>
                    category.name ===
                    serie.category
            );



        setEditingId(
            serie.id
        );



        setForm({

            title:
                serie.title || "",

            description:
                serie.description || "",

            releaseYear:
                serie.releaseYear || "",

            studio:
                serie.studio || "",

            imageUrl:
                serie.imageUrl || "",

            categoryId:
                category
                    ? category.id
                    : ""

        });



        setImageFile(
            null
        );



        setShowForm(
            true
        );



        setError("");

    }



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
    // SELECCIONAR IMAGEN
    // =================================================

    function handleImageChange(
        event
    ) {

        const file =
            event.target.files?.[0];



        if (!file) {

            setImageFile(
                null
            );

            return;

        }



        setImageFile(
            file
        );



        setError("");

    }



    // =================================================
    // LIMPIAR FORMULARIO
    // =================================================

    function limpiarFormulario() {

        setForm({

            title: "",
            description: "",
            releaseYear: "",
            studio: "",
            imageUrl: "",
            categoryId: ""

        });



        setImageFile(
            null
        );



        setEditingId(
            null
        );



        setShowForm(
            false
        );



        setError("");

    }



    // =================================================
    // GUARDAR SERIE
    // =================================================

    async function guardarSerie(
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



            let imageUrl =
                form.imageUrl || "";



            // =================================================
            // SUBIR IMAGEN SI SE SELECCIONÓ UNA
            // =================================================

            if (imageFile) {

                setUploadingImage(
                    true
                );



                const uploadResponse =
                    await uploadFile(
                        imageFile,
                        "image",
                        token
                    );



                imageUrl =
                    uploadResponse.url;



                setUploadingImage(
                    false
                );

            }



            const seriesData = {

                title:
                    form.title.trim(),

                description:
                    form.description.trim(),

                releaseYear:
                    Number(
                        form.releaseYear
                    ),

                studio:
                    form.studio.trim(),

                imageUrl:
                    imageUrl,

                categoryId:
                    Number(
                        form.categoryId
                    )

            };



            let savedSeries;



            // =================================================
            // ACTUALIZAR
            // =================================================

            if (
                editingId
            ) {

                savedSeries =
                    await updateSeries(
                        editingId,
                        seriesData,
                        token
                    );



                setSeries(
                    previousSeries =>
                        previousSeries.map(
                            serie =>
                                serie.id ===
                                editingId

                                    ? savedSeries

                                    : serie
                        )
                );



            // =================================================
            // CREAR
            // =================================================

            } else {

                savedSeries =
                    await createSeries(
                        seriesData,
                        token
                    );



                setSeries(
                    previousSeries => [

                        ...previousSeries,

                        savedSeries

                    ]
                );

            }



            limpiarFormulario();



        } catch (error) {

            console.error(
                "Error guardando serie:",
                error
            );



            setUploadingImage(
                false
            );



            setError(
                error.message ||
                "No fue posible guardar la serie."
            );

        }

    }



    // =================================================
    // ELIMINAR SERIE
    // =================================================

    async function eliminarSerie(
        id
    ) {

        const confirmar =
            window.confirm(
                "¿Está seguro de que desea eliminar esta serie?"
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



            await deleteSeries(
                id,
                token
            );



            setSeries(
                previousSeries =>
                    previousSeries.filter(
                        serie =>
                            serie.id !== id
                    )
            );



        } catch (error) {

            console.error(
                "Error eliminando serie:",
                error
            );



            setError(
                error.message ||
                "No fue posible eliminar la serie."
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
                    SERIES
                </h1>



                <p>
                    Administra las series que forman parte
                    de la programación de NeoMotion.
                </p>

            </section>



            <section className="admin-content">



                {/* =================================================
                    BARRA DE ACCIONES
                ================================================= */}

                <div className="admin-toolbar">

                    <div>

                        <span className="admin-toolbar-label">
                            CATÁLOGO
                        </span>



                        <strong>
                            {series.length}
                        </strong>



                        <span className="admin-toolbar-count">
                            {series.length === 1
                                ? " serie registrada"
                                : " series registradas"
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

                                setImageFile(
                                    null
                                );

                                setShowForm(
                                    true
                                );

                            }

                        }}
                    >

                        {showForm
                            ? "CANCELAR"
                            : "+ NUEVA SERIE"
                        }

                    </button>

                </div>



                {/* =================================================
                    FORMULARIO
                ================================================= */}

                {showForm && (

                    <form
                        onSubmit={
                            guardarSerie
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
                                        ? "Editar serie"
                                        : "Nueva serie"
                                    }
                                </h2>

                            </div>

                        </div>



                        <div className="series-form-grid">



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
                                    required
                                />

                            </div>



                            {/* =========================================
                                AÑO
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    AÑO DE LANZAMIENTO
                                </label>



                                <input
                                    type="number"
                                    name="releaseYear"
                                    value={
                                        form.releaseYear
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="1900"
                                    required
                                />

                            </div>



                            {/* =========================================
                                ESTUDIO
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    ESTUDIO
                                </label>



                                <input
                                    type="text"
                                    name="studio"
                                    value={
                                        form.studio
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>



                            {/* =========================================
                                CATEGORÍA
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    CATEGORÍA
                                </label>



                                <select
                                    name="categoryId"
                                    value={
                                        form.categoryId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Selecciona una categoría
                                    </option>



                                    {categories.map(
                                        category => (

                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >

                                                {
                                                    category.name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>



                            {/* =========================================
                                IMAGEN
                            ========================================= */}

                            <div className="admin-field admin-field-full">

                                <label>
                                    IMAGEN DE LA SERIE
                                </label>



                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleImageChange
                                    }
                                />



                                {imageFile && (

                                    <span>
                                        Imagen seleccionada:{" "}
                                        {imageFile.name}
                                    </span>

                                )}



                                {!imageFile &&
                                    form.imageUrl && (

                                        <span>
                                            La serie ya tiene una imagen.
                                            Selecciona otra para reemplazarla.
                                        </span>

                                    )}

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
                                    placeholder="Descripción de la serie..."
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
                                disabled={
                                    uploadingImage
                                }
                            >
                                CANCELAR
                            </button>



                            <button
                                type="submit"
                                className="admin-primary-button"
                                disabled={
                                    uploadingImage
                                }
                            >

                                {uploadingImage

                                    ? "SUBIENDO IMAGEN..."

                                    : editingId
                                        ? "GUARDAR CAMBIOS"
                                        : "CREAR SERIE"

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
                    LOADING
                ================================================= */}

                {loading ? (

                    <div className="admin-empty-state">

                        <span>
                            CARGANDO
                        </span>



                        <p>
                            Cargando catálogo de series...
                        </p>

                    </div>

                ) : series.length === 0 ? (

                    /* =================================================
                       SIN SERIES
                    ================================================= */

                    <div className="admin-empty-state">

                        <span>
                            CATÁLOGO VACÍO
                        </span>



                        <p>
                            No hay series registradas.
                        </p>



                        {!showForm && (

                            <button
                                type="button"
                                className="admin-primary-button"
                                onClick={() => {

                                    setError("");

                                    setImageFile(
                                        null
                                    );

                                    setShowForm(
                                        true
                                    );

                                }}
                            >
                                + NUEVA SERIE
                            </button>

                        )}

                    </div>

                ) : (

                    /* =================================================
                       TABLA
                    ================================================= */

                    <div className="series-table-wrapper">

                        <table className="series-table">

                            <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    SERIE
                                </th>

                                <th>
                                    AÑO
                                </th>

                                <th>
                                    ESTUDIO
                                </th>

                                <th>
                                    CATEGORÍA
                                </th>

                                <th>
                                    ACCIONES
                                </th>

                            </tr>

                            </thead>



                            <tbody>

                            {series.map(
                                (
                                    serie,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            serie.id
                                        }
                                    >

                                        {/* =================================
                                                NÚMERO
                                            ================================= */}

                                        <td className="series-table-index">

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

                                        <td className="series-table-title">

                                            <strong>
                                                {
                                                    serie.title
                                                }
                                            </strong>



                                            {serie.description && (

                                                <span>
                                                    {
                                                        serie.description
                                                    }
                                                </span>

                                            )}

                                        </td>



                                        {/* =================================
                                                AÑO
                                            ================================= */}

                                        <td>

                                            {
                                                serie.releaseYear
                                            }

                                        </td>



                                        {/* =================================
                                                ESTUDIO
                                            ================================= */}

                                        <td>

                                            {
                                                serie.studio ||
                                                "—"
                                            }

                                        </td>



                                        {/* =================================
                                                CATEGORÍA
                                            ================================= */}

                                        <td>

                                            <span className="series-category">

                                                {
                                                    serie.category ||
                                                    "—"
                                                }

                                            </span>

                                        </td>



                                        {/* =================================
                                                ACCIONES
                                            ================================= */}

                                        <td>

                                            <div className="series-actions">

                                                <button
                                                    type="button"
                                                    className="series-edit-button"
                                                    onClick={() =>
                                                        iniciarEdicion(
                                                            serie
                                                        )
                                                    }
                                                >
                                                    EDITAR
                                                </button>



                                                <button
                                                    type="button"
                                                    className="series-delete-button"
                                                    onClick={() =>
                                                        eliminarSerie(
                                                            serie.id
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



export default SeriesPage;

