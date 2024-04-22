import React from 'react'
// import ReactDOM from 'react-dom/client'

import ReactDOM from 'react-dom/client';


import { BrowserRouter, Route, Routes } from 'react-router-dom'
//estilos
import './index.css'
import './styles/sidebar.css'
import './styles/EstilosPais.css'
import './styles/Modal.css'
import './styles/table.css'
import './styles/modals.css'

//rutas
import { Layout } from './pages/_layout/layout'
import ListaResponsable from './pages/Responsable/listaResponsable';
import ListaPais from './pages/Paises/listaPaises';
import CrearPaises from './pages/Paises/crearPais';
import EditarPais from './pages/Paises/editarPaises';
import ListaSedes from './pages/Sedes/listaSedes';
import CrearSedes from './pages/Sedes/crearSede';
import EditarSede from './pages/Sedes/editarSedes';
import ListaActuacion from './pages/Actuaciones/listaActuaciones';
import CrearActuacion from './pages/Actuaciones/crearActuacion';
import ListaProyectos from './pages/Proyectos/listaProyectos';
import CrearProyecto from './pages/Proyectos/crearProyecto';
import ListaPoblacion from './pages/Poblacion/listaPoblacion';
import CrearPoblacion from './pages/Poblacion/crearPoblacion';
import ListaDirector from './pages/Director/listaDirector';
import CrearDirector from './pages/Director/crearDirector';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CrearResponsable from './pages/Responsable/crearResponsable';
import { Componente } from './pages/Dashboard/dashboard';
import Login from './pages/Login/login';
import EditarResponsable from './pages/Responsable/editarResponsable';
import EditarActuacion from './pages/Actuaciones/editarActuaciones';
import EditarProyecto from './pages/Proyectos/editarProyectos';
import EditarPoblacion from './pages/Poblacion/editarPoblacion';
import EditarDirector from './pages/Director/editarDirector';
import ListaPoblacionActuacion from './pages/PoblacionActuacion/listaPoblacionActuacion';
import CrearPoblacionActuacion from './pages/PoblacionActuacion/crearPoblacionActuacion';
import EditarPobAct from './pages/PoblacionActuacion/editarPoblacionActuacion';
import ListaConsultaPAP from './pages/Consultas/consulta-proyecto-actuaciones-en-poblacion';
import ListaConsultaIPP from './pages/Consultas/consulta_Inversion_Proyecto_Poblacion';
import ListaConsultaPPH from './pages/Consultas/Consulta_ProyectoPoblacionHabitantes';
import ListaConsultaCSP from './pages/Consultas/Consulta_ContarSedesPorPais';
import ListaConsultaCPP from './pages/Consultas/Consulta_ContarProyectosEnTodosLosPaises';
import ListaConsultaCPS from './pages/Consultas/Consulta_ContarProyectosPorTodasSedes';
import Registro from './pages/Registro/registro';
import ListaConsultaCSPN from './pages/Consultas/consulta_SedesPorPaisNombre';
import Logout from './pages/Login/logout';
import ListaConsultaBPS from './pages/Consultas/Consulta_BuscarProyectoEnSede';
import ListaConsultaInfoH from './pages/Consultas/Consulta_ObtenerInfoPoblacionPorIdPoblacion';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <BrowserRouter>

        <Routes>

        <Route path="/" element={<Layout />}>
          
        <Route path="/listRes" element={<ListaResponsable/>}/>
        <Route path='/agregar-responsable-admin' element={<CrearResponsable/>}/>
        <Route path="/Responsable/:id" element={<EditarResponsable/>}/>

        <Route path="/listaPais" element={<ListaPais/>}/>
        <Route path="/agregar-pais-admin" element={<CrearPaises/>}/>
        <Route path="/Pais/:id" element={<EditarPais/>}/>
        
        <Route path='/listSede' element={<ListaSedes/>}/>
        <Route path="/Sede/:id" element={<EditarSede/>}/>
        <Route path='/agregar-sede-admin' element={<CrearSedes/>}/>

        <Route path='/listActuaciones' element={<ListaActuacion/>}/>
        <Route path='/agregar-actuacion-admin' element={<CrearActuacion/>}/>
        <Route path="/Actuacion/:id" element={<EditarActuacion/>}/>

        <Route path='/listProyectos' element={<ListaProyectos/>}/>
        <Route path='/agregar-proyecto-admin' element={<CrearProyecto/>}/>
        <Route path="/Proyecto/:id" element={<EditarProyecto/>}/>

        <Route path='/listPoblacion' element={<ListaPoblacion/>}/>
        <Route path='/agregar-poblacion-admin' element={<CrearPoblacion/>}/>
        <Route path="/Poblacion/:id" element={<EditarPoblacion/>}/>

        <Route path='/listDirector' element={<ListaDirector/>}/>
        <Route path='/agregar-director-admin' element={<CrearDirector/>}/>
        <Route path="/Director/:id" element={<EditarDirector/>}/>

        

        <Route path='/dashboard' element={<Componente/>}/>

        <Route path='/login' element={<Login/>}/>
        <Route path='/registro' element={<Registro/>}/>
        <Route path='/logout' classname='logout' element={<Logout/>}/>

        <Route path='/dashboard/login' element={<Login/>}/>

        <Route path='/listaPoblacionActuacion' element={<ListaPoblacionActuacion/>}/>
        <Route path='/agregar-poblacionActuacion-admin' element={<CrearPoblacionActuacion/>}/>
        <Route path="/Poblacion_Actuacion/:id" element={<EditarPobAct/>}/>
       

        <Route path='/consultaPAP' element={<ListaConsultaPAP/>}/>
        <Route path='/consultaIPP' element={<ListaConsultaIPP/>}/>
        <Route path='/consultaPPH' element={<ListaConsultaPPH/>}/>
        <Route path='/consultaCSP' element={<ListaConsultaCSP/>}/>
        <Route path='/consultaCSPN' element={<ListaConsultaCSPN/>}/>
        <Route path='/consultaCPP' element={<ListaConsultaCPP/>}/>
        <Route path='/consultaCPS' element={<ListaConsultaCPS/>}/>
        <Route path='/consultaBPS' element={<ListaConsultaBPS/>}/>
        <Route path='/consultainfo' element={<ListaConsultaInfoH/>}/>


        </Route>
        
        </Routes>
        <ToastContainer />
    </BrowserRouter>
    
  </React.StrictMode>,
)
