import { useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { createPais } from '../../services/PaisServicio';
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Ajusta el elemento raíz de tu aplicación

const CrearPaises = ({ isOpen, onRequestClose }) => {
  const queryClient = useQueryClient();
  const nomPaisRef = useRef(null);
  const statusRef = useRef(null);

  const mutation = useMutation("pais", createPais, {
    onSettled: () => queryClient.invalidateQueries("pais"),
    mutationKey: "pais",
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  });

  const handleRegistro = async (e) => {
    e.preventDefault();

    // Realiza la validación del formulario aquí

    let newResponsable = {
      nombre: nomPaisRef.current.value,
      status: statusRef.current.value,
    };

    const token = localStorage.getItem('token');

    await mutation.mutateAsync(newResponsable, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT
    });

    // Cierra el modal después de crear el país
    onRequestClose();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleStatusChange = () => {
    const selectedValue = statusRef.current.value;
    statusRef.current.style.color = selectedValue === "1" ? "green" : "red";
  };

  const handleCloseModal = () => {
    // Reinicia los valores de los inputs
    nomPaisRef.current.value = '';
    statusRef.current.value = '';

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
      width: '40%', // Ajusta el ancho del modal según sea necesario
      backgroundColor: 'white',
      color: 'black',
      borderRadius: '8px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Cambia el color de fondo del overlay
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Crear País"
      style={customStyles}
    >
      <div className="CrearSoli">
        <h2 style={{ color: 'black' }}>Crear País</h2>
        <form onSubmit={handleRegistro} className="form">
          <div className='div-input-tipo'>
            <label htmlFor="nombreSolicitante" className="label-input" style={{ color: 'black' }}>Nombre:</label>
            <input
              type="text"
              id="nombreSolicitante"
              ref={nomPaisRef}
              className="input"
              required
              

            />
          </div>
          <div className='div-input-tipo'>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              ref={statusRef}
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
            <button type="button" className="btnCerrarModal" onClick={handleCloseModal}>
              Cerrar
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </Modal>
  );
};

export default CrearPaises;
