import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLoginPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8080/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
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

            const data = await response.json();

            localStorage.setItem(
                "token",
                data.token
            );

            navigate("/admin");

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    return (
        <main className="admin-login-page">

            <section className="admin-login-card">

                <p className="section-label">
                    NEOMOTION ADMINISTRATION
                </p>

                <h1>
                    INICIAR SESIÓN
                </h1>

                <p>
                    Acceso exclusivo para la administración
                    del canal NeoMotion.
                </p>


                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Usuario
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Contraseña
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

                    </div>


                    {error && (

                        <p className="login-error">
                            {error}
                        </p>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "INICIANDO..."
                            : "INICIAR SESIÓN"
                        }
                    </button>

                </form>

            </section>

        </main>
    );
}

export default AdminLoginPage;