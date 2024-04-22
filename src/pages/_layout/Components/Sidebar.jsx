import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const Sidebar = ({ children }) => {
  const [sidebarVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un token en el localStorage al cargar el componente
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const navLinks = [
    // { to: 'home', text: 'Home' },
    { to: 'login', text: 'Iniciar Sesión', visible: !isAuthenticated },
    { to: 'registro', text: 'Registro', visible: isAuthenticated },
    { to: 'listRes', text: 'Responsable', visible: isAuthenticated },
    { to: 'listDirector', text: 'Director', visible: isAuthenticated },
    { to: 'listaPais', text: 'Paises', visible: isAuthenticated },
    { to: 'listSede', text: 'Sedes', visible: isAuthenticated },
    { to: 'listProyectos', text: 'Proyectos', visible: isAuthenticated },
    { to: 'listActuaciones', text: 'Actuaciones', visible: isAuthenticated },
    { to: 'listPoblacion', text: 'Poblacion', visible: isAuthenticated },
    { to: 'listaPoblacionActuacion', text: 'PoblacionActuacion', visible: isAuthenticated},
    { to: 'consultaPAP', text: 'Consulta PAP', visible: !isAuthenticated},
    { to: 'consultaPPH', text: 'Consulta PPH', visible: !isAuthenticated},
    { to: 'consultaCSP', text: 'Consulta CSP', visible: !isAuthenticated},
    { to: 'consultaCPP', text: 'Consulta CPP', visible: !isAuthenticated},
    { to: 'consultaCPS', text: 'Consulta CPS', visible: !isAuthenticated},
    { to: 'consultaCSPN', text: 'Consulta CSPN', visible: !isAuthenticated},
    { to: 'consultaBPS', text: 'Consulta BPS', visible: !isAuthenticated},
    { to: 'consultainfo', text: 'Consulta IPH', visible: !isAuthenticated},
    
    

  ];

  return (
    <div className="container">
      <div style={{ width: sidebarVisible ? '200px' : '50px' }} className="sidebar">
      <div className="top_section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src="src/assets/img/logo.png" // Ruta a tu logo
            alt="Logo"
            style={{ width: '150px', height: '150px', marginBottom: '0px' }}
          />
          <div style={{ marginLeft: sidebarVisible ? '50px' : '0px' }} className="bars"></div>
        </div>
        {navLinks
          .filter((link) => link.visible === undefined || link.visible)
          .map((item, index) => (
            <NavLink to={item.to} key={index} className="link" activeClassName="active">
              <div className="icon">{/* Puedes agregar un icono aquí si lo tienes */}</div>
              <div style={{ display: sidebarVisible ? 'block' : 'none' }} className="link_text">
                {item.text}
              </div>
            </NavLink>
          ))}
        {isAuthenticated && (
          <NavLink to='logout' className="link" activeClassName="active">
            <div className="icon" style={{ color: 'red' }}>
              {/* Puedes agregar un icono aquí si lo tienes */}
            </div>
            <div style={{ display: sidebarVisible ? 'block' : 'none', color: 'darkred' }} className="link_text">
              Cerrar sesión
            </div>
          </NavLink>
        )}
      </div>
      <main>{children}</main>
    </div>
  );
};

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Sidebar;