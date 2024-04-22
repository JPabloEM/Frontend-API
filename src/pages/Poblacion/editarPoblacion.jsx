import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { updatePoblacion, getPoblacionID } from '../../services/PoblacionServicio';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditarPoblacion = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const IdPoblacionRef = useRef(null);
  const NombreRef = useRef(null);
  const IdPaisRef = useRef(null);
  const NumHabitantesRef = useRef(null);
  const DescripcionRef = useRef(null);

  const StatusRef = useRef(null);

  const mutationKey = `Poblacion/${id}`;
  const mutation = useMutation(mutationKey, updatePoblacion, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });

  const handleStatusChange = () => {
    const selectedValue = StatusRef.current.value;
    StatusRef.current.style.color = selectedValue === "1" ? "green" : "red";
  };

  const handleSalir = () => {
    // Navegar al componente ListaPoblacion al hacer clic en "Salir"
    navigate('/listPoblacion'); // Reemplaza '/ruta-a-tu-lista-poblacion' con la ruta correcta
  };

  const handleRegistro = (event) => {
    event.preventDefault();

    let newData = {
      id: id,
      idPoblacion: IdPoblacionRef.current.value,
      nombre: NombreRef.current.value,
      idPais: IdPaisRef.current.value,
      numHabitantes: NumHabitantesRef.current.value,
      descripcion: DescripcionRef.current.value,

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
    async function cargarDatosPoblacion() {
      try {
        const datosPoblacion = await getPoblacionID(id);
        IdPoblacionRef.current.value = datosPoblacion.idPoblacion;
        NombreRef.current.value = datosPoblacion.nombre;
        IdPaisRef.current.value = datosPoblacion.idPais;
        NumHabitantesRef.current.value = datosPoblacion.numHabitantes;
        DescripcionRef.current.value = datosPoblacion.descripcion;

        StatusRef.current.value = datosPoblacion.status;
      } catch (error) {
        console.error(error);
      }
    }

    cargarDatosPoblacion();
  }, [id]);

  return (
    <div className="edit-container-tipo">
      <h1 className="edit-tipo">Editar Población</h1>
      <p className="edit-id">ID de la Población a editar: {id}</p>
      <form onSubmit={handleRegistro} className="form">
        <div className='div-input-tipo'>
          <label htmlFor="idPoblacion" className="label-input">Confirme el ID de la Población:</label>
          <input
            type="number"
            id="idPoblacion"
            ref={IdPoblacionRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="nombre" className="label-input">Nombre:</label>
          <input
            type="text"
            id="nombre"
            ref={NombreRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="idPais" className="label-input">ID del País:</label>
          <input
            type="text"
            id="idPais"
            ref={IdPaisRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="numHabitantes" className="label-input">Número de Habitantes:</label>
          <input
            type="number"
            id="numHabitantes"
            ref={NumHabitantesRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="descripcion" className="label-input">Descripción:</label>
          <input
            type="text"
            id="descripcion"
            ref={DescripcionRef}
            className="input"
          />
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

export default EditarPoblacion;
