import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { updateActuacion, getActuacionID } from '../../services/ActuacionesServicio';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getProyecto } from '../../services/ProyectosServicio';

const EditarActuacion = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const IdActuacionRef = useRef(null); // Agregado el campo IdActuacion

  const NombreActuacionRef = useRef(null);
  const DescripcionRef = useRef(null);
  const IdProyectoRef = useRef(null);
  const StatusActuacionRef = useRef(null);

  const [proyectos, setProyectos] = useState([]);

  const mutationKey = `Actuacion/${id}`;
  const mutation = useMutation(mutationKey, updateActuacion, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });

  const handleStatusChange = () => {
    const selectedValue = StatusActuacionRef.current.value;
    StatusActuacionRef.current.style.color = selectedValue === "1" ? "green" : "red";
  };

  const handleSalir = () => {
    // Navegar al componente ListaPoblacion al hacer clic en "Salir"
    navigate('/listActuaciones'); // Reemplaza '/ruta-a-tu-lista-poblacion' con la ruta correcta
  };


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


  const handleRegistro = (event) => {
    event.preventDefault();



    let newData = {
      id: id,
      idActuacion: IdActuacionRef.current.value,

      nombre: NombreActuacionRef.current.value,
      descripcion: DescripcionRef.current.value,
      idProyecto: IdProyectoRef.current.value,
      status: StatusActuacionRef.current.value,
    };

    // Enviar la solicitud de actualización al servidor
    mutation.mutateAsync(newData)
      .catch((error) => {
        console.error('Error en la solicitud Axios:', error);
      });

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  useEffect(() => {
    async function cargarDatosActuacion() {
      try {
        const datosActuacion = await getActuacionID(id);
        IdActuacionRef.current.value = datosActuacion.idActuacion;

        NombreActuacionRef.current.value = datosActuacion.nombre;
        DescripcionRef.current.value = datosActuacion.descripcion;
        IdProyectoRef.current.value = datosActuacion.idProyecto;
        StatusActuacionRef.current.value = datosActuacion.status;
      } catch (error) {
        console.error(error);
      }
    }

    cargarDatosActuacion();
  }, [id]);

  return (
    <div className="edit-container-tipo">
      <h1 className="edit-tipo">Editar Actuacion</h1>
      <p className="edit-id">ID de la Actuacion a editar: {id}</p>
      <form onSubmit={handleRegistro} className="form">
        <div className='div-input-tipo'>
          <label htmlFor="idActuacion" className="label-input">Confirme el ID del la Actuacion:</label>
          <input
            type="text"
            id="idActuacion"
            ref={IdActuacionRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="nombreActuacion" className="label-input">
            Nombre de la Actuacion:
          </label>
          <input
            type="text"
            id="nombreActuacion"
            ref={NombreActuacionRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="descripcion" className="label-input">
            Descripción:
          </label>
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
                  <option key={proyecto.idProyecto}  className="input" value={proyecto.idProyecto}>
                    {proyecto.titulo}
                  </option>
                ))}
              </select>
            </div>

        <div className='div-input-tipo'>
          <label htmlFor="statusActuacion" className="label-input">Status:</label>
          <select
            id="statusActuacion"
            ref={StatusActuacionRef}
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

export default EditarActuacion;