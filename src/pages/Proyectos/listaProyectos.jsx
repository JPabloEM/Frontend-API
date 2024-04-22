import React, { useState, useEffect } from 'react';
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import { useQuery } from 'react-query';
import { useNavigate, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CrearProyectoModal from '../../pages/Proyectos/crearProyecto.jsx'; // Asegúrate de importar tu componente modal
import { getProyecto, eliminarProyecto } from '../../services/ProyectosServicio';
import { getSedes } from '../../services/SedesServicio';
import { getResponsable } from '../../services/ResponsableServicio';

const ListaProyectos = () => {
  const { data: proyectos, isLoading, isError, refetch } = useQuery('Proyecto', getProyecto, {
    enabled: true,
  });
  const navigate = useNavigate();

  const [sedes, setSedes] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [confirmarVisible, setConfirmarVisible] = useState(false);
  const [proyectoAEliminar, setProyectoAEliminar] = useState(null);
  const [isCrearProyectoModalOpen, setIsCrearProyectoModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const sedesData = await getSedes();
        setSedes(sedesData);
      } catch (error) {
        console.error('Error al obtener la lista de sedes:', error);
      }
    };

    
    const fetchResponsables = async () => {
      try {
        const responsablesData = await getResponsable();
        setResponsables(responsablesData);
      } catch (error) {
        console.error('Error al obtener la lista de responsables:', error);
      }
    };

    fetchSedes();
    fetchResponsables();
  }, []);

  useEffect(() => {
    const table = $("#proyectosTable").DataTable();

    // Destruir la tabla antes de volver a inicializarla
    table.destroy();

    // Inicializar DataTables después de que los datos se cargan o cambian
    $("#proyectosTable").DataTable({
      // Configuraciones personalizadas, si las necesitas
    });
  }, [proyectos]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleEditProyecto = (id) => {
    navigate(`/Proyecto/${id}`);
  };

  const handleShowConfirmar = (proyecto) => {
    setProyectoAEliminar(proyecto);
    setConfirmarVisible(true);
  };

  const handleHideConfirmar = () => {
    setConfirmarVisible(false);
    setProyectoAEliminar(null);
  };

  const handleDeleteProyecto = async () => {
    try {
      await eliminarProyecto(proyectoAEliminar.idProyecto);
      await refetch();
      toast.success('Proyecto eliminado correctamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error en la solicitud Axios:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          toast.error(`Error al eliminar el Proyecto: ${data.message}`);
        } else {
          toast.error('Error al eliminar el Proyecto; está vinculado a otras tablas.');
        }
      } else if (error.request) {
        toast.error('No se recibió respuesta del servidor al intentar eliminar el Proyecto.');
      } else {
        toast.error('Error al realizar la solicitud de eliminación. Consulta la consola para más detalles.');
      }
    } finally {
      handleHideConfirmar();
    }
  };

  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
  };

  const openCrearProyectoModal = () => {
    setIsCrearProyectoModalOpen(true);
  };

  const closeCrearProyectoModal = () => {
    setIsCrearProyectoModalOpen(false);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const renderData = () => {
    return searchId ? proyectos.filter((proyecto) => String(proyecto.idProyecto) === searchId) : proyectos;
  };


  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(renderData().length / itemsPerPage);
  const currentData = renderData().slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de Proyectos</h1>

        <button onClick={openCrearProyectoModal} className="btnAgregarDesdeAdmin">
          Crear Proyecto
        </button>

       

        <div className="Div-Table">
          <table id="proyectosTable"  className="Table custom-table">
            <thead>
              <tr>
                <th>ID Proyecto</th>
                <th>Titulo</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Presupuesto</th>
                <th>Identificación Responsable</th>
                <th>Ciudad Sede</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((proyecto) => (
                <tr key={proyecto.idProyecto} className="table-row">
                  <td className="table-cell">{proyecto.idProyecto}</td>
                  <td className="table-cell">{proyecto.titulo}</td>
                  <td className="table-cell">{proyecto.fecha_Inicio}</td>
                  <td className="table-cell">{proyecto.fecha_Fin}</td>
                  <td className="table-cell">{proyecto.presupuesto}</td>
                  <td className="table-cell">
                    {responsables.find(
                      (responsable) => responsable.idResponsable === proyecto.idResponsable
                    )?.userId || 'ResponsableNoEncontrado'}
                  </td>
                  <td className="table-cell">
                    {sedes.find((sede) => sede.idSede === proyecto.idSede)?.ciudad ||
                      'CiudadSedeNoEncontrada'}
                  </td>
                  <td className="table-cell">{proyecto.status}</td>
                  <td className="table-cell">
                    <IconButton
                      onClick={() => handleShowConfirmar(proyecto)}
                      style={{ color: 'red' }}
                      className="action-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditProyecto(proyecto.idProyecto)}
                      color="primary"
                      className="action-button"
                    >
                      <EditIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Siguiente'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />

      <CrearProyectoModal
        isOpen={isCrearProyectoModalOpen}
        onRequestClose={closeCrearProyectoModal}
      />

      {confirmarVisible && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar este Proyecto?</p>
            <button onClick={handleDeleteProyecto} className="btn-confirm btn-yes">
              Sí
            </button>
            <button onClick={handleHideConfirmar} className="btn-confirm btn-no">
              No
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListaProyectos;
