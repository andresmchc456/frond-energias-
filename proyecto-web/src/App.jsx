import 'bootstrap/dist/css/bootstrap.min.css';
import './css styles/styleBackgrounds.css';
import './css styles/selectBox.css';
import './css styles/card.css';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Fondo animado tipo "matrix"
function FondoAnimado() {
  const columns = 80;
  const rows = 50;

  return (
    <div className="fondo-animado">
      <div className="wrapper">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div className="column" key={colIdx}>
            {Array.from({ length: rows }).map((_, rowIdx) => {
              const value = Math.floor(Math.random() * 255) + 10240;
              return (
                <span
                  key={rowIdx}
                  style={{
                    animationDuration: `${(Math.random() * 2 + 1).toFixed(2)}s`,
                    animationDelay: `${(rowIdx * 0.05).toFixed(2)}s`
                  }}
                >
                  {String.fromCharCode(value)}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- FORMULARIO INTEGRADO ---
function FormEstimacion() {
  const [consumo, setConsumo] = useState("");
  const [paises, setPaises] = useState([]);
  const [pais, setPais] = useState("");
  const [year, setYear] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [anios, setAnios] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/paises")
      .then(res => setPaises(res.data.paises))
      .catch(() => setPaises([]));
  }, []);

  useEffect(() => {
    if (pais) {
      axios.get(`http://localhost:8000/anios?entity=${pais}`)
        .then(res => setAnios(res.data.anios))
        .catch(() => setAnios([]));
    } else {
      setAnios([]);
    }
  }, [pais]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultado(null);

    if (!consumo || isNaN(consumo) || Number(consumo) <= 0) {
      setError("Por favor ingresa un consumo válido en kWh.");
      return;
    }
    if (!pais) {
      setError("Por favor selecciona un país.");
      return;
    }
    if (!year) {
      setError("Por favor selecciona un año.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/estimacion-renovable", {
        params: {
          consumo_kwh: Number(consumo),
          entity: pais,
          year: Number(year)
        }
      });
      setResultado(res.data);
    } catch (err) {
      setError("No se pudo calcular la estimación. Intenta más tarde.");
    }
  };

  return (
    <div className="card card-animada mx-auto my-5" style={{ maxWidth: 1200 }}>
      <div className="card-body">
        <h2 className="card-title text-white mb-4">Estimación de Energía Renovable</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white">País</label>
            <select
              className="form-select select-animado"
              value={pais}
              onChange={e => setPais(e.target.value)}
              required
            >
              <option value="">-- Selecciona un país --</option>
              {paises.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label text-white">Año</label>
            <select
              className="form-select select-animado"
              style={{ backgroundColor: "#111",  border: "1px solid #0f0" }}
              value={year}
              onChange={e => setYear(e.target.value)}
              required
              disabled={!anios.length}
            >
              <option value="">-- Selecciona un año --</option>
              {anios.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="consumo" className="form-label text-white">
              Consumo eléctrico total (kWh)
            </label>
            <input
              type="number"
              className="form-control select-animado"
              id="consumo"
              placeholder="Ejemplo: 3500"
              value={consumo}
              onChange={e => setConsumo(e.target.value)}
              min="1"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary select-animado">
            Calcular
          </button>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {resultado && (
          <div className="alert alert-success mt-3">
            <strong>Porcentaje de energía renovable estimado:</strong>
            <br />
            {resultado.porcentaje_renovable_estimado}%
            <br />
            <small>
              Consumo renovable estimado: {resultado.consumo_renovable_kwh_estimado} kWh<br />
              País: {resultado.pais} | Año: {resultado.año}
            </small>
          </div>
        )}
      </div>
    </div>
  );
}
// --- FIN FORMULARIO INTEGRADO ---

function App() {
  const [mensaje, setMensaje] = useState('');
  const [paises, setPaises] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [tipoGrafica, setTipoGrafica] = useState('linea');

  useEffect(() => {
    axios.get('http://localhost:8000/')
      .then(response => setMensaje(response.data.message))
      .catch(() => setMensaje('No se pudo conectar con la API'));

    axios.get('http://localhost:8000/paises')
      .then(response => setPaises(response.data.paises))
      .catch(() => setPaises([]));
  }, []);

  const handlePaisChange = (e) => {
    const pais = e.target.value;
    setPaisSeleccionado(pais);
    if (pais) {
      setGifUrl(`http://localhost:8000/grafica/${pais}?tipo=${tipoGrafica}`);
    } else {
      setGifUrl('');
    }
  };

  const handleTipoGraficaChange = (e) => {
    const tipo = e.target.value;
    setTipoGrafica(tipo);
    if (paisSeleccionado) {
      setGifUrl(`http://localhost:8000/grafica/${paisSeleccionado}?tipo=${tipo}`);
    }
  };

  return (
    <>
      <FondoAnimado />
      <div className="fondo-personalizado" style={{ position: "relative", zIndex: 1 }}>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Energias limpias</a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="#home">Inicio</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#home">Formulario</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about">Acerca</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#contact">Contacto</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container-fluid my-5">
          <section id="home" className="mb-5">
            <h1 className="text-center text-white">Bienvenido a Energías Limpias</h1>
            <p className="text-center text-white">
              Explora la evolución de las energías renovables en el mundo desde 1965  
              este espacio interactivo te permite visualizar el progreso de distintas fuentes limpias como la solar, eólica e hidroeléctrica, 
              y comprender su papel clave en un futuro energético más sostenible y justo..
            </p>
            {/* <p className="text-center text-success">{mensaje}</p> */}
          </section>

          <section className="mb-5">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h2 className="text-white">Gráfica por país</h2>
                <select className="form-select select-animado" style={{ cursor: 'pointer' }} value={paisSeleccionado} onChange={handlePaisChange}>
                  <option value="">-- Selecciona un país --</option>
                  {paises.map(pais => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <h2 className="text-white">Gráfica tipo de gráfica</h2>
                <select className="form-select  select-animado" style={{ cursor: 'pointer' }} value={tipoGrafica} onChange={handleTipoGraficaChange}>
                  <option value="linea">Línea</option>
                  <option value="barras">Barras</option>
                  <option value="torta">Torta</option>
                  <option value="area">Area</option>
                </select>
              </div>
            </div>
            <br />
            {gifUrl && (
              <div className="d-flex flex-column align-items-center">
                <h4 className="text-white mb-3">Gráfica de {paisSeleccionado} ({tipoGrafica})</h4>
                <img src={gifUrl} alt={`Gráfica de ${paisSeleccionado}`} style={{ maxWidth: '100%' }} />
              </div>
            )}
          </section>

          {/* Aquí se integra el formulario */}
          <FormEstimacion />

          <section id="about" className="mb-5 d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
            <div className="card card-animada text-center" style={{ maxWidth: 1200, width: '100%' }}>
              <div className="card-body">
                <h2 className="card-title text-white">Acerca de Nosotros</h2>
                <p className="card-text text-white" style={{ textAlign: 'justify' }}>
                  Somos un equipo apasionado por la tecnología, la sostenibilidad y el cambio positivo.
                  Nuestro objetivo es impulsar la conciencia ambiental a través de soluciones web modernas, accesibles y visualmente impactantes.
                  Creemos en el poder de los datos para transformar realidades, por eso desarrollamos herramientas que informan, educan y motivan a las personas a tomar decisiones más responsables con el planeta.
                  Con este proyecto, queremos contribuir a un futuro más limpio y justo, donde la transición energética no sea solo una meta, sino una acción colectiva.
                </p>
              </div>
            </div>
          </section>

          <section id="contact">
            <h2 className="text-white">Contacto</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label text-white">Nombre</label>
                <input type="text" className="form-control select-animado" style={{ cursor: 'pointer' }} id="name" placeholder="Tu nombre" />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-white">Correo Electrónico</label>
                <input type="email" className="form-control  select-animado" style={{ cursor: 'pointer' }} id="email" placeholder="Tu correo" />
              </div>
              <button type="submit" className="btn btn-primary select-animado">Enviar</button>
            </form>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-white text-center py-3">
          <p className="mb-0">© 2025 Mi Página. Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  );
}

export default App;