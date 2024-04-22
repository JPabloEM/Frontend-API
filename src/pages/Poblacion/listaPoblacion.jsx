import React, { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import { useQuery } from "react-query";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import { getPoblacion, eliminarPoblacion } from "../../services/PoblacionServicio";
import { getPais } from "../../services/PaisServicio";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CrearPoblacionModal from "../../pages/Poblacion/crearPoblacion.jsx"; // Asegúrate de importar tu componente modal

const ListaPoblacion = () => {
  const { data, isLoading, isError, refetch } = useQuery("Poblacion", getPoblacion, {
    enabled: true,
  });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchId, setSearchId] = useState("");
  const [confirmarVisible, setConfirmarVisible] = useState(false);
  const [poblacionAEliminar, setPoblacionAEliminar] = useState(null);
  const [isCrearPoblacionModalOpen, setIsCrearPoblacionModalOpen] = useState(false);

  const itemsPerPage = 10;

  const [paises, setPaises] = useState([]);

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const paisesData = await getPais();
        setPaises(paisesData);
      } catch (error) {
        console.error('Error al obtener la lista de países:', error);
      }
    };

    fetchPaises();
  }, []);

  useEffect(() => {
    const table = $("#poblacionesTable").DataTable();

    // Destruir la tabla antes de volver a inicializarla
    table.destroy();

    // Inicializar DataTables después de que los datos se cargan o cambian
    $("#poblacionesTable").DataTable({
      // Configuraciones personalizadas, si las necesitas
    });
  }, [data]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleEditPoblacion = (id) => {
    navigate(`/Poblacion/${id}`);
  };

  const handleShowConfirmar = (poblacion) => {
    setPoblacionAEliminar(poblacion);
    setConfirmarVisible(true);
  };

  const handleHideConfirmar = () => {
    setConfirmarVisible(false);
    setPoblacionAEliminar(null);
  };

  const handleDeletePoblacion = async () => {
    try {
      await eliminarPoblacion(poblacionAEliminar.idPoblacion);
      await refetch();
      toast.success('Poblacion eliminado correctamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error en la solicitud Axios:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          toast.error(`Error al eliminar el Poblacion: ${data.message}`);
        } else {
          toast.error('Error al eliminar el Poblacion; está vinculado a otras tablas.');
        }
      } else if (error.request) {
        toast.error('No se recibió respuesta del servidor al intentar eliminar el Poblacion.');
      } else {
        toast.error('Error al realizar la solicitud de eliminación. Consulta la consola para más detalles.');
      }
    } finally {
      handleHideConfirmar();
    }
  };


  const openCrearPoblacionModal = () => {
    setIsCrearPoblacionModalOpen(true);
  };

  const closeCrearPoblacionModal = () => {
    setIsCrearPoblacionModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const filteredData = searchId
    ? data.filter((poblacion) => String(poblacion.idPoblacion) === searchId)
    : data;

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = searchId ? filteredData : data.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de Poblaciones</h1>
        
        <button onClick={openCrearPoblacionModal} className="btnAgregarDesdeAdmin">
          Crear Poblacion
        </button>
        
        <div className="Div-Table">
          <table id="poblacionesTable" className="Table custom-table">
            <thead>
              <tr>
                <th>ID Poblacion</th>
                <th>Nombre</th>
                <th>Pais</th>
                <th>Numero Habitantes</th>
                <th>Descripcion</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((poblacion) => (
                <tr key={poblacion.idPoblacion} className="table-row">
                  <td className="table-cell">{poblacion.idPoblacion}</td>
                  <td className="table-cell">{poblacion.nombre}</td>
                  <td className="table-cell">{paises.find((pais) => pais.idPais === poblacion.idPais)?.nombre || "NombrePaisNoEncontrado"}</td>
                  <td className="table-cell">{poblacion.numHabitantes}</td>
                  <td className="table-cell">{poblacion.descripcion}</td>
                  <td className="table-cell">{poblacion.status}</td>
                  <td className="table-cell">
                  <IconButton
                      onClick={() => handleShowConfirmar(poblacion)}
                      style={{ color: 'red' }}
                      className="action-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditPoblacion(poblacion.idPoblacion)}
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
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />

      <CrearPoblacionModal
        isOpen={isCrearPoblacionModalOpen}
        onRequestClose={closeCrearPoblacionModal}
      />

      {confirmarVisible && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar esta Población?</p>
            <button
              onClick={handleDeletePoblacion}
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

export default ListaPoblacion;
