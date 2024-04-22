import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CrearDirectorModal from '../../pages/Director/crearDirector.jsx'; // Asegúrate de importar tu componente modal
import { eliminarDirector, getDirector } from '../../services/DirectorServicio';



const ListaDirector = () => {
  const { data, isLoading, isError, refetch } = useQuery('Director', getDirector, {
    enabled: true,
  });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [confirmarVisible, setConfirmarVisible] = useState(false);
  const [directorAEliminar, setDirectorAEliminar] = useState(null);
  const [isCrearDirectorModalOpen, setIsCrearDirectorModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    // Inicializar DataTables después de que los datos se cargan o cambian
    $('#directoresTable').DataTable();
  }, [data]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleEditDirector = (id) => {
    navigate(`/Director/${id}`);
  };



  const handleShowConfirmar = (director) => {
    setDirectorAEliminar(director);
    setConfirmarVisible(true);
  };

  const handleHideConfirmar = () => {
    setConfirmarVisible(false);
    setDirectorAEliminar(null);
  };

  const handleDeleteDirector = async () => {
    try {
      await eliminarDirector(directorAEliminar.idDirector);
      await refetch();
      toast.success('Director eliminado correctamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error en la solicitud Axios:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          toast.error(`Error al eliminar el director: ${data.message}`);
        } else {
          toast.error('Error al eliminar el director; está vinculado a otras tablas.');
        }
      } else if (error.request) {
        toast.error('No se recibió respuesta del servidor al intentar eliminar el director.');
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

  const openCrearDirectorModal = () => {
    setIsCrearDirectorModalOpen(true);
  };

  const closeCrearDirectorModal = () => {
    setIsCrearDirectorModalOpen(false);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const filteredData = data.filter((director) => {
    return String(director.idDirector) === searchId;
  });

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = searchId ? filteredData : data.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de Directores</h1>

        <button onClick={openCrearDirectorModal} className="btnAgregarDesdeAdmin">
          Crear Director
        </button>


        <div className="Div-Table">
          <table id="directoresTable" className="Table custom-table">
            <thead>
              <tr>
                <th>ID Director</th>
                <th>ID Usuario</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((director) => (
                <tr key={director.idDirector} className="table-row">
                  <td className="table-cell">{director.idDirector}</td>
                  <td className="table-cell">{director.userId}</td>
                  <td className="table-cell">{director.status}</td>
                  <td className="table-cell">
                    <IconButton
                      onClick={() => handleShowConfirmar(director)}
                      style={{ color: 'red' }}
                      className="action-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditDirector(director.idDirector)}
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

      <CrearDirectorModal
        isOpen={isCrearDirectorModalOpen}
        onRequestClose={closeCrearDirectorModal}
      />

      {confirmarVisible && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar este Director?</p>
            <button
              onClick={handleDeleteDirector}
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

export default ListaDirector;
