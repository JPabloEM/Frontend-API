import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7293/api/Authentication/login', {
        username: username,
        password: password,
      });

      // Almacenar el token en localStorage
      localStorage.setItem('token', response.data);

      // Mostrar notificación de inicio de sesión exitoso
      toast.success('Inicio de sesión exitoso');

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      // Mostrar notificación de credenciales incorrectas
      toast.error('Usuario o contraseña incorrectos');
    }
  };

  useEffect(() => {
    // Configurar un temporizador para eliminar el token después de 15 minutos
    const tokenTimeout = setTimeout(() => {
      // Eliminar el token del localStorage
      localStorage.removeItem('token');
      // Mostrar notificación de cierre de sesión automático
      toast.info('La sesión ha expirado automáticamente');
    }, 15 * 60 * 1000); // 15 minutos en milisegundos

    // Limpiar el temporizador cuando el componente se desmonta o cuando se vuelve a llamar a useEffect
    return () => clearTimeout(tokenTimeout);
  }, []); // El segundo parámetro vacío significa que este efecto solo se ejecuta una vez al montar el componente

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className='div-input-tipo'>
          <label>
            Usuario:
            <input
              type="text"
              value={username}
              className="input"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <br />
        <div className='div-input-tipo'>
          <label>
            Contraseña:
            <input
              type="password"
              value={password}
              className="input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <br />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
