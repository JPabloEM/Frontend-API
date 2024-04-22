import React, { useRef, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import { createResponsable } from '../../services/ResponsableServicio';

Modal.setAppElement('#root');

const CrearResponsable = ({ isOpen, onRequestClose }) => {
  const queryClient = useQueryClient();
  const IDUsuarioRef = useRef(null);
  const StatusRef = useRef(null);

  const mutation = useMutation('Responsable', createResponsable, {
    onSettled: () => queryClient.invalidateQueries('Responsable'),
    mutationKey: 'Responsable',
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const handleStatusChange = () => {
    const selectedValue = StatusRef.current.value;
    StatusRef.current.style.color = selectedValue === "1" ? "green" : "red";
  };

  const handleRegistro = async (e) => {
    e.preventDefault();

    let newResponsable = {
      userId: IDUsuarioRef.current.value,
      status: StatusRef.current.value,
    };

    await mutation.mutateAsync(newResponsable);

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT,
    });

    onRequestClose();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCloseModal = () => {
    // Reinicia los valores de los inputs
    IDUsuarioRef.current.value = '';
    StatusRef.current.value = '';

    // Cierra el modal
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
      contentLabel="Crear Responsable"
      style={customStyles}
    >
      <div className="CrearSoli">
        <h2 style={{ color: 'black' }}>Crear Responsable</h2>
        <form onSubmit={handleRegistro} className="form">
          <div className="div-input-tipo">
            <label htmlFor="IDUsuario" style={{ color: 'black' }}>
              ID Usuario:
            </label>
            <input
              type="text"
              id="IDUsuario"
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

export default CrearResponsable;
