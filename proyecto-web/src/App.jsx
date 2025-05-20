import 'bootstrap/dist/css/bootstrap.min.css';
import './css styles/styleBackgrounds.css';
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
            <a className="navbar-brand" href="#">ROLOLANDIA</a>
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
            <h1 className="text-center text-center text-white">Bienvenido a Mi Página</h1>
            <p className="text-center text-center text-white">Esta es una página de ejemplo con React y Bootstrap.</p>
            {/* <p className="text-center text-success">{mensaje}</p> */}
          </section>

          <section className="mb-5">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h2 className="text-white">Gráfica por país</h2>
                <select className="form-select" value={paisSeleccionado} onChange={handlePaisChange}>
                  <option value="">-- Selecciona un país --</option>
                  {paises.map(pais => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <h2 className="text-white">Gráfica tipo de gráfica</h2>
                <select className="form-select" value={tipoGrafica} onChange={handleTipoGraficaChange}>
                  <option value="linea">Línea</option>
                  <option value="barras">Barras</option>
                  <option value="torta">Torta</option>
                </select>
              </div>
            </div>
            {gifUrl && (
              <div>
                <h4>Gráfica de {paisSeleccionado} ({tipoGrafica})</h4>
                <img src={gifUrl} alt={`Gráfica de ${paisSeleccionado}`} style={{maxWidth: '100%'}} />
              </div>
            )}
          </section>

          <section id="about" className="mb-5">
            <h2 className="text-white">Acerca de Nosotros</h2>
            <p className="text-white">Somos un equipo dedicado a crear soluciones web modernas y eficientes.</p>
          </section>

          <section id="contact">
            <h2 className="text-white">Contacto</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label text-white">Nombre</label>
                <input type="text" className="form-control" id="name" placeholder="Tu nombre" />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-white">Correo Electrónico</label>
                <input type="email" className="form-control" id="email" placeholder="Tu correo" />
              </div>
              <button type="submit" className="btn btn-primary bg-dark">Enviar</button>
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