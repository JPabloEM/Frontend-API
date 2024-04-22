import { useRef, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import { createSede } from '../../services/SedesServicio';
import { getPais } from "../../services/PaisServicio";
import { getDirector } from "../../services/DirectorServicio";

Modal.setAppElement('#root');

const CrearSedes = ({ isOpen, onRequestClose }) => {
  const queryClient = useQueryClient();
  const ciudadRef = useRef(null);
  const presuRef = useRef(null);
  const direccionRef = useRef(null);
  const idPaisRef = useRef(null);
  const telefonoRef = useRef(null);
  const idDirectorRef = useRef(null);
  const statusRef = useRef(null);

  const [paises, setPaises] = useState([]);
  const [directores, setDirectores] = useState([]);

  const mutation = useMutation("sede", createSede, {
    onSettled: () => queryClient.invalidateQueries("sede"),
    mutationKey: "sede",
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

    const fetchDirectores = async () => {
      try {
        const data = await getDirector();
        setDirectores(data);
      } catch (error) {
        console.error('Error al obtener la lista de directores:', error);
      }
    };

    fetchPaises();
    fetchDirectores();
  }, []);

  const handleStatusChange = () => {
    const selectedValue = statusRef.current.value;
    statusRef.current.style.color = selectedValue === "1" ? "green" : "red";
  };

  const handleRegistro = async (e) => {
    e.preventDefault();

    let newSede = {
      ciudad: ciudadRef.current.value,
      fondo_Presupuestario: presuRef.current.value,
      direccion: direccionRef.current.value,
      idPais: idPaisRef.current.value,
      telefono: telefonoRef.current.value,
      idDirector: idDirectorRef.current.value,
      status: statusRef.current.value,
    };

    await mutation.mutateAsync(newSede);

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT
    });
    onRequestClose();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCloseModal = () => {
    // Reinicia los valores de los inputs
    ciudadRef.current.value = '';
    presuRef.current.value = '';
    direccionRef.current.value = '';
    idPaisRef.current.value = '';
    telefonoRef.current.value = '';
    idDirectorRef.current.value = '';
    statusRef.current.value = '';


    // Cierra el modal
    onRequestClose();
  };

  const customStyles = {
    content: {
      top: '0', // Ajusta el valor top a 0 para comenzar desde la parte superior
      left: '0',
      right: '0',
      bottom: '0',
      margin: 'auto', // Esto centrará el modal horizontalmente
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
      contentLabel="Crear Sede"
      style={customStyles}
    >
      <div className="CrearSoli">
        <h2 style={{ color: 'black' }}>Crear Sede</h2>
        <form onSubmit={handleRegistro} className="form">
          <div className='div-input-tipo'>
            <label htmlFor="ciudad">Ciudad:</label>
            <input type="text" id="ciudad" ref={ciudadRef} className="input" required />
          </div>
          <div className="div-input-tipo">
            <label htmlFor="presu" style={{ color: 'black' }}>
              Presupuesto:
            </label>
            <input
              type="number"
              id="presu"
              ref={presuRef}
              className="input"
              required
            />
          </div>
          <div className='div-input-tipo'>
            <label htmlFor="direccion">Dirección:</label>
            <input type="text" id="direccion" ref={direccionRef} className="input" required />
          </div>
          <div className='div-input-tipo'>
            <label htmlFor="idPais">País:</label>
            <select id="idPais" ref={idPaisRef} className="select" required>
              {paises.map((pais) => (
                <option key={pais.idPais} value={pais.idPais}>
                  {pais.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className='div-input-tipo'>
            <label htmlFor="telefono">Teléfono:</label>
            <input type="text" id="telefono" ref={telefonoRef} className="input" required />
          </div>
          <div className='div-input-tipo'>
            <label htmlFor="idDirector">Director:</label>
            <select id="idDirector" ref={idDirectorRef} className="select" required>
              {directores.map((director) => (
                <option key={director.idDirector} value={director.idDirector}>
                  {director.userId}
                </option>
              ))}
            </select>
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

export default CrearSedes;
