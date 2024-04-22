import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { updateResponsable, getResponsableID } from '../../services/ResponsableServicio';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditarResponsable = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const IdResponsableRef = useRef(null);
  const IDUsuRef = useRef(null); // Cambiado el nombre de la referencia
  const StatusRef = useRef(null); // Cambiado el nombre de la referencia

  const mutationKey = `Responsable/${id}`; // Cambiado el nombre del mutationKey
  const mutation = useMutation(mutationKey, updateResponsable, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });

  const handleRegistro = (event) => {
    event.preventDefault();

    let newData = {
      id: id,
      idResponsable: IdResponsableRef.current.value,
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

  const handleSalir = () => {
    // Navegar al componente ListaPoblacion al hacer clic en "Salir"
    navigate('/listRes'); // Reemplaza '/ruta-a-tu-lista-poblacion' con la ruta correcta
  };

  useEffect(() => {
    async function cargarDatosResponsable() {
      try {
        const datosResponsable = await getResponsableID(id);
        IdResponsableRef.current.value = datosResponsable.idDirector;
        IDUsuRef.current.value = datosResponsable.userId; // Cambiado el nombre del campo
        StatusRef.current.value = datosResponsable.status; // Cambiado el nombre del campo

      } catch (error) {
        console.error(error);
      }
    }

    cargarDatosResponsable();
  }, [id]);

  return (
    <div className="edit-container-tipo">
      <h1 className="edit-tipo">Editar Responsable</h1>
      <p className="edit-id">ID del Responsable a editar: {id}</p>
      <form onSubmit={handleRegistro} className="form">
        <div className='div-input-tipo'>
          <label htmlFor="idResponsable" className="label-input">Confirme el ID del Responsable:</label>
          <input
            type="text"
            id="idResponsable"
            ref={IdResponsableRef}
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

export default EditarResponsable;
