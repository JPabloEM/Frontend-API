import { useRef } from 'react';
import { useMutation, useQueryClient } from "react-query";
import { create } from "../../services/AutenticacionServicio";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registro = () => {
  const queryClient = useQueryClient();
  const UsernameRef = useRef(null);
  const IdentificacionRef = useRef(null);
  const NombreRef = useRef(null);
  const Apellido1Ref = useRef(null);
  const Apellido2Ref = useRef(null);
  const UsuarioEmail = useRef(null);
  const UsuarioPassword = useRef(null);

  const mutation = useMutation("AuthUser", create, {
    onSettled: () => queryClient.invalidateQueries("AuthUser"),
  });

  const handleRegistro = async (e) => {
    e.preventDefault();

    const newUsuario = {
      username : UsernameRef.current.value,
      identificacion: IdentificacionRef.current.value,
      nombre: NombreRef.current.value,
      apellido1: Apellido1Ref.current.value,
      apellido2: Apellido2Ref.current.value,
      email: UsuarioEmail.current.value,
      password: UsuarioPassword.current.value,
    };

    try {
      await mutation.mutateAsync(newUsuario);
      toast.success('¡Guardado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(`Error al crear el usuario la contraseña no es valida: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <div className="registro">
      <h2>Registro</h2>
      <form onSubmit={handleRegistro}>
        <div className='div-input-tipo'>
          <label htmlFor="nombre">Username:</label>
          <input
            type="text"
            id="nombre"
            ref={UsernameRef}
            className="input"
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="primerApellido">Identificacion:</label>
          <input
            type="text"
            id="primerApellido"
            ref={IdentificacionRef}
            className="input"
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="primerApellido">Nombre:</label>
          <input
            type="text"
            id="primerApellido"
            ref={NombreRef}
            className="input"
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="segundoApellido">Primer Apellido:</label>
          <input
            type="text"
            id="segundoApellido"
            ref={Apellido1Ref}
            className="input"
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="cedula">Segundo Apellido:</label>
          <input
            type="text"
            id="cedula"
            ref={Apellido2Ref}
            className="input"
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="correo">Correo:</label>
          <input
            type="email"
            id="correo"
            placeholder='ejemplo@gmail.com'
            ref={UsuarioEmail}
            className="input"
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="contrasena">Contraseña:</label>
          <input
            type="password"
            id="contrasena"
            placeholder='Ingrese su contraseña'
            ref={UsuarioPassword}
            className="input"
            required
          />
        </div>
        <div className="center-button">
            <button type="submit">Registrarse</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Registro;
