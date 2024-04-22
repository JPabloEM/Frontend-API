import React, { useState, useEffect } from 'react';
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import { useQuery } from 'react-query';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getPoblacionActuacion, eliminarPoblacionActuacion } from '../../services/PoblacionActuacion';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CrearPoblacionActuacionModal from '../../pages/PoblacionActuacion/crearPoblacionActuacion.jsx'; // Asegúrate de importar tu componente modal
import { getPoblacion } from "../../services/PoblacionServicio";
import { getActuacion } from "../../services/ActuacionesServicio";


const ListaPoblacionActuacion = () => {
  const { data, isLoading, isError, refetch } = useQuery('Poblacion_Actuacion', getPoblacionActuacion, {
    enabled: true,
  });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [confirmarVisible, setConfirmarVisible] = useState(false);
  const [poblacionActuacionAEliminar, setPoblacionActuacionAEliminar] = useState(null);
  const [isCrearPoblacionActuacionModalOpen, setIsCrearPoblacionActuacionModalOpen] = useState(
    false
  );
  const [poblaciones, setPoblaciones] = useState([]);
  const [actuaciones, setActuaciones] = useState([]);

  useEffect(() => {
    const fetchPoblaciones = async () => {
      try {
        const data = await getPoblacion();
        setPoblaciones(data);
      } catch (error) {
        console.error('Error al obtener la lista de países:', error);
      }
    };

    const fetchActuaciones = async () => {
      try {
        const data = await getActuacion();
        setActuaciones(data);
      } catch (error) {
        console.error('Error al obtener la lista de directores:', error);
      }
    };

    fetchPoblaciones();
    fetchActuaciones();
  }, []);



  useEffect(() => {
    const table = $("#poblacioneactuacionesTable").DataTable();

    // Destruir la tabla antes de volver a inicializarla
    table.destroy();

    // Inicializar DataTables después de que los datos se cargan o cambian
    $("#poblacioneactuacionesTable").DataTable({
      // Configuraciones personalizadas, si las necesitas
    });
  }, [data]);

  const itemsPerPage = 10;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleEditPoblacionActuacion = (id) => {
    navigate(`/Poblacion_Actuacion/${id}`);
  };

  const handleShowConfirmar = (poblacionActuacion) => {
    setPoblacionActuacionAEliminar(poblacionActuacion);
    setConfirmarVisible(true);
  };

  const handleHideConfirmar = () => {
    setConfirmarVisible(false);
    setPoblacionActuacionAEliminar(null);
  };

  const handleDeletePoblacionActuacion = async () => {
    try {
      await eliminarPoblacionActuacion(poblacionActuacionAEliminar.idPoblacion_Actuacion);
      await refetch();
      toast.success('PoblacionActuacion eliminado correctamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error en la solicitud Axios:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          toast.error(`Error al eliminar la poblacionActuacion: ${data.message}`);
        } else {
          toast.error(`Error al eliminar.`);
        }
      } else if (error.request) {
        toast.error('No se recibió respuesta del servidor al intentar eliminar la información.');
      } else {
        toast.error(
          'Error al realizar la solicitud de eliminación. Consulta la consola para más detalles.'
        );
      }
    } finally {
      handleHideConfirmar();
    }
  };

  const openCrearPoblacionActuacionModal = () => {
    setIsCrearPoblacionActuacionModalOpen(true);
  };

  const closeCrearPoblacionActuacionModal = () => {
    setIsCrearPoblacionActuacionModalOpen(false);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de Población-Actuación</h1>
        <button onClick={openCrearPoblacionActuacionModal} className="btnAgregarDesdeAdmin">
          Crear Población-Actuación
        </button>
        <div className="Div-Table">
          <table id='poblacioneactuacionesTable' className="Table custom-table">
            <thead>
              <tr>
                <th>ID PoblacionActuacion</th>
                <th>ID Poblacion</th>
                <th>ID Actuacion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((poblacionActuacion) => (
                <tr key={poblacionActuacion.idPoblacion_Actuacion}>
                  <td>{poblacionActuacion.idPoblacion_Actuacion}</td>
                  <td>{
                    poblaciones.find((poblacion) => poblacion.idPoblacion === poblacionActuacion.idPoblacion)?.nombre || "NombrePoblacionNoEncontrado"}</td>
                  <td>{actuaciones.find((actuacion) => actuacion.idActuacion === poblacionActuacion.idActuacion)?.nombre || "NombreActuacionNoEncontrado"}</td>
                  <td>
                    <IconButton
                      onClick={() => handleShowConfirmar(poblacionActuacion)}
                      style={{ color: 'red' }}
                      className="action-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditPoblacionActuacion(poblacionActuacion.idPoblacion_Actuacion)}
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

      <CrearPoblacionActuacionModal
        isOpen={isCrearPoblacionActuacionModalOpen}
        onRequestClose={closeCrearPoblacionActuacionModal}
      />

      {confirmarVisible && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar esta PoblacionActuacion?</p>
            <button onClick={handleDeletePoblacionActuacion} className="btn-confirm btn-yes">
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

export default ListaPoblacionActuacion;
