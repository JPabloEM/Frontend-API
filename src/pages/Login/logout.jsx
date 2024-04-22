import { toast } from 'react-toastify';

const Logout = () => {
  const handleLogout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');

    // Mostrar notificación de cierre de sesión
    toast.info('Has cerrado sesión');


    setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    // Puedes redirigir al usuario a la página de inicio de sesión o realizar otras acciones necesarias
     window.location.href = '/login';
  };

  return (
    <button onClick={handleLogout}>Cerrar Sesión</button>
  );
};

export default Logout;
