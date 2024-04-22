import { useRef, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import { createProyecto } from '../../services/ProyectosServicio';
import { getSedes } from '../../services/SedesServicio';
import { getResponsable } from '../../services/ResponsableServicio';

Modal.setAppElement('#root');

const CrearProyecto = ({ isOpen, onRequestClose }) => {
  const queryClient = useQueryClient();
  const TituloRef = useRef(null);
  const FechaInicioRef = useRef(null);
  const FechaFinRef = useRef(null);
  const PresupuestoRef = useRef(null);
  const IdResponsableRef = useRef(null);
  const IdSedeRef = useRef(null);
  const StatusRef = useRef(null);

  const [sedes, setSedes] = useState([]);
  const [responsables, setResponsables] = useState([]);

  const mutation = useMutation('proyecto', createProyecto, {
    onSettled: () => queryClient.invalidateQueries('proyecto'),
    mutationKey: 'proyecto',
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const data = await getSedes();
        setSedes(data);
      } catch (error) {
        console.error('Error al obtener la lista de países:', error);
      }
    };

    const fetchResponsables = async () => {
      try {
        const data = await getResponsable();
        setResponsables(data);
      } catch (error) {
        console.error('Error al obtener la lista de directores:', error);
      }
    };

    fetchSedes();
    fetchResponsables();
  }, []);

  const handleRegistro = async (e) => {
    e.preventDefault();

    let newProyecto = {
      titulo: TituloRef.current.value,
      fecha_Inicio: FechaInicioRef.current.value,
      fecha_Fin: FechaFinRef.current.value,
      presupuesto: PresupuestoRef.current.value,
      idResponsable: IdResponsableRef.current.value,
      idSede: IdSedeRef.current.value,
      status: StatusRef.current.value,
    };

    await mutation.mutateAsync(newProyecto);

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT,
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
    // Reinicia los valores de los inputs
    TituloRef.current.value = '';
    FechaInicioRef.current.value = '';
    FechaFinRef.current.value = '';
    PresupuestoRef.current.value = '';
    IdResponsableRef.current.value = '';
    IdSedeRef.current.value = '';
    StatusRef.current.value = '';

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
      contentLabel="Crear Proyecto"
      style={customStyles}
    >
      <div className="CrearSoli">
        <h2 style={{ color: 'black' }}>Crear Proyecto</h2>
        <form onSubmit={handleRegistro} className="form">
          <div className="div-input-tipo">
            <label htmlFor="titulo" style={{ color: 'black' }}>
              Título:
            </label>
            <input
              type="text"
              id="titulo"
              ref={TituloRef}
              className="input"
              required
            />
          </div>
          <div className="div-input-tipo">
            <label htmlFor="fechaInicio" style={{ color: 'black' }}>
              Fecha de Inicio:
            </label>
            <input
              type="date"
              id="fechaInicio"
              ref={FechaInicioRef}
              className="input"
              required
            />
          </div>
          <div className="div-input-tipo">
            <label htmlFor="fechaFin" style={{ color: 'black' }}>
              Fecha de Fin:
            </label>
            <input
              type="date"
              id="fechaFin"
              ref={FechaFinRef}
              className="input"
              required
            />
          </div>
          <div className="div-input-tipo">
            <label htmlFor="presupuesto" style={{ color: 'black' }}>
              Presupuesto:
            </label>
            <input
              type="number"
              id="presupuesto"
              ref={PresupuestoRef}
              className="input"
              required
            />
          </div>
          <div className="div-input-tipo">
            <label htmlFor="idResponsable" style={{ color: 'black' }}>
              Responsable:
            </label>
            <select
              id="idResponsable"
              ref={IdResponsableRef}
              className="select"
              required
            >
              {responsables.map((responsable) => (
                <option
                  key={responsable.idResponsable}
                  value={responsable.idResponsable}
                >
                  {responsable.userId}
                </option>
              ))}
            </select>
          </div>
          <div className="div-input-tipo">
            <label htmlFor="idSede" style={{ color: 'black' }}>
              Ciudad de Sede:
            </label>
            <select id="idSede" ref={IdSedeRef} className="select" required>
              {sedes.map((sede) => (
                <option key={sede.idSede} value={sede.idSede}>
                  {sede.ciudad}
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

export default CrearProyecto;
