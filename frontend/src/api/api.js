const API_URL = "http://localhost:8080";


// =================================================
// SERIES — PÚBLICO
// =================================================

export async function getSeries() {

    const response =
        await fetch(
            `${API_URL}/api/series`
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo series: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// SERIE POR ID
// =================================================

export async function getSeriesById(
    id
) {

    const response =
        await fetch(
            `${API_URL}/api/series/${id}`
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo serie: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// TEMPORADAS DE UNA SERIE — PÚBLICO
// =================================================

export async function getSeasonsBySeries(
    seriesId
) {

    const response =
        await fetch(
            `${API_URL}/api/seasons/series/${seriesId}`
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo temporadas: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// EPISODIOS DE UNA TEMPORADA — PÚBLICO
// =================================================

export async function getEpisodesBySeason(
    seasonId
) {

    const response =
        await fetch(
            `${API_URL}/api/episodes/season/${seasonId}`
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo episodios: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// SERIES — ADMIN
// =================================================

export async function getAdminSeries(
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/series`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo series: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// CATEGORÍAS — ADMIN
// =================================================

export async function getCategories(
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/categories`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo categorías: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// CREAR SERIE
// =================================================

export async function createSeries(
    series,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/series`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        series
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible crear la serie."
        );
    }


    return response.json();
}


// =================================================
// ACTUALIZAR SERIE
// =================================================

export async function updateSeries(
    id,
    series,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/series/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        series
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible actualizar la serie."
        );
    }


    return response.json();
}


// =================================================
// ELIMINAR SERIE
// =================================================

export async function deleteSeries(
    id,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/series/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible eliminar la serie."
        );
    }
}


// =================================================
// TEMPORADAS — ADMIN
// =================================================

export async function getSeasons(
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/seasons`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo temporadas: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// CREAR TEMPORADA
// =================================================

export async function createSeason(
    season,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/seasons`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        season
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible crear la temporada."
        );
    }


    return response.json();
}


// =================================================
// ACTUALIZAR TEMPORADA
// =================================================

export async function updateSeason(
    id,
    season,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/seasons/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        season
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible actualizar la temporada."
        );
    }


    return response.json();
}


// =================================================
// ELIMINAR TEMPORADA
// =================================================

export async function deleteSeason(
    id,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/seasons/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible eliminar la temporada."
        );
    }
}


// =================================================
// EPISODIOS — ADMIN
// =================================================

export async function getEpisodes(
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/episodes`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo episodios: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// SUBIR ARCHIVO
// =================================================

export async function uploadFile(
    file,
    type,
    token
) {

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    const response =
        await fetch(
            `${API_URL}/api/files/${type}`,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                },

                body:
                formData
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible subir el archivo."
        );
    }


    return response.json();
}


// =================================================
// CREAR EPISODIO
// =================================================

export async function createEpisode(
    episode,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/episodes`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        episode
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible crear el episodio."
        );
    }


    return response.json();
}


// =================================================
// ACTUALIZAR EPISODIO
// =================================================

export async function updateEpisode(
    id,
    episode,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/episodes/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        episode
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible actualizar el episodio."
        );
    }


    return response.json();
}


// =================================================
// ELIMINAR EPISODIO
// =================================================

export async function deleteEpisode(
    id,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/episodes/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible eliminar el episodio."
        );
    }
}


// =================================================
// CONTENIDO MULTIMEDIA
// =================================================

export async function getMediaContent(
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/media-content`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo contenido multimedia: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// CREAR CONTENIDO MULTIMEDIA
// =================================================

export async function createMediaContent(
    data,
    thumbnailFile,
    videoFile,
    token
) {

    const formData =
        new FormData();


    formData.append(
        "data",
        JSON.stringify(data)
    );


    if (thumbnailFile) {

        formData.append(
            "thumbnail",
            thumbnailFile
        );
    }


    if (videoFile) {

        formData.append(
            "video",
            videoFile
        );
    }


    const response =
        await fetch(
            `${API_URL}/api/media-content`,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                },

                body:
                formData
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible crear el contenido multimedia."
        );
    }


    return response.json();
}


// =================================================
// ACTUALIZAR CONTENIDO MULTIMEDIA
// =================================================

export async function updateMediaContent(
    id,
    data,
    thumbnailFile,
    videoFile,
    existingThumbnail,
    existingVideoUrl,
    token
) {

    const hasNewFiles =
        !!thumbnailFile ||
        !!videoFile;


    if (hasNewFiles) {

        const formData =
            new FormData();


        formData.append(
            "data",
            JSON.stringify(data)
        );


        if (thumbnailFile) {

            formData.append(
                "thumbnail",
                thumbnailFile
            );
        }


        if (videoFile) {

            formData.append(
                "video",
                videoFile
            );
        }


        const response =
            await fetch(
                `${API_URL}/api/media-content/${id}/files`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body:
                    formData
                }
            );


        if (!response.ok) {

            const message =
                await response.text();


            throw new Error(
                message ||
                "No fue posible actualizar los archivos."
            );
        }


        return response.json();
    }


    const updateData = {

        ...data,

        thumbnail:
        existingThumbnail,

        videoUrl:
        existingVideoUrl
    };


    const response =
        await fetch(
            `${API_URL}/api/media-content/${id}`,
            {
                method: "PUT",

                headers: {
                    Authorization:
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        updateData
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible actualizar el contenido multimedia."
        );
    }


    return response.json();
}


// =================================================
// ELIMINAR CONTENIDO MULTIMEDIA
// =================================================

export async function deleteMediaContent(
    id,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/media-content/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible eliminar el contenido multimedia."
        );
    }
}


// =================================================
// PROGRAMACIÓN PÚBLICA
// =================================================

export async function getSchedules() {

    const response =
        await fetch(
            `${API_URL}/api/schedules`
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo programación: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// PROGRAMACIÓN DE HOY
// =================================================

export async function getTodaySchedule() {

    const response =
        await fetch(
            `${API_URL}/api/schedules/today`
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo la programación de hoy: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// PROGRAMA ACTUAL
// =================================================

export async function getCurrentSchedule() {

    const response =
        await fetch(
            `${API_URL}/api/schedules/current`
        );


    if (response.status === 404) {

        return null;
    }


    if (!response.ok) {

        throw new Error(
            `Error obteniendo el programa actual: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// SIGUIENTE PROGRAMA
// =================================================

export async function getNextSchedule() {

    const response =
        await fetch(
            `${API_URL}/api/schedules/next`
        );


    if (response.status === 404) {

        return null;
    }


    if (!response.ok) {

        throw new Error(
            `Error obteniendo el siguiente programa: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// PROGRAMACIÓN — ADMIN
// =================================================

export async function getSchedulesRange(
    startDate,
    endDate,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/schedules/range?startDate=${startDate}&endDate=${endDate}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                },

                cache: "no-store"
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible obtener la programación."
        );
    }


    return response.json();
}


// =================================================
// EPISODIOS PARA PROGRAMACIÓN
// =================================================

export async function getScheduleEpisodes(
    token
) {

    return getEpisodes(
        token
    );
}


// =================================================
// MEDIA CONTENT PARA PROGRAMACIÓN
// =================================================

export async function getScheduleMediaContent(
    token
) {

    return getMediaContent(
        token
    );
}


// =================================================
// CREAR PROGRAMACIÓN
// =================================================

export async function createSchedule(
    schedule,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/schedules`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        schedule
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible crear la programación."
        );
    }


    return response.json();
}


// =================================================
// CREAR SIGUIENTE PROGRAMACIÓN
// =================================================

export async function createNextSchedule(
    schedule,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/schedules/next`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        schedule
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible agregar la siguiente programación."
        );
    }


    return response.json();
}


// =================================================
// ACTUALIZAR PROGRAMACIÓN
// =================================================

export async function updateSchedule(
    id,
    schedule,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/schedules/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        schedule
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible actualizar la programación."
        );
    }


    return response.json();
}


// =================================================
// ELIMINAR PROGRAMACIÓN
// =================================================

export async function deleteSchedule(
    id,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/schedules/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible eliminar la programación."
        );
    }
}


// =================================================
// BLOQUES DE PROGRAMACIÓN
// =================================================

export async function getProgrammingBlocks(
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/programming-blocks`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            `Error obteniendo bloques: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// CREAR BLOQUE
// =================================================

export async function createProgrammingBlock(
    block,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/programming-blocks`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        block
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            `No fue posible crear el bloque. HTTP ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// ACTUALIZAR BLOQUE
// =================================================

export async function updateProgrammingBlock(
    id,
    block,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/programming-blocks/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        block
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            `No fue posible actualizar el bloque. HTTP ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// ELIMINAR BLOQUE
// =================================================

export async function deleteProgrammingBlock(
    id,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/programming-blocks/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            `No fue posible eliminar el bloque. HTTP ${response.status}`
        );
    }
}


// =================================================
// EMISIONES DEL BLOQUE
// =================================================

export async function getProgrammingBlockSchedules(
    blockId,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/programming-blocks/${blockId}/schedules`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                },

                cache: "no-store"
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            `No fue posible obtener las emisiones. HTTP ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// PREVISUALIZAR REPETICIÓN
// =================================================

export async function previewProgrammingBlockRepeat(
    request,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/programming-blocks/repeat/preview`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        request
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible generar la previsualización."
        );
    }


    return response.json();
}


// =================================================
// REPETIR BLOQUE
// =================================================

export async function repeatProgrammingBlock(
    request,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/programming-blocks/repeat`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        request
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible generar la programación."
        );
    }


    return response.json();
}


// =================================================
// PLAYBACK — PÚBLICO
// =================================================

export async function getCurrentPlayback() {

    const response =
        await fetch(
            `${API_URL}/api/playback/current`
        );


    if (response.status === 404) {

        return null;
    }


    if (!response.ok) {

        throw new Error(
            `Error obteniendo reproducción actual: ${response.status}`
        );
    }


    return response.json();
}


export async function getNextPlayback() {

    const response =
        await fetch(
            `${API_URL}/api/playback/next`
        );


    if (response.status === 404) {

        return null;
    }


    if (!response.ok) {

        throw new Error(
            `Error obteniendo siguiente reproducción: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// ESTADO COMPLETO DEL CANAL
// =================================================

export async function getPlaybackState() {

    const response =
        await fetch(
            `${API_URL}/api/playback/state`,
            {
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo estado de reproducción: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// URLS
// =================================================

export function getVideoUrl(
    videoUrl
) {

    if (!videoUrl) {

        return null;
    }


    return `${API_URL}${videoUrl}`;
}


export function getResourceUrl(
    resourceUrl
) {

    if (!resourceUrl) {

        return null;
    }


    return `${API_URL}${resourceUrl}`;
}


// =================================================
// AUTENTICACIÓN
// =================================================

export async function loginUser(
    username,
    password
) {

    const response =
        await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        username,
                        password
                    })
            }
        );


    if (!response.ok) {

        throw new Error(
            "Usuario o contraseña incorrectos."
        );
    }


    return response.json();
}


// =================================================
// REGISTRO
// =================================================

export async function registerUser(
    userData
) {

    const response =
        await fetch(
            `${API_URL}/api/users`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        userData
                    )
            }
        );


    if (!response.ok) {

        let message =
            "No fue posible crear la cuenta.";


        try {

            const data =
                await response.json();


            message =
                data.message ||
                message;

        } catch (error) {

            console.error(
                "No fue posible leer el error del servidor:",
                error
            );
        }


        throw new Error(
            message
        );
    }


    return response.json();
}


// =================================================
// USUARIO AUTENTICADO
// =================================================

export async function getCurrentUser(
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/users/me`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo usuario: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// TEMPORADAS — ADMIN
// =================================================

export async function getAdminSeasons(
    token
) {

    const currentToken =
        token ||
        localStorage.getItem("token");


    const response =
        await fetch(
            `${API_URL}/api/seasons`,
            {
                headers: {
                    Authorization:
                        `Bearer ${currentToken}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            `Error obteniendo temporadas: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// SERIES — ADMIN PARA TEMPORADAS
// =================================================

export async function getAdminSeriesForSeasons(
    token
) {

    const currentToken =
        token ||
        localStorage.getItem("token");


    const response =
        await fetch(
            `${API_URL}/api/series`,
            {
                headers: {
                    Authorization:
                        `Bearer ${currentToken}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            `Error obteniendo series: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// RECOMENDACIONES — USUARIO
// =================================================

export async function createRecommendation(
    recommendation,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/recommendations`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        recommendation
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible crear la recomendación."
        );
    }


    return response.json();
}


// =================================================
// MIS RECOMENDACIONES
// =================================================

export async function getMyRecommendations(
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/recommendations/mine`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible obtener tus recomendaciones."
        );
    }


    return response.json();
}


// =================================================
// RECOMENDACIONES — ADMIN
// =================================================

export async function getRecommendations(
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/recommendations`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible obtener las recomendaciones."
        );
    }


    return response.json();
}


// =================================================
// ACTUALIZAR ESTADO
// =================================================

export async function updateRecommendationStatus(
    id,
    data,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/recommendations/${id}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        data
                    )
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible actualizar la recomendación."
        );
    }


    return response.json();
}


// =================================================
// ELIMINAR RECOMENDACIÓN — ADMIN
// =================================================

export async function deleteRecommendation(
    id,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/recommendations/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible eliminar la recomendación."
        );
    }
}


// =================================================
// FAVORITOS
// =================================================

export async function getFavorites(
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/favorites`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            "No fue posible obtener los favoritos."
        );
    }


    return response.json();
}


export async function addFavorite(
    seriesId,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/favorites/${seriesId}`,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible agregar el favorito."
        );
    }


    return response.json();
}


export async function removeFavorite(
    seriesId,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/favorites/${seriesId}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible eliminar el favorito."
        );
    }
}


export async function isFavorite(
    seriesId,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/favorites/${seriesId}/exists`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            "No fue posible comprobar el favorito."
        );
    }


    return response.json();
}


// =================================================
// NOTICIAS PÚBLICAS
// =================================================

export async function getNews() {

    const response =
        await fetch(
            `${API_URL}/api/news`,
            {
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            `Error obteniendo noticias: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// NOTICIAS — ADMIN
// =================================================

export async function getAdminNews(
    token
) {

    const currentToken =
        token ||
        localStorage.getItem("token");


    const response =
        await fetch(
            `${API_URL}/api/news/admin`,
            {
                headers: {
                    Authorization:
                        `Bearer ${currentToken}`
                },

                cache: "no-store"
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            `Error obteniendo noticias: ${response.status}`
        );
    }


    return response.json();
}


// =================================================
// CREAR NOTICIA
// =================================================

export async function createNews(
    news,
    token
) {

    const currentToken =
        token ||
        localStorage.getItem("token");


    const response =
        await fetch(
            `${API_URL}/api/news`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${currentToken}`
                },

                body:
                    JSON.stringify(news)
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible crear la noticia."
        );
    }


    return response.json();
}


// =================================================
// ACTUALIZAR NOTICIA
// =================================================

export async function updateNews(
    id,
    news,
    token
) {

    const currentToken =
        token ||
        localStorage.getItem("token");


    const response =
        await fetch(
            `${API_URL}/api/news/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${currentToken}`
                },

                body:
                    JSON.stringify(news)
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible actualizar la noticia."
        );
    }


    return response.json();
}


// =================================================
// ELIMINAR NOTICIA
// =================================================

export async function deleteNews(
    id,
    token
) {

    const currentToken =
        token ||
        localStorage.getItem("token");


    const response =
        await fetch(
            `${API_URL}/api/news/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${currentToken}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible eliminar la noticia."
        );
    }
}


// =================================================
// ELIMINAR MI RECOMENDACIÓN — USUARIO
// =================================================

export async function deleteMyRecommendation(
    id,
    token
) {

    const response =
        await fetch(
            `${API_URL}/api/recommendations/mine/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            message ||
            "No fue posible eliminar tu recomendación."
        );
    }
}