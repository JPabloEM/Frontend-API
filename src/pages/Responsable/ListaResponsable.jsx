import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from 'react-query';
import { useNavigate, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CrearResponsableModal from '../../pages/Responsable/crearResponsable.jsx'; // Asegúrate de importar tu componente modal
import { eliminarResponsable, getResponsable } from '../../services/ResponsableServicio';

const ListaResponsables = () => {
  const { data, isLoading, isError, refetch } = useQuery('responsable', getResponsable, {
    enabled: true,
  });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [confirmarVisible, setConfirmarVisible] = useState(false);
  const [responsableAEliminar, setResponsableAEliminar] = useState(null);
  const [isCrearResponsableModalOpen, setIsCrearResponsableModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    // Inicializar DataTables después de que los datos se cargan o cambian
    $('#responsablesTable').DataTable();
  }, [data]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleEditResponsable = (id) => {
    navigate(`/Responsable/${id}`);
  };

  const handleShowConfirmar = (responsable) => {
    setResponsableAEliminar(responsable);
    setConfirmarVisible(true);
  };

  const handleHideConfirmar = () => {
    setConfirmarVisible(false);
    setResponsableAEliminar(null);
  };

  const handleDeleteResponsable = async () => {
    try {
      await eliminarResponsable(responsableAEliminar.idResponsable);
      await refetch();
      toast.success('Responsable eliminado correctamente');
    } catch (error) {
      console.error('Error en la solicitud Axios:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          toast.error(`Error al eliminar el Responsable: ${data.message}`);
        } else {
          toast.error('Error al eliminar el Responsable; está vinculado a otras tablas.');
        }
      } else if (error.request) {
        toast.error('No se recibió respuesta del servidor al intentar eliminar el Responsable.');
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

  const openCrearResponsableModal = () => {
    setIsCrearResponsableModalOpen(true);
  };

  const closeCrearResponsableModal = () => {
    setIsCrearResponsableModalOpen(false);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const filteredData = data.filter((responsable) => {
    return String(responsable.idResponsable) === searchId;
  });

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = searchId ? filteredData : data.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de Responsables</h1>

        <button onClick={openCrearResponsableModal} className="btnAgregarDesdeAdmin">
          Crear Responsable
        </button>


        <div className="Div-Table">
          <table id="responsablesTable" className="Table custom-table">
            <thead>
              <tr>
                <th>ID Responsable</th>
                <th>ID Usuario</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((responsable) => (
                <tr key={responsable.idResponsable} className="table-row">
                  <td className="table-cell">{responsable.idResponsable}</td>
                  <td className="table-cell">{responsable.userId}</td>
                  <td className="table-cell">{responsable.status}</td>
                  <td className="table-cell">
                    <IconButton
                      onClick={() => handleShowConfirmar(responsable)}
                      style={{ color: 'red' }}
                      className="action-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditResponsable(responsable.idResponsable)}
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

      <CrearResponsableModal
        isOpen={isCrearResponsableModalOpen}
        onRequestClose={closeCrearResponsableModal}
      />

      {confirmarVisible && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar este Responsable?</p>
            <button
              onClick={handleDeleteResponsable}
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

export default ListaResponsables;
