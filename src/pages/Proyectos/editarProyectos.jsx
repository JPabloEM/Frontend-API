import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { updateProyecto, getProyectoID } from '../../services/ProyectosServicio';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getSedes } from '../../services/SedesServicio';
import { getResponsable } from '../../services/ResponsableServicio';


const EditarProyecto = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const IdProyectoRef = useRef(null);
  const TituloRef = useRef(null);
  const FechaInicioRef = useRef(null);
  const FechaFinRef = useRef(null);
  const PresupuestoRef = useRef(null);
  const IdResponsableRef = useRef(null);
  const IdSedeRef = useRef(null);
  const StatusRef = useRef(null);

  const mutationKey = `Proyecto/${id}`;
  const mutation = useMutation(mutationKey, updateProyecto, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });

  const [sedes, setSedes] = useState([]);
  const [responsables, setResponsables] = useState([]);

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

  const handleSalir = () => {
    // Navegar al componente ListaPoblacion al hacer clic en "Salir"
    navigate('/listProyectos'); // Reemplaza '/ruta-a-tu-lista-poblacion' con la ruta correcta
  };

  const handleStatusChange = () => {
    const selectedValue = StatusRef.current.value;
    StatusRef.current.style.color = selectedValue === "1" ? "green" : "red";
  };


  const handleRegistro = (event) => {
    event.preventDefault();

    let newData = {
      id: id,
      idProyecto: IdProyectoRef.current.value,
      titulo: TituloRef.current.value,
      fecha_Inicio: FechaInicioRef.current.value,
      fecha_Fin: FechaFinRef.current.value,
      presupuesto: PresupuestoRef.current.value,
      idResponsable: IdResponsableRef.current.value,
      idSede: IdSedeRef.current.value,
      status: StatusRef.current.value,
    };

    console.log(newData);

    mutation.mutateAsync(newData)
      .then(() => {
        toast.success('¡Guardado Exitosamente!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        console.error('Error en la solicitud Axios:', error);
      });
  };

  useEffect(() => {
    async function cargarDatosProyecto() {
      try {
        const datosProyecto = await getProyectoID(id);
        IdProyectoRef.current.value = datosProyecto.idProyecto;
        TituloRef.current.value = datosProyecto.titulo;
        FechaInicioRef.current.value = datosProyecto.fecha_Inicio;
        FechaFinRef.current.value = datosProyecto.fecha_Fin;
        PresupuestoRef.current.value = datosProyecto.presupuesto;
        IdResponsableRef.current.value = datosProyecto.idResponsable;
        IdSedeRef.current.value = datosProyecto.idSede;
        StatusRef.current.value = datosProyecto.status;
      } catch (error) {
        console.error(error);
      }
    }

    cargarDatosProyecto();
  }, [id]);

  return (
    <div className="edit-container-tipo">
      <h1 className="edit-tipo">Editar Proyecto</h1>
      <p className="edit-id">ID del Proyecto a editar: {id}</p>
      <form onSubmit={handleRegistro} className="form">
        <div className='div-input-tipo'>
          <label htmlFor="idProyecto" className="label-input">Confirme el ID del Proyecto:</label>
          <input
            type="number"
            id="idProyecto"
            ref={IdProyectoRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="titulo" className="label-input">Título:</label>
          <input
            type="text"
            id="titulo"
            ref={TituloRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="fechaInicio" className="label-input">Fecha de Inicio:</label>
          <input
            type="date"
            id="fechaInicio"
            ref={FechaInicioRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="fechaFin" className="label-input">Fecha de Fin:</label>
          <input
            type="date"
            id="fechaFin"
            ref={FechaFinRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="presupuesto" className="label-input">Presupuesto:</label>
          <input
            type="text"
            id="presupuesto"
            ref={PresupuestoRef}
            required
            className="input"
          />
        </div>

        <div className="div-input-tipo">
            <label htmlFor="idResponsable" style={{ color: 'black' }} className="label-input">
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
            <label htmlFor="idSede" style={{ color: 'black' }} className="label-input">
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
            <label htmlFor="StatusRef">Status:</label>
            <select
              id="StatusRef"
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
          <button className="btnCrear" type="submit">
            Editar
          </button>
          <button className="btnCerrarModal" onClick={handleSalir} type="submit">
            Salir
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditarProyecto;
