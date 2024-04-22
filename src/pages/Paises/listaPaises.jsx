import React, { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import { useQuery } from "react-query";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { getPais, eliminarPais } from "../../services/PaisServicio";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CrearPaisModal from "../../pages/Paises/crearPais.jsx"; // Asegúrate de importar tu componente modal

const ListaPais = () => {
  const { data, isLoading, isError, refetch } = useQuery("Pais", getPais, {
    enabled: true,
  });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchId, setSearchId] = useState("");
  const [confirmarVisible, setConfirmarVisible] = useState(false);
  const [paisAEliminar, setPaisAEliminar] = useState(null);
  const [isCrearPaisModalOpen, setIsCrearPaisModalOpen] = useState(false);

  const itemsPerPage = 10;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleEditPais = (id) => {
    navigate(`/Pais/${id}`);
  };

  const handleShowConfirmar = (pais) => {
    setPaisAEliminar(pais);
    setConfirmarVisible(true);
  };

  const handleHideConfirmar = () => {
    setConfirmarVisible(false);
    setPaisAEliminar(null);
  };

  useEffect(() => {
    // Inicializar DataTables después de que los datos se cargan o cambian
    $("#paisesTable").DataTable();
  }, [data]);

  const handleDeletePais = async () => {
    try {
      await eliminarPais(paisAEliminar.idPais);
      await refetch();
      toast.success('Pais eliminado correctamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error en la solicitud Axios:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          toast.error(`Error al eliminar el Pais: ${data.message}`);
        } else {
          toast.error('Error al eliminar el Pais; está vinculado a otras tablas.');
        }
      } else if (error.request) {
        toast.error('No se recibió respuesta del servidor al intentar eliminar el Pais.');
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

  const openCrearPaisModal = () => {
    setIsCrearPaisModalOpen(true);
  };

  const closeCrearPaisModal = () => {
    setIsCrearPaisModalOpen(false);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const filteredData = data.filter((pais) => {
    return String(pais.idPais) === searchId;
  });

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = searchId ? filteredData : data.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de Paises</h1>

        <button onClick={openCrearPaisModal} className="btnAgregarDesdeAdmin">
          Crear Pais
        </button>


        <div className="Div-Table">
          <table id="paisesTable" className="Table custom-table">
            <thead>
              <tr>
                <th>ID Pais</th>
                <th>Nombre</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((pais) => (
                <tr key={pais.idPais} className="table-row">
                  <td className="table-cell">{pais.idPais}</td>
                  <td className="table-cell">{pais.nombre}</td>
                  <td className="table-cell">{pais.status}</td>
                  <td className="table-cell">
                  <IconButton
                      onClick={() => handleShowConfirmar(pais)}
                      style={{ color: 'red' }}
                      className="action-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditPais (pais.idPais)}
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

      <CrearPaisModal
        isOpen={isCrearPaisModalOpen}
        onRequestClose={closeCrearPaisModal}
      />

      {confirmarVisible && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar este País?</p>
            <button
              onClick={handleDeletePais}
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

export default ListaPais;
