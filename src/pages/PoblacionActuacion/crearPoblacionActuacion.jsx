import { useRef, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import { createPoblacionActuacion } from '../../services/PoblacionActuacion';
import Modal from 'react-modal';
import { getPoblacion} from "../../services/PoblacionServicio";
import { getActuacion } from "../../services/ActuacionesServicio";

Modal.setAppElement('#root');

const CrearPoblacionActuacion = ({ isOpen, onRequestClose }) => {
  const queryClient = useQueryClient();

  const IdPoblacionRef = useRef(null);
  const IdActuacionRef = useRef(null);

  const [poblaciones, setPoblaciones] = useState([]);
  const [actuaciones, setActuaciones] = useState([]);

  const mutation = useMutation("Poblacion_Actuacion", createPoblacionActuacion, {
    onSettled: () => queryClient.invalidateQueries("Poblacion_Actuacion"),
    mutationKey: "Poblacion_Actuacion",
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  });

  const handleRegistro = async (e) => {
    e.preventDefault();

    // Realiza la validación del formulario aquí

    let newPoblacionActuacion = {
      idPoblacion: IdPoblacionRef.current.value,
      idActuacion: IdActuacionRef.current.value,
    };

    await mutation.mutateAsync(newPoblacionActuacion);

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT
    });
    onRequestClose();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    const fetchPoblaciones = async () => {
      try {
        const data = await getPoblacion();
        setPoblaciones(data);
      } catch (error) {
        console.error('Error al obtener la lista de países:', error);
      }
    };

    const fetchActuaciones= async () => {
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


  const handleCloseModal = () => {
    // Reinicia los valores de los inputs
 
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
      contentLabel="Crear Poblacion-Actuacion"
      style={customStyles}
    >
    <div className="CrearSoli">
    <h2 style={{ color: 'black' }}>Crear Población-Actuacion</h2>
      <form onSubmit={handleRegistro} className="form">
        <div className='div-input-tipo'>
          <label htmlFor="idPoblacion" style={{ color: 'black' }}>ID de la Población:</label>
          <select id="idPoblacion" ref={IdPoblacionRef}  className="select" required>
              {poblaciones.map((poblacion) => (
                <option key={poblacion.idPoblacion} value={poblacion.idPoblacion}>
                  {poblacion.nombre}
                </option>
              ))}
            </select>
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="idActuacion" style={{ color: 'black' }}>ID de la Actuación:</label>
          <select id="idActuacion" ref={IdActuacionRef}  className="select" required>
              {actuaciones.map((actuacion) => (
                <option key={actuacion.idActuacion} value={actuacion.idActuacion}>
                  {actuacion.nombre}
                </option>
              ))}
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

export default CrearPoblacionActuacion;
