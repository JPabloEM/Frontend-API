import { useRef, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import { createPoblacion } from '../../services/PoblacionServicio';
import { getPais } from "../../services/PaisServicio";

Modal.setAppElement('#root'); // Ajusta el elemento raíz de tu aplicación


const CrearPoblacion = ({ isOpen, onRequestClose }) => {
  const queryClient = useQueryClient();
  const NombreRef = useRef(null);
  const IdPaisRef = useRef(null);
  const NumHabitantesRef = useRef(null);
  const DescripcionRef = useRef(null);
  const StatusRef = useRef(null);

  const [paises, setPaises] = useState([]);

  const mutation = useMutation("poblacion", createPoblacion, {
    onSettled: () => queryClient.invalidateQueries("poblacion"),
    mutationKey: "poblacion",
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  });

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const data = await getPais();
        setPaises(data);
      } catch (error) {
        console.error('Error al obtener la lista de países:', error);
      }
    };

    fetchPaises();
  }, []);

  const handleRegistro = async (e) => {
    e.preventDefault();

    // Realiza la validación del formulario aquí

    let newPoblacion = {
      nombre: NombreRef.current.value,
      idPais: IdPaisRef.current.value,
      numHabitantes: NumHabitantesRef.current.value,
      descripcion: DescripcionRef.current.value,
      status: StatusRef.current.value,
    };

    await mutation.mutateAsync(newPoblacion);

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT
    });

    // Cierra el modal después de crear la población
    onRequestClose();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCloseModal = () => {
    // Reinicia los valores de los inputs
    NombreRef.current.value = '';
    IdPaisRef.current.value = '';
    NumHabitantesRef.current.value = '';
    DescripcionRef.current.value = '';
    StatusRef.current.value = '';

    // Cierra el modal
    onRequestClose();
  };

  const handleStatusChange = () => {
    const selectedValue = StatusRef.current.value;
    StatusRef.current.style.color = selectedValue === "1" ? "green" : "red";
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
      contentLabel="Crear Población"
      style={customStyles}
    >
      <div className="CrearSoli">
        <h2 style={{ color: 'black' }}>Crear Población</h2>
        <form onSubmit={handleRegistro} className="form">
          <div className='div-input-tipo'>
            <label htmlFor="nombre" style={{ color: 'black' }}>Nombre:</label>
            <input
              type="text"
              id="nombre"
              ref={NombreRef}
              className="input"
              required
            />
          </div>
          <div className='div-input-tipo'>
            <label htmlFor="idPais" style={{ color: 'black' }}>País:</label>
            <select id="idPais" ref={IdPaisRef} className="select" required>
              {paises.map((pais) => (
                <option key={pais.idPais} value={pais.idPais}>
                  {pais.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className='div-input-tipo'>
            <label htmlFor="numHabitantes" style={{ color: 'black' }}>Número de Habitantes:</label>
            <input
              type="text"
              id="numHabitantes"
              ref={NumHabitantesRef}
              className="input"
              required

            />
          </div>
          <div className='div-input-tipo'>
            <label htmlFor="descripcion" style={{ color: 'black' }}>Descripción:</label>
            <input
              type="text"
              id="descripcion"
              className="input"
              ref={DescripcionRef}
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

export default CrearPoblacion;
