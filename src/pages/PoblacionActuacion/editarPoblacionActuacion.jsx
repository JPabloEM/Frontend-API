import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { updatePoblacionActuacion} from '../../services/PoblacionActuacion';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditarPobAct = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const IdPobAct = useRef(null); // Agregado el campo IdPais
  const IdPob = useRef(null);
  const IdAct = useRef(null);

  const mutationKey = `Poblacion_Actuacion/${id}`;
  const mutation = useMutation(mutationKey, updatePoblacionActuacion, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });

  const handleSalir = () => {
    // Navegar al componente ListaPoblacion al hacer clic en "Salir"
    navigate('/listaPoblacionActuacion'); // Reemplaza '/ruta-a-tu-lista-poblacion' con la ruta correcta
  };


  const handleRegistro = (event) => {
    event.preventDefault();

    let newData = {
      id: id,
      idPoblacion_Actuacion: IdPobAct.current.value, // Campo IdPais
      idPoblacion: IdPob.current.value,
      idActuacion: IdAct.current.value,
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

  return (
    <div className="edit-container-tipo">
      <h1 className="edit-tipo">Editar Poblacion Actuacion</h1>
      <p className="edit-id">ID PoblacionActuacion a editar: {id}</p>
      <form onSubmit={handleRegistro} className="form">
        <div className='div-input-tipo'>
          <label htmlFor="idPais" className="label-input">Confirmar ID PoblacionActuacion a editar:</label>
          <input
            type="text"
            id="idPais"
            ref={IdPobAct}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="nombrePais" className="label-input">
            Id Poblacion:
          </label>
          <input
            type="text"
            id="nombrePais"
            ref={IdPob}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="statusPais" className="label-input">
            Id Actuacion:
          </label>
          <input
            type="text"
            id="statusPais"
            ref={IdAct}
            required
            className="input"
          />
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

export default EditarPobAct;

