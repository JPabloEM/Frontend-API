import React, { useRef, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useMutation, useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import { createActuacion } from '../../services/ActuacionesServicio';
import { getProyecto } from '../../services/ProyectosServicio';

Modal.setAppElement('#root'); // Ajusta el elemento raíz de tu aplicación

const CrearActuacion = ({ isOpen, onRequestClose }) => {
  const queryClient = useQueryClient();

  const NombreRef = useRef(null);
  const DescripcionRef = useRef(null);
  const IdProyectoRef = useRef(null);
  const StatusRef = useRef(null);

  const [proyectos, setProyectos] = useState([]);

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

  const mutation = useMutation('actuacion', createActuacion, {
    onSettled: () => queryClient.invalidateQueries('actuacion'),
    mutationKey: 'actuacion',
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getProyecto();
        setProyectos(data);
      } catch (error) {
        console.error('Error al obtener la lista de países:', error);
      }
    };

    fetchProyectos();
  }, []);

  const handleStatusChange = () => {
    const selectedValue = StatusRef.current.value;
    StatusRef.current.style.color = selectedValue === "1" ? "green" : "red";
  };

  const handleRegistro = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (
      !NombreRef.current.value ||
      !DescripcionRef.current.value ||
      !IdProyectoRef.current.value ||
      !StatusRef.current.value
    ) {
      // Muestra una Toast indicando que no se han completado todos los campos
      toast.error('Por favor, completa todos los campos', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    // Realiza la mutación solo si la validación es exitosa
    let newActuacion = {
      nombre: NombreRef.current.value,
      descripcion: DescripcionRef.current.value,
      idProyecto: IdProyectoRef.current.value,
      status: StatusRef.current.value,
    };

    await mutation.mutateAsync(newActuacion);

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT,
    });

    setTimeout(() => {
      window.location.reload();
    }, 1000);

    // Cierra el modal después de crear la actuación
    onRequestClose();
  };

  const handleCloseModal = () => {
    // Reinicia los valores de los inputs
    NombreRef.current.value = '';
    DescripcionRef.current.value = '';
    IdProyectoRef.current.value = '';
    StatusRef.current.value = '';

    // Cierra el modal
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Crear Actuación"
      style={customStyles}
    >
      <div className="CrearSoli">
        <h2 style={{ color: 'black' }}>Crear Actuación</h2>
        <form onSubmit={handleRegistro} className="form">
          
            <div className='div-input-tipo'>
              <label htmlFor="nombre" className="label-input" style={{ color: 'black' }}>Nombre:</label>
              <input
                type="text"
                id="nombre"
                ref={NombreRef}
                className="input"
                required
              />
            </div>
            <div className='div-input-tipo'>
              <label htmlFor="descripcion" className="label-input" style={{ color: 'black' }}>Descripción:</label>
              <input
                type="text"
                id="descripcion"
                ref={DescripcionRef}
                className="input"
              />
            
          </div>
          
            <div className='div-input-tipo'>
              <label htmlFor="idProyecto" className="label-input" style={{ color: 'black' }}>Proyecto:</label>
              <select id="idProyecto" ref={IdProyectoRef} className="select" required>
                {proyectos.map((proyecto) => (
                  <option key={proyecto.idProyecto} value={proyecto.idProyecto}>
                    {proyecto.titulo}
                  </option>
                ))}
              </select>
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

export default CrearActuacion;
