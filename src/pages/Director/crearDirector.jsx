import React, { useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import { createDirector } from '../../services/DirectorServicio';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CrearDirector = ({ isOpen, onRequestClose }) => {
  const queryClient = useQueryClient();
  const IDUsuarioRef = useRef(null);
  const StatusRef = useRef(null);

  const mutation = useMutation("director", createDirector, {
    onSettled: () => queryClient.invalidateQueries("director"),
    mutationKey: "director",
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  });

  const handleRegistro = async (e) => {
    e.preventDefault();

    let newDirector = {
      userId: IDUsuarioRef.current.value,
      status: StatusRef.current.value,
    };

    await mutation.mutateAsync(newDirector);

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT
    });
    onRequestClose();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleStatusChange = () => {
    const selectedValue = StatusRef.current.value;
    StatusRef.current.style.color = selectedValue === "1" ? "green" : "red";
  };

  const handleCloseModal = () => {
    IDUsuarioRef.current.value = '';
    StatusRef.current.value = '';
    onRequestClose();
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      maxHeight: '100vh',
      overflowY: 'auto',
      backgroundColor: 'white',
      color: 'black',
      borderRadius: '8px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Crear Director"
      style={customStyles}
    >
      <div className="CrearSoli">
        <h2>Crear Director</h2>
        <form onSubmit={handleRegistro} className="form">
          <div className='div-input-tipo'>
            <label htmlFor="idUsuario">ID Usuario:</label>
            <input
              type="text"
              id="nombre"
              ref={IDUsuarioRef}
              className="input"
              required
            />
          </div>
          <div className='div-input-tipo'>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              ref={StatusRef}
              className="input"
              onChange={handleStatusChange}
              required
            >
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
          <div className="centrar-boton">
            <button type="submit" className="btnCrear">
              Crear
            </button>
            <button
              type="button"
              className="btnCerrarModal"
              onClick={handleCloseModal}
            >
              Cerrar
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </Modal>
  );
};

export default CrearDirector;
