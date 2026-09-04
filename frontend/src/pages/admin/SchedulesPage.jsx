import {
    useEffect,
    useState
} from "react";

import {
    getSchedulesRange,
    getScheduleEpisodes,
    getScheduleMediaContent,
    createSchedule,
    createNextSchedule,
    updateSchedule,
    deleteSchedule
} from "../../api/api.js";


function SchedulesPage() {

    // =================================================
    // DATOS
    // =================================================

    const [schedules, setSchedules] = useState([]);

    const [episodes, setEpisodes] = useState([]);

    const [mediaContent, setMediaContent] = useState([]);


    // =================================================
    // ESTADOS
    // =================================================

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =================================================
    // FORMULARIO
    // =================================================

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [scheduleMode, setScheduleMode] =
        useState("MANUAL");


    const [form, setForm] = useState({

        airDate: "",

        startTime: "",

        contentType: "EPISODE",

        episodeId: "",

        mediaContentId: "",

        contentStartOffset: "",

        contentEndOffset: ""

    });


    // =================================================
    // VISTA DE PROGRAMACIÓN
    // =================================================

    const [viewMode, setViewMode] =
        useState("DAY");


    const [selectedDate, setSelectedDate] =
        useState(getTodayString());


    // =================================================
    // RANGO ACTUAL
    // =================================================

    const [rangeStart, setRangeStart] =
        useState(getTodayString());

    const [rangeEnd, setRangeEnd] =
        useState(getTodayString());


    // =================================================
    // FECHA ACTUAL
    // =================================================

    function getTodayString() {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );

        return `${year}-${month}-${day}`;
    }
    // =================================================
// OBTENER MENSAJE DE ERROR DEL BACKEND
// =================================================

    async function obtenerMensajeError(
        response,
        fallback
    ) {

        try {

            const text =
                await response.text();


            if (!text) {

                return fallback;
            }


            try {

                const data =
                    JSON.parse(text);

                return (
                    data.message ||
                    fallback
                );

            } catch {

                return text;

            }

        } catch {

            return fallback;

        }
    }


    // =================================================
    // CONVERTIR STRING A FECHA
    // =================================================

    function parseDate(dateString) {

        const [
            year,
            month,
            day
        ] =
            dateString
                .split("-")
                .map(Number);

        return new Date(
            year,
            month - 1,
            day
        );
    }


    // =================================================
    // FORMATEAR FECHA ISO
    // =================================================

    function toDateString(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );

        return `${year}-${month}-${day}`;
    }


    // =================================================
    // SUMAR DÍAS
    // =================================================

    function addDays(
        dateString,
        amount
    ) {

        const date =
            parseDate(
                dateString
            );

        date.setDate(
            date.getDate() + amount
        );

        return toDateString(
            date
        );
    }


    // =================================================
    // CALCULAR RANGO
    // =================================================

    function calculateRange(
        mode,
        baseDate
    ) {

        let startDate =
            baseDate;

        let endDate =
            baseDate;


        if (mode === "DAY") {

            startDate =
                baseDate;

            endDate =
                baseDate;

        }


        if (mode === "WEEK") {

            startDate =
                baseDate;

            endDate =
                addDays(
                    baseDate,
                    6
                );

        }


        if (mode === "TWO_WEEKS") {

            startDate =
                baseDate;

            endDate =
                addDays(
                    baseDate,
                    13
                );

        }


        if (mode === "MONTH") {

            const date =
                parseDate(
                    baseDate
                );


            const year =
                date.getFullYear();

            const month =
                date.getMonth();


            startDate =
                toDateString(
                    new Date(
                        year,
                        month,
                        1
                    )
                );


            endDate =
                toDateString(
                    new Date(
                        year,
                        month + 1,
                        0
                    )
                );

        }


        return {
            startDate,
            endDate
        };
    }


    // =================================================
    // CAMBIAR VISTA
    // =================================================

    function changeViewMode(
        mode
    ) {

        setViewMode(
            mode
        );


        const baseDate =
            mode === "MONTH"

                ? selectedDate

                : selectedDate;


        const range =
            calculateRange(
                mode,
                baseDate
            );


        setRangeStart(
            range.startDate
        );

        setRangeEnd(
            range.endDate
        );
    }


    // =================================================
    // CAMBIAR FECHA BASE
    // =================================================

    function changeBaseDate(
        date
    ) {

        setSelectedDate(
            date
        );


        const range =
            calculateRange(
                viewMode,
                date
            );


        setRangeStart(
            range.startDate
        );

        setRangeEnd(
            range.endDate
        );
    }


    // =================================================
    // NAVEGAR PERÍODO ANTERIOR
    // =================================================

    function previousPeriod() {

        let newDate;


        if (viewMode === "MONTH") {

            const date =
                parseDate(
                    selectedDate
                );

            date.setMonth(
                date.getMonth() - 1
            );

            newDate =
                toDateString(
                    date
                );

        } else {

            const days =
                viewMode === "DAY"
                    ? 1
                    : viewMode === "WEEK"
                        ? 7
                        : 14;

            newDate =
                addDays(
                    selectedDate,
                    -days
                );
        }


        changeBaseDate(
            newDate
        );
    }


    // =================================================
    // NAVEGAR PERÍODO SIGUIENTE
    // =================================================

    function nextPeriod() {

        let newDate;


        if (viewMode === "MONTH") {

            const date =
                parseDate(
                    selectedDate
                );

            date.setMonth(
                date.getMonth() + 1
            );

            newDate =
                toDateString(
                    date
                );

        } else {

            const days =
                viewMode === "DAY"
                    ? 1
                    : viewMode === "WEEK"
                        ? 7
                        : 14;

            newDate =
                addDays(
                    selectedDate,
                    days
                );
        }


        changeBaseDate(
            newDate
        );
    }


    // =================================================
    // CARGAR DATOS INICIALES
    // =================================================

    useEffect(() => {

        cargarEpisodes();

        cargarMediaContent();

    }, []);


    // =================================================
    // CARGAR PROGRAMACIÓN
    // =================================================

    useEffect(() => {

        const range =
            calculateRange(
                viewMode,
                selectedDate
            );


        setRangeStart(
            range.startDate
        );

        setRangeEnd(
            range.endDate
        );


        cargarSchedules(
            range.startDate,
            range.endDate
        );

    }, [
        viewMode,
        selectedDate
    ]);


    // =================================================
    // CARGAR PROGRAMACIÓN
    // =================================================

    async function cargarSchedules(
        startDate,
        endDate
    ) {

        try {

            setLoading(
                true
            );


            setError(
                ""
            );


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
                await getSchedulesRange(
                    startDate,
                    endDate,
                    token
                );


            setSchedules(
                data
            );


        } catch (error) {

            console.error(
                "Error cargando programación:",
                error
            );


            setError(
                error.message ||
                "No fue posible cargar la programación."
            );


        } finally {

            setLoading(
                false
            );
        }
    }


    // =================================================
    // CARGAR EPISODIOS
    // =================================================

    async function cargarEpisodes() {

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


            const data =
                await getScheduleEpisodes(
                    token
                );


            setEpisodes(
                data
            );


        } catch (error) {

            console.error(
                "Error cargando episodios:",
                error
            );


            setError(
                error.message ||
                "No fue posible cargar los episodios."
            );
        }
    }


    // =================================================
    // CARGAR CONTENIDO MULTIMEDIA
    // =================================================

    async function cargarMediaContent() {

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


            const data =
                await getScheduleMediaContent(
                    token
                );


            setMediaContent(
                data
            );


        } catch (error) {

            console.error(
                "Error cargando contenido multimedia:",
                error
            );


            setError(
                error.message ||
                "No fue posible cargar el contenido multimedia."
            );
        }
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
        } =
            event.target;


        setForm({
            ...form,
            [name]:
            value
        });
    }


    // =================================================
    // CAMBIAR TIPO
    // =================================================

    function handleContentTypeChange(
        event
    ) {

        const contentType =
            event.target.value;


        setForm({
            ...form,

            contentType:

            contentType,

            episodeId:
                "",

            mediaContentId:
                "",

            contentStartOffset:
                "",

            contentEndOffset:
                ""
        });
    }


    // =================================================
    // EDITAR
    // =================================================

    function iniciarEdicion(
        schedule
    ) {

        setError(
            ""
        );


        setEditingId(
            schedule.id
        );


        setScheduleMode(
            "MANUAL"
        );


        const contentType =

            schedule.contentType ===
            "MEDIA_CONTENT"

                ? "MEDIA_CONTENT"

                : "EPISODE";


        setForm({

            airDate:
                schedule.airDate || "",

            startTime:
                schedule.startTime
                    ?.slice(
                        0,
                        5
                    ) || "",

            contentType:
            contentType,

            episodeId:
                schedule.episodeId
                    ? String(
                        schedule.episodeId
                    )
                    : "",

            mediaContentId:
                schedule.mediaContentId
                    ? String(
                        schedule.mediaContentId
                    )
                    : "",

            contentStartOffset:
                schedule.contentStartOffset ??
                "",

            contentEndOffset:
                schedule.contentEndOffset ??
                ""
        });


        setShowForm(
            true
        );
    }


// =================================================
// GUARDAR
// =================================================

    async function guardarSchedule(
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


            // =============================================
            // DATOS
            // =============================================

            const body = {

                airDate:
                form.airDate,

                startTime:

                    scheduleMode === "NEXT" &&
                    !editingId

                        ? null

                        : form.startTime,

                contentStartOffset:

                    form.contentStartOffset !== ""

                        ? Number(
                            form.contentStartOffset
                        )

                        : null,

                contentEndOffset:

                    form.contentEndOffset !== ""

                        ? Number(
                            form.contentEndOffset
                        )

                        : null,

                episodeId:

                    form.contentType ===
                    "EPISODE"

                        ? Number(
                            form.episodeId
                        )

                        : null,

                mediaContentId:

                    form.contentType ===
                    "MEDIA_CONTENT"

                        ? Number(
                            form.mediaContentId
                        )

                        : null
            };


            // =============================================
            // GUARDAR
            // =============================================

            if (editingId) {

                await updateSchedule(
                    editingId,
                    body,
                    token
                );

            } else if (
                scheduleMode === "NEXT"
            ) {

                await createNextSchedule(
                    body,
                    token
                );

            } else {

                await createSchedule(
                    body,
                    token
                );
            }


            // =============================================
            // RECARGAR PROGRAMACIÓN
            // =============================================

            await cargarSchedules(
                rangeStart,
                rangeEnd
            );


            // =============================================
            // LIMPIAR FORMULARIO
            // =============================================

            limpiarFormulario();

        } catch (error) {

            console.error(
                "Error guardando programación:",
                error
            );


            setError(
                error.message ||
                "No fue posible guardar la programación."
            );
        }
    }


// =================================================
// ELIMINAR
// =================================================

    async function eliminarSchedule(
        id
    ) {

        const confirmar =
            window.confirm(
                "¿Seguro que deseas eliminar esta programación?"
            );


        if (!confirmar) {

            return;
        }


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


            await deleteSchedule(
                id,
                token
            );


            await cargarSchedules(
                rangeStart,
                rangeEnd
            );


        } catch (error) {

            console.error(
                "Error eliminando programación:",
                error
            );


            setError(
                error.message ||
                "No fue posible eliminar la programación."
            );
        }
    }

    // =================================================
    // NUEVA PROGRAMACIÓN
    // =================================================

    function nuevaProgramacion(
        mode
    ) {

        setError(
            ""
        );


        setEditingId(
            null
        );


        setScheduleMode(
            mode
        );


        setForm({

            airDate:
            selectedDate,

            startTime:
                "",

            contentType:
                "EPISODE",

            episodeId:
                "",

            mediaContentId:
                "",

            contentStartOffset:
                "",

            contentEndOffset:
                ""
        });


        setShowForm(
            true
        );
    }


    // =================================================
    // LIMPIAR
    // =================================================

    function limpiarFormulario() {

        setForm({

            airDate:
            selectedDate,

            startTime:
                "",

            contentType:
                "EPISODE",

            episodeId:
                "",

            mediaContentId:
                "",

            contentStartOffset:
                "",

            contentEndOffset:
                ""
        });


        setEditingId(
            null
        );


        setScheduleMode(
            "MANUAL"
        );


        setShowForm(
            false
        );


        setError(
            ""
        );
    }


    // =================================================
    // AGRUPAR POR FECHA
    // =================================================

    const schedulesByDate =
        schedules.reduce(
            (
                groups,
                schedule
            ) => {

                const date =
                    schedule.airDate;


                if (!groups[date]) {

                    groups[date] =
                        [];
                }


                groups[date].push(
                    schedule
                );


                return groups;

            },
            {}
        );


    // =================================================
    // ORDENAR FECHAS
    // =================================================

    const sortedDates =
        Object.keys(
            schedulesByDate
        ).sort();


    // =================================================
    // FORMATEAR FECHA
    // =================================================

    function formatDate(
        airDate
    ) {

        const date =
            parseDate(
                airDate
            );


        return date
            .toLocaleDateString(
                "es-CO",
                {
                    weekday:
                        "long",

                    year:
                        "numeric",

                    month:
                        "long",

                    day:
                        "numeric"
                }
            )
            .toUpperCase();
    }


    // =================================================
    // FORMATEAR DURACIÓN
    // =================================================

    function formatDuration(
        seconds
    ) {

        if (
            seconds === null ||
            seconds === undefined ||
            Number.isNaN(
                Number(seconds)
            )
        ) {

            return "--:--";
        }


        const totalSeconds =
            Number(seconds);


        const hours =
            Math.floor(
                totalSeconds / 3600
            );


        const minutes =
            Math.floor(
                (
                    totalSeconds % 3600
                ) / 60
            );


        const remainingSeconds =
            totalSeconds % 60;


        const formattedMinutes =
            String(
                minutes
            ).padStart(
                2,
                "0"
            );


        const formattedSeconds =
            String(
                remainingSeconds
            ).padStart(
                2,
                "0"
            );


        if (
            hours > 0
        ) {

            return (

                `${String(
                    hours
                ).padStart(
                    2,
                    "0"
                )}:` +

                `${formattedMinutes}:` +

                `${formattedSeconds}`

            );
        }


        return (

            `${formattedMinutes}:` +

            `${formattedSeconds}`

        );
    }


    // =================================================
    // RANGO MOSTRADO
    // =================================================

    function formatRangeTitle() {

        const start =
            parseDate(
                rangeStart
            );

        const end =
            parseDate(
                rangeEnd
            );


        if (
            rangeStart ===
            rangeEnd
        ) {

            return formatDate(
                rangeStart
            );
        }


        return (

            `${start.toLocaleDateString(
                "es-CO",
                {
                    day:
                        "numeric",

                    month:
                        "long"
                }
            )} — ${end.toLocaleDateString(
                "es-CO",
                {
                    day:
                        "numeric",

                    month:
                        "long",

                    year:
                        "numeric"
                }
            )}`

        );
    }


    // =================================================
// LOADING
// =================================================

    if (loading) {

        return (

            <main className="admin-page">

                <section className="admin-page-header">

                    <p className="section-label">
                        ADMINISTRACIÓN DE NEOMOTION
                    </p>

                    <h1>
                        PROGRAMACIÓN
                    </h1>

                    <p>
                        Cargando consola de programación...
                    </p>

                </section>

            </main>
        );
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
                    PROGRAMACIÓN
                </h1>


                <p>
                    Administra la programación de NeoMotion
                    por días, semanas y períodos completos.
                </p>

            </section>


            <section className="admin-content">


                {/* =================================================
                CONTROLES DE VISTA
            ================================================= */}

                <div className="schedule-toolbar">


                    {/* =================================================
                    VISTAS
                ================================================= */}

                    <div className="schedule-view-switcher">

                        <button
                            type="button"
                            className={
                                viewMode === "DAY"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                changeViewMode(
                                    "DAY"
                                )
                            }
                        >
                            HOY / DÍA
                        </button>


                        <button
                            type="button"
                            className={
                                viewMode === "WEEK"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                changeViewMode(
                                    "WEEK"
                                )
                            }
                        >
                            SEMANA
                        </button>


                        <button
                            type="button"
                            className={
                                viewMode === "TWO_WEEKS"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                changeViewMode(
                                    "TWO_WEEKS"
                                )
                            }
                        >
                            2 SEMANAS
                        </button>


                        <button
                            type="button"
                            className={
                                viewMode === "MONTH"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                changeViewMode(
                                    "MONTH"
                                )
                            }
                        >
                            MES
                        </button>

                    </div>


                    {/* =================================================
                    NAVEGACIÓN
                ================================================= */}

                    <div className="schedule-period-navigation">

                        <button
                            type="button"
                            onClick={
                                previousPeriod
                            }
                            aria-label="Período anterior"
                        >
                            ←
                        </button>


                        <strong>
                            {
                                formatRangeTitle()
                            }
                        </strong>


                        <button
                            type="button"
                            onClick={
                                nextPeriod
                            }
                            aria-label="Período siguiente"
                        >
                            →
                        </button>

                    </div>

                </div>


                {/* =================================================
                FECHA + ACCIONES
            ================================================= */}

                <div className="schedule-control-row">


                    <div className="schedule-date-selector">

                        <label>
                            FECHA DE REFERENCIA
                        </label>


                        <input
                            type="date"
                            value={
                                selectedDate
                            }
                            onChange={
                                event =>
                                    changeBaseDate(
                                        event.target.value
                                    )
                            }
                        />

                    </div>


                    <div className="schedule-create-actions">

                        <button
                            type="button"
                            onClick={() =>
                                nuevaProgramacion(
                                    "MANUAL"
                                )
                            }
                        >
                            + NUEVA PROGRAMACIÓN
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                nuevaProgramacion(
                                    "NEXT"
                                )
                            }
                        >
                            + AGREGAR SIGUIENTE
                        </button>

                    </div>

                </div>


                {/* =================================================
                FORMULARIO
            ================================================= */}

                {showForm && (

                    <form
                        onSubmit={
                            guardarSchedule
                        }
                        className="schedules-form"
                    >

                        <div className="series-form-header">

                            <div>

                            <span className="admin-form-label">

                                {editingId
                                    ? "EDICIÓN"
                                    : scheduleMode === "NEXT"
                                        ? "PROGRAMACIÓN CONTINUA"
                                        : "NUEVO REGISTRO"
                                }

                            </span>


                                <h2>

                                    {editingId

                                        ? "Editar programación"

                                        : scheduleMode === "NEXT"

                                            ? "Agregar siguiente contenido"

                                            : "Nueva programación"

                                    }

                                </h2>

                            </div>

                        </div>


                        {/* =================================================
                        AVISO MODO NEXT
                    ================================================= */}

                        {!editingId &&
                            scheduleMode === "NEXT" && (

                                <div className="schedule-form-notice">

                                    El contenido se agregará
                                    automáticamente después
                                    del último bloque programado
                                    para la fecha seleccionada.

                                </div>

                            )}


                        <div className="schedules-form-grid">


                            {/* =================================================
                            TIPO
                        ================================================= */}

                            <div className="admin-field">

                                <label>
                                    TIPO DE CONTENIDO
                                </label>


                                <select
                                    value={
                                        form.contentType
                                    }
                                    onChange={
                                        handleContentTypeChange
                                    }
                                    required
                                >

                                    <option value="EPISODE">
                                        EPISODIO
                                    </option>


                                    <option value="MEDIA_CONTENT">
                                        CONTENIDO MULTIMEDIA
                                    </option>

                                </select>

                            </div>


                            {/* =================================================
                            EPISODIO
                        ================================================= */}

                            {form.contentType ===
                                "EPISODE" && (

                                    <div className="admin-field admin-field-full">

                                        <label>
                                            EPISODIO
                                        </label>


                                        <select
                                            name="episodeId"
                                            value={
                                                form.episodeId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Selecciona un episodio
                                            </option>


                                            {episodes.map(
                                                episode => (

                                                    <option
                                                        key={
                                                            episode.id
                                                        }
                                                        value={
                                                            episode.id
                                                        }
                                                    >

                                                        {
                                                            episode.seriesTitle
                                                        }

                                                        {" — "}

                                                        {
                                                            episode.seasonTitle
                                                        }

                                                        {" — EP. "}

                                                        {
                                                            episode.episodeNumber
                                                        }

                                                        {" — "}

                                                        {
                                                            episode.title
                                                        }

                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                )}


                            {/* =================================================
                            MULTIMEDIA
                        ================================================= */}

                            {form.contentType ===
                                "MEDIA_CONTENT" && (

                                    <div className="admin-field admin-field-full">

                                        <label>
                                            CONTENIDO MULTIMEDIA
                                        </label>


                                        <select
                                            name="mediaContentId"
                                            value={
                                                form.mediaContentId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Selecciona contenido multimedia
                                            </option>


                                            {mediaContent.map(
                                                content => (

                                                    <option
                                                        key={
                                                            content.id
                                                        }
                                                        value={
                                                            content.id
                                                        }
                                                    >

                                                        {
                                                            content.title
                                                        }

                                                        {" — "}

                                                        {
                                                            content.type
                                                        }

                                                        {" — "}

                                                        {
                                                            formatDuration(
                                                                content.durationSeconds
                                                            )
                                                        }

                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                )}


                            {/* =================================================
                            FECHA
                        ================================================= */}

                            <div className="admin-field">

                                <label>
                                    FECHA DE TRANSMISIÓN
                                </label>


                                <input
                                    type="date"
                                    name="airDate"
                                    value={
                                        form.airDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* =================================================
                            HORA
                        ================================================= */}

                            {(editingId ||
                                scheduleMode === "MANUAL") && (

                                <div className="admin-field">

                                    <label>
                                        HORA DE INICIO
                                    </label>


                                    <input
                                        type="time"
                                        name="startTime"
                                        value={
                                            form.startTime
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            )}


                            {/* =================================================
                            OFFSET INICIAL
                        ================================================= */}

                            <div className="admin-field">

                                <label>
                                    INICIO DEL CONTENIDO
                                    {" "}
                                    <span>
                                    (SEGUNDOS)
                                </span>
                                </label>


                                <input
                                    type="number"
                                    name="contentStartOffset"
                                    min="0"
                                    value={
                                        form.contentStartOffset
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* =================================================
                            OFFSET FINAL
                        ================================================= */}

                            <div className="admin-field">

                                <label>
                                    FIN DEL CONTENIDO
                                    {" "}
                                    <span>
                                    (SEGUNDOS)
                                </span>
                                </label>


                                <input
                                    type="number"
                                    name="contentEndOffset"
                                    min="1"
                                    value={
                                        form.contentEndOffset
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>


                        <p className="schedule-form-help">

                            Si dejas los offsets vacíos,
                            NeoMotion utilizará el contenido completo.

                        </p>


                        {/* =================================================
                        ACCIONES FORMULARIO
                    ================================================= */}

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

                                    : scheduleMode === "NEXT"

                                        ? "AGREGAR A CONTINUACIÓN"

                                        : "PROGRAMAR CONTENIDO"

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
                SIN PROGRAMACIÓN
            ================================================= */}

                {!error &&
                    schedules.length === 0 && (

                        <div className="admin-empty-state">

                        <span>
                            SIN PROGRAMACIÓN
                        </span>


                            <p>
                                No hay programación registrada
                                para este período.
                            </p>


                            <button
                                type="button"
                                className="admin-primary-button"
                                onClick={() =>
                                    nuevaProgramacion(
                                        "MANUAL"
                                    )
                                }
                            >
                                + NUEVA PROGRAMACIÓN
                            </button>

                        </div>

                    )}


                {/* =================================================
                PROGRAMACIÓN
            ================================================= */}

                {!error &&
                    schedules.length > 0 && (

                        <div className="schedules-days">


                            {sortedDates.map(
                                airDate => {

                                    const daySchedules =
                                        schedulesByDate[
                                            airDate
                                            ] || [];


                                    return (

                                        <section
                                            key={
                                                airDate
                                            }
                                            className="schedule-day"
                                        >


                                            {/* =================================================
                                            CABECERA DEL DÍA
                                        ================================================= */}

                                            <div className="schedule-day-header">

                                                <div>

                                                    <p>
                                                        PROGRAMACIÓN
                                                    </p>


                                                    <h2>
                                                        {
                                                            formatDate(
                                                                airDate
                                                            )
                                                        }
                                                    </h2>

                                                </div>


                                                <span>

                                                {
                                                    daySchedules.length
                                                }

                                                    {" "}

                                                    {
                                                        daySchedules.length === 1
                                                            ? "CONTENIDO"
                                                            : "CONTENIDOS"
                                                    }

                                            </span>

                                            </div>


                                            {/* =================================================
                                            TABLA DEL DÍA
                                        ================================================= */}

                                            <div className="schedules-table-wrapper">

                                                <table className="schedules-table">

                                                    <thead>

                                                    <tr>

                                                        <th>
                                                            #
                                                        </th>

                                                        <th>
                                                            HORARIO
                                                        </th>

                                                        <th>
                                                            TIPO
                                                        </th>

                                                        <th>
                                                            CONTENIDO
                                                        </th>

                                                        <th>
                                                            FRAGMENTO
                                                        </th>

                                                        <th>
                                                            ACCIONES
                                                        </th>

                                                    </tr>

                                                    </thead>


                                                    <tbody>

                                                    {daySchedules.map(
                                                        (
                                                            schedule,
                                                            index
                                                        ) => {

                                                            const contentType =
                                                                schedule.contentType ===
                                                                "EPISODE"

                                                                    ? "EPISODE"

                                                                    : "MEDIA_CONTENT";


                                                            const isEpisode =
                                                                contentType ===
                                                                "EPISODE";


                                                            const hasStartOffset =
                                                                schedule.contentStartOffset !==
                                                                null &&
                                                                schedule.contentStartOffset !==
                                                                undefined;


                                                            const hasEndOffset =
                                                                schedule.contentEndOffset !==
                                                                null &&
                                                                schedule.contentEndOffset !==
                                                                undefined;


                                                            return (

                                                                <tr
                                                                    key={
                                                                        schedule.id
                                                                    }
                                                                >


                                                                    {/* =================================
                                                                        ÍNDICE
                                                                    ================================= */}

                                                                    <td className="schedules-table-index">

                                                                        {String(
                                                                            index + 1
                                                                        ).padStart(
                                                                            2,
                                                                            "0"
                                                                        )}

                                                                    </td>


                                                                    {/* =================================
                                                                        HORARIO
                                                                    ================================= */}

                                                                    <td className="schedules-table-time">

                                                                        <strong>

                                                                            {
                                                                                schedule
                                                                                    .startTime
                                                                                    ?.slice(
                                                                                        0,
                                                                                        5
                                                                                    )
                                                                            }

                                                                            <span>
                                                                                →
                                                                            </span>

                                                                            {
                                                                                schedule
                                                                                    .endTime
                                                                                    ?.slice(
                                                                                        0,
                                                                                        5
                                                                                    )
                                                                            }

                                                                        </strong>

                                                                    </td>


                                                                    {/* =================================
                                                                        TIPO
                                                                    ================================= */}

                                                                    <td>

                                                                        <span
                                                                            className={
                                                                                isEpisode
                                                                                    ? "schedule-type schedule-type-episode"
                                                                                    : "schedule-type schedule-type-media"
                                                                            }
                                                                        >

                                                                            {
                                                                                isEpisode
                                                                                    ? "EPISODIO"
                                                                                    : "MULTIMEDIA"
                                                                            }

                                                                        </span>

                                                                    </td>


                                                                    {/* =================================
                                                                        CONTENIDO
                                                                    ================================= */}

                                                                    <td className="schedules-table-content">

                                                                        {isEpisode ? (

                                                                            <>

                                                                                <strong>

                                                                                    {
                                                                                        schedule.seriesTitle
                                                                                    }

                                                                                </strong>


                                                                                <span>

                                                                                    {
                                                                                        schedule.seasonTitle
                                                                                    }

                                                                                </span>


                                                                                <small>

                                                                                    EP.{" "}

                                                                                    {
                                                                                        schedule.episodeNumber
                                                                                    }

                                                                                    {" — "}

                                                                                    {
                                                                                        schedule.episodeTitle
                                                                                    }

                                                                                </small>

                                                                            </>

                                                                        ) : (

                                                                            <>

                                                                                <strong>

                                                                                    {
                                                                                        schedule.mediaContentTitle
                                                                                    }

                                                                                </strong>


                                                                                <span>

                                                                                    {
                                                                                        schedule.mediaContentType
                                                                                    }

                                                                                </span>


                                                                                {schedule.mediaContentDescription && (

                                                                                    <small>

                                                                                        {
                                                                                            schedule.mediaContentDescription
                                                                                        }

                                                                                    </small>

                                                                                )}

                                                                            </>

                                                                        )}

                                                                    </td>


                                                                    {/* =================================
                                                                        FRAGMENTO
                                                                    ================================= */}

                                                                    <td className="schedules-table-fragment">

                                                                        {hasStartOffset ||
                                                                        hasEndOffset ? (

                                                                            <>

                                                                                <strong>

                                                                                    {
                                                                                        hasStartOffset
                                                                                            ? formatDuration(
                                                                                                schedule.contentStartOffset
                                                                                            )
                                                                                            : "00:00"
                                                                                    }

                                                                                    {" → "}

                                                                                    {
                                                                                        hasEndOffset
                                                                                            ? formatDuration(
                                                                                                schedule.contentEndOffset
                                                                                            )
                                                                                            : "FINAL"
                                                                                    }

                                                                                </strong>

                                                                                <small>
                                                                                    SEGMENTO
                                                                                </small>

                                                                            </>

                                                                        ) : (

                                                                            <>

                                                                                <strong>
                                                                                    COMPLETO
                                                                                </strong>

                                                                                <small>
                                                                                    CONTENIDO
                                                                                </small>

                                                                            </>

                                                                        )}

                                                                    </td>


                                                                    {/* =================================
                                                                        ACCIONES
                                                                    ================================= */}

                                                                    <td>

                                                                        <div className="schedule-actions">

                                                                            <button
                                                                                type="button"
                                                                                className="schedule-edit-button"
                                                                                onClick={() =>
                                                                                    iniciarEdicion(
                                                                                        schedule
                                                                                    )
                                                                                }
                                                                            >
                                                                                EDITAR
                                                                            </button>


                                                                            <button
                                                                                type="button"
                                                                                className="schedule-delete-button"
                                                                                onClick={() =>
                                                                                    eliminarSchedule(
                                                                                        schedule.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                ELIMINAR
                                                                            </button>

                                                                        </div>

                                                                    </td>

                                                                </tr>

                                                            );

                                                        }
                                                    )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        </section>

                                    );

                                }
                            )}

                        </div>

                    )}

            </section>

        </main>
    );


}

export default SchedulesPage;