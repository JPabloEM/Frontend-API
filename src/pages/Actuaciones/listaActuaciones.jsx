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
import CrearActuacionModal from '../../pages/Actuaciones/crearActuacion.jsx';
import EditarActuacionModal from '../../pages/Actuaciones/editarActuaciones.jsx';
import { getActuacion, eliminarActuacion } from '../../services/ActuacionesServicio';
import { getProyecto } from '../../services/ProyectosServicio';

const ListaActuacion = () => {
  const { data, isLoading, isError, refetch } = useQuery('Actuacion', getActuacion, {
    enabled: true,
  });
  const navigate = useNavigate();

  const [proyectos, setProyectos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [confirmarVisible, setConfirmarVisible] = useState(false);
  const [actuacionAEliminar, setActuacionAEliminar] = useState(null);
  const [isCrearActuacionModalOpen, setIsCrearActuacionModalOpen] = useState(false);

  const [isEditarActuacionModalOpen, setIsEditarActuacionModalOpen] = useState(false);

  const [actuacionIdEditar, setActuacionIdEditar] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getProyecto();
        setProyectos(data);
      } catch (error) {
        console.error('Error al obtener la lista de proyectos:', error);
      }
    };

    fetchProyectos();
  }, []);

  useEffect(() => {
    const table = $("#actuacionesTable").DataTable();

    // Destruir la tabla antes de volver a inicializarla
    table.destroy();

    // Inicializar DataTables después de que los datos se cargan o cambian
    $("#actuacionesTable").DataTable({
      // Configuraciones personalizadas, si las necesitas
    });
  }, [data]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };



  // const handleEditActuacion = (id) => {
  //   setActuacionIdEditar(id);
  //   openEditarActuacionModal();
  // };
  const handleEditActuacion = (id) => {
    navigate(`/Actuacion/${id}`);
  };

  const handleShowConfirmar = (actuacion) => {
    setActuacionAEliminar(actuacion);
    setConfirmarVisible(true);
  };

  const handleHideConfirmar = () => {
    setConfirmarVisible(false);
    setActuacionAEliminar(null);
  };

  const handleDeleteActuacion = async () => {
    try {
      await eliminarActuacion(actuacionAEliminar.idActuacion);
      await refetch();
      toast.success('Actuación eliminada correctamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error en la solicitud Axios:', error);

      // Agregar lógica para mostrar una notificación de error si lo deseas
    } finally {
      handleHideConfirmar();
    }
  };

  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
  };

  const openCrearActuacionModal = () => {
    setIsCrearActuacionModalOpen(true);
  };

  const closeCrearActuacionModal = () => {
    setIsCrearActuacionModalOpen(false);
  };




  const openEditarActuacionModal = () => {
    setIsEditarActuacionModalOpen(true);
  };

  const closeEditarActuacionModal = () => {
    setActuacionIdEditar(null);
    setIsEditarActuacionModalOpen(false);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const renderData = () => {
    return searchId
      ? data.filter((actuacion) => String(actuacion.idActuacion) === searchId)
      : data;
  };

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(renderData().length / itemsPerPage);
  const currentData = renderData().slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de Actuaciones</h1>

        <button onClick={openCrearActuacionModal} className="btnAgregarDesdeAdmin">
          Crear Actuación
        </button>

        <div className="Div-Table">
          <table id='actuacionesTable' className="Table custom-table">
            <thead>
              <tr>
                <th>ID Actuación</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Proyecto</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((actuacion) => (
                <tr key={actuacion.idActuacion} className="table-row">
                  <td className="table-cell">{actuacion.idActuacion}</td>
                  <td className="table-cell">{actuacion.nombre}</td>
                  <td className="table-cell">{actuacion.descripcion}</td>
                  <td className="table-cell">
                    {proyectos.find(
                      (proyecto) => proyecto.idProyecto === actuacion.idProyecto
                    )?.titulo || 'ProyectoNoEncontrado'}
                  </td>
                  <td className="table-cell">{actuacion.status}</td>
                  <td className="table-cell">
                    <IconButton
                      onClick={() => handleShowConfirmar(actuacion)}
                      style={{ color: 'red' }}
                      className="action-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditActuacion (actuacion.idActuacion)}
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

      <CrearActuacionModal
        isOpen={isCrearActuacionModalOpen}
        onRequestClose={closeCrearActuacionModal}
      />

      {/* <EditarActuacionModal
        isOpen={isEditarActuacionModalOpen}
        onRequestClose={closeEditarActuacionModal}
        actuacionId={actuacionIdEditar}
      /> */}

      {confirmarVisible && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar esta Actuación?</p>
            <button
              onClick={handleDeleteActuacion}
              className="btn-confirm btn-yes"
            >
              Sí
            </button>
            <button
              onClick={handleHideConfirmar}
              className="btn-confirm btn-no"
            >
              No
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListaActuacion;
