import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { updateDirector, getDirectorID } from '../../services/DirectorServicio';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditarDirector = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const IdDirectorRef = useRef(null);
  const IDUsuRef = useRef(null); // Cambiado el nombre de la referencia
  const StatusRef = useRef(null); // Cambiado el nombre de la referencia

  const mutationKey = `Director/${id}`; // Cambiado el nombre del mutationKey
  const mutation = useMutation(mutationKey, updateDirector, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });

  const handleSalir = () => {
    // Navegar al componente ListaPoblacion al hacer clic en "Salir"
    navigate('/listDirector'); // Reemplaza '/ruta-a-tu-lista-poblacion' con la ruta correcta
  };

  const handleRegistro = (event) => {
    event.preventDefault();

    let newData = {
      id: id,
      idDirector: IdDirectorRef.current.value,
      userId: IDUsuRef.current.value, // Cambiado el nombre del campo
      status: StatusRef.current.value, // Cambiado el nombre del campo
    };

    console.log(newData);
    // Enviar la solicitud de actualización al servidor
    mutation.mutateAsync(newData)
      .catch((error) => {
        console.error('Error en la solicitud Axios:', error);
      });

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleStatusChange = () => {
    const selectedValue = StatusRef.current.value;
    StatusRef.current.style.color = selectedValue === "1" ? "green" : "red";
  };

  useEffect(() => {
    async function cargarDatosDirector() {
      try {
        const datosDirector = await getDirectorID(id);
        IdDirectorRef.current.value = datosDirector.idDirector;
        IDUsuRef.current.value = datosDirector.userId; // Cambiado el nombre del campo
        StatusRef.current.value = datosDirector.status; // Cambiado el nombre del campo

      } catch (error) {
        console.error(error);
      }
    }

    cargarDatosDirector();
  }, [id]);

  return (
    <div className="edit-container-tipo">
      <h1 className="edit-tipo">Editar Director</h1>
      <p className="edit-id">ID del Director a editar: {id}</p>
      <form onSubmit={handleRegistro} className="form">
        <div className='div-input-tipo'>
          <label htmlFor="idDirector" className="label-input">Confirme el ID del Director:</label>
          <input
            type="number"
            id="idDirector"
            ref={IdDirectorRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="userId" className="label-input">
            UserId:
          </label>
          <input
            type="text"
            id="userId"
            ref={IDUsuRef}
            required
            className="input"
          />
        </div>

        <div className='div-input-tipo'>
          <label htmlFor="status" className="label-input">Status:</label>
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

export default EditarDirector;
