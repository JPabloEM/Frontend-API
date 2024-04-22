import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { updateSede, getSedeID } from '../../services/SedesServicio';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getPais } from "../../services/PaisServicio";
import { getDirector } from "../../services/DirectorServicio";

const EditarSede = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const ciudadRef = useRef(null);
  const presuRef = useRef(null);
  const direccionRef = useRef(null);
  const idPaisRef = useRef(null);
  const telefonoRef = useRef(null);
  const idDirectorRef = useRef(null);
  const statusRef = useRef(null);
  const sedeIDRef = useRef(null);

  const [paises, setPaises] = useState([]);
  const [directores, setDirectores] = useState([]);


  const mutationKey = `Sede/${id}`;
  const mutation = useMutation(mutationKey, updateSede, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });

  const handleSalir = () => {
    // Navegar al componente ListaPoblacion al hacer clic en "Salir"
    navigate('/listSede'); // Reemplaza '/ruta-a-tu-lista-poblacion' con la ruta correcta
  };

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

  const handleRegistro = (event) => {
    event.preventDefault();

    let newData = {
      id: id,
      idSede: sedeIDRef.current.value,
      ciudad: ciudadRef.current.value,
      fondo_Presupuestario: presuRef.current.value,
      direccion: direccionRef.current.value,
      idPais: idPaisRef.current.value,
      telefono: telefonoRef.current.value,
      idDirector: idDirectorRef.current.value,
      status: statusRef.current.value,
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
    async function cargarDatosSede() {
      try {
        const datosSede = await getSedeID(id);
        ciudadRef.current.value = datosSede.ciudad;
        presuRef.current.value = datosSede.fondo_Presupuestario;
        direccionRef.current.value = datosSede.direccion;
        idPaisRef.current.value = datosSede.idPais;
        telefonoRef.current.value = datosSede.telefono;
        idDirectorRef.current.value = datosSede.idDirector;
        statusRef.current.value = datosSede.status;
      } catch (error) {
        console.error(error);
      }
    }

    cargarDatosSede();
  }, [id]);

  return (
    <div className="edit-container-tipo">
      <h1 className="edit-tipo">Editar Sede</h1>
      <p className="edit-id">ID de la Sede a editar: {id}</p>
      <form onSubmit={handleRegistro} className="form">
      <div className='div-input-tipo'>
          <label htmlFor="sede" className="label-input">Confirme id sede a editar:</label>
          <input
            type="text"
            id="sede"
            ref={sedeIDRef}
            required
            className="input"
          />
        </div>
       <div className='div-input-tipo'>
          <label htmlFor="ciudad" className="label-input">Ciudad:</label>
          <input
            type="text"
            id="ciudad"
            ref={ciudadRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="fondo" className="label-input">Presupuesto:</label>
          <input
            type="text"
            id="ciudad"
            ref={presuRef}
            required
            className="input"
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="direccion" className="label-input">Dirección:</label>
          <input
            type="text"
            id="direccion"
            ref={direccionRef}
            required
            className="input"
          />
        </div>

        <div className='div-input-tipo'>
            <label htmlFor="idPais">País:</label>
            <select id="idPais" ref={idPaisRef} className="select" required>
              {paises.map((pais) => (
                <option key={pais.idPais} value={pais.idPais}  className="input">
                  {pais.nombre}
                </option>
              ))}
            </select>
          </div>

        <div className='div-input-tipo'>
          <label htmlFor="telefono" className="edit-label">Teléfono:</label>
          <input
            type="text"
            id="telefono"
            ref={telefonoRef}
            required
            className="input"
          />
        </div>

        <div className='div-input-tipo'>
            <label htmlFor="idDirector" className="label-input">Director:</label>
            <select id="idDirector" ref={idDirectorRef} className="select" required>
              {directores.map((director) => (
                <option key={director.idDirector} value={director.idDirector} className="input">
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

export default EditarSede;
