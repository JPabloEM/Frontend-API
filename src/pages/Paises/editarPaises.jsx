import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { updatePais, getPaisID } from '../../services/PaisServicio';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const EditarPais = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const IdPais = useRef(null); // Agregado el campo IdPais
  const NombrePais = useRef(null);
  const StatusPais = useRef(null);

  const mutationKey = `Pais/${id}`;
  const mutation = useMutation(mutationKey, updatePais, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });

  const handleSalir = () => {
    // Navegar al componente ListaPoblacion al hacer clic en "Salir"
    navigate('/listaPais'); // Reemplaza '/ruta-a-tu-lista-poblacion' con la ruta correcta
  };


  const handleRegistro = (event) => {
    event.preventDefault();

    let newData = {
      id: id,
      idPais: IdPais.current.value, // Campo IdPais
      nombre: NombrePais.current.value,
      status: StatusPais.current.value,
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
    const selectedValue = StatusPais.current.value;
    StatusPais.current.style.color = selectedValue === "1" ? "green" : "red";
  };


  useEffect(() => {
    async function cargarDatosPais() {
      try {
        console.log("ID del país a cargar:", id);

        if (id === undefined) {
          console.error("ID es undefined. Asegúrate de proporcionar un valor de ID válido.");
          return;
        }

        const datosPais = await getPaisID(id);
        // Verificar si 'datosPais' es definido
        if (datosPais) {
          console.log("Datos del país cargados:", datosPais);

          // Verificar cada propiedad individualmente
          if (datosPais.idPais !== undefined) {
            IdPais.current.value = datosPais.idPais.toString();
          } else {
            console.error("idPais es undefined en datosPais.");
          }

          if (datosPais.nombre !== undefined) {
            NombrePais.current.value = datosPais.nombre;
          } else {
            console.error("nombre es undefined en datosPais.");
          }

          if (datosPais.status !== undefined) {
            StatusPais.current.value = datosPais.status.toString();
          } else {
            console.error("status es undefined en datosPais.");
          }

        } else {
          console.error("Los datos del país son undefined.");
        }
      } catch (error) {
        console.error("Error al cargar datos del país:", error);
      }
    }


    cargarDatosPais();
  }, [id]);

  return (
    <div className="edit-container-tipo">
      <h1 className="edit-tipo">Editar Pais</h1>
      <p className="edit-id">ID del Pais a editar: {id}</p>
      <form onSubmit={handleRegistro} className="form">
        <div className='div-input-tipo'>
          <label htmlFor="idPais" className="label-input" >Confirmar ID Pais a editar:</label>
          <input
            type="number"
            id="idPais"
            ref={IdPais}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="nombrePais" className="label-input" >
            Nombre:
          </label>
          <input
            type="text"
            id="nombrePais"
            ref={NombrePais}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="StatusPais">Status:</label>
          <select
            id="StatusPais"
            ref={StatusPais}
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

export default EditarPais;

