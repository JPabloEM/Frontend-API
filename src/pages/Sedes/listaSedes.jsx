import React, { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import { useQuery } from "react-query";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import { getSedes, eliminarSede } from "../../services/SedesServicio";
import { getPais } from "../../services/PaisServicio";
import { getDirector } from "../../services/DirectorServicio";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CrearSedeModal from "../../pages/Sedes/crearSede.jsx"; // Asegúrate de importar tu componente modal

const ListaSedes = () => {
  const { data: sedes, isLoading, isError, refetch } = useQuery("Sede", getSedes, {
    enabled: true,
  });

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchId, setSearchId] = useState("");
  const [confirmarVisible, setConfirmarVisible] = useState(false);
  const [sedeAEliminar, setSedeAEliminar] = useState(null);
  const [isCrearSedeModalOpen, setIsCrearSedeModalOpen] = useState(false);

  const itemsPerPage = 10;

  const [paises, setPaises] = useState([]);
  const [directores, setDirectores] = useState([]);

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const paisesData = await getPais();
        setPaises(paisesData);
      } catch (error) {
        console.error('Error al obtener la lista de países:', error);
      }
    };

    const fetchDirectores = async () => {
      try {
        const directoresData = await getDirector();
        setDirectores(directoresData);
      } catch (error) {
        console.error('Error al obtener la lista de directores:', error);
      }
    };

    fetchPaises();
    fetchDirectores(); 
  }, []);

  useEffect(() => {
    const table = $("#sedesTable").DataTable();

    // Destruir la tabla antes de volver a inicializarla
    table.destroy();

    // Inicializar DataTables después de que los datos se cargan o cambian
    $("#sedesTable").DataTable({
      // Configuraciones personalizadas, si las necesitas
    });
  }, [sedes]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleEditSede = (id) => {
    navigate(`/Sede/${id}`);
  };

  const handleShowConfirmar = (sede) => {
    setSedeAEliminar(sede);
    setConfirmarVisible(true);
  };

  const handleHideConfirmar = () => {
    setConfirmarVisible(false);
    setSedeAEliminar(null);
  };

  const handleDeleteSede= async () => {
    try {
      await eliminarSede(sedeAEliminar.idSede);
      await refetch();
      toast.success('Sede eliminada correctamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error en la solicitud Axios:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          toast.error(`Error al eliminar la Sedes: ${data.message}`);
        } else {
          toast.error('Error al eliminar la Sedes; está vinculado a otras tablas.');
        }
      } else if (error.request) {
        toast.error('No se recibió respuesta del servidor al intentar eliminar la Sedes.');
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

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const renderData = () => {
    return searchId ? sedes.filter((sede) => String(sede.idSede) === searchId) : sedes;
  };

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(renderData().length / itemsPerPage);
  const currentData = renderData().slice(offset, offset + itemsPerPage);

  const openCrearSedeModal = () => {
    setIsCrearSedeModalOpen(true);
  };

  const closeCrearSedeModal = () => {
    setIsCrearSedeModalOpen(false);
  };

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de sedes</h1>
        
        <button onClick={openCrearSedeModal} className="btnAgregarDesdeAdmin">
          Crear Sede
        </button>
        
        
        <div className="Div-Table">
          <table id="sedesTable" className="Table custom-table">
            <thead>
              <tr>
                <th>ID sede</th>
                <th>Ciudad</th>
                <th>Presupuesto</th>
                <th>Direccion</th>
                <th>País</th>
                <th>Telefono</th>
                <th>Identificacion Director</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((sede) => (
                <tr key={sede.idSede} className="table-row">
                  <td className="table-cell">{sede.idSede}</td>
                  <td className="table-cell">{sede.ciudad}</td>
                  <td className="table-cell">{sede.fondo_Presupuestario}</td>
                  <td className="table-cell">{sede.direccion}</td>
                  <td className="table-cell">{paises.find((pais) => pais.idPais === sede.idPais)?.nombre || "NombrePaisNoEncontrado"}</td>
                  <td className="table-cell">{sede.telefono}</td>
                  <td className="table-cell">{directores.find((director) => director.idDirector === sede.idDirector)?.userId || "UsuarioDirectorNoEncontrado"}</td>
                  <td className="table-cell">{sede.status}</td>
                  <td className="table-cell">
                  <IconButton
                      onClick={() => handleShowConfirmar(sede)}
                      style={{ color: 'red' }}
                      className="action-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditSede (sede.idSede)}
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

      <CrearSedeModal
        isOpen={isCrearSedeModalOpen}
        onRequestClose={closeCrearSedeModal}
      />

      {confirmarVisible && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar esta Sede?</p>
            <button
              onClick={handleDeleteSede}
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

export default ListaSedes;
