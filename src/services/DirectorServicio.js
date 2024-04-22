import api from "../api/config";

export const getDirector = async () => {
  try {
    const response = await api.get('Director');
    return response.data;
  } catch (error) {
    console.error("Error al obtener directores:", error);
    throw error; // Lanzar una excepción para manejar el error en el componente
  }
};


export const eliminarDirector = async (id) => {
    try {
      const response = await api.delete(`Director/${id}`);
      console.log(`Director con ID ${id} eliminado correctamente. Respuesta del servidor:`, response.data);
  
      // Puedes devolver la respuesta si es necesario
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el director con ID ${id}:`, error);
  
      // Verifica si hay una respuesta del servidor y si hay un mensaje de error en la respuesta
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(`Error al eliminar el director: ${error.response.data.message}`);
      } else {
        // Si no hay una respuesta del servidor o un mensaje de error, lanzar la excepción original
        throw error;
      }
    }
  };
// export const eliminarDirector= async (id) => {
//     try {
//         const response = await api.delete(`Director/${id}`);
//         console.log(response.data);
//     } catch (error) {
    
//         console.error(error);
//     } 
// };

export const createDirector = async (director) => {
  try {
    const response = await api.post('/Director', director);
    return response.data;
  } catch (error) {
    console.error("Error al crear director:", error);
    throw error; // Lanzar una excepción para manejar el error en el componente
  }
};

export const getDirectorID = async (id) => { 
  let data = await api.get(`Director/${id}`).then(result => result.data);
  return data;
};

export const updateDirector = async (newData) => { 
  
  console.log(newData);    
  // En este punto, `newData` debe ser un objeto con los datos de la reserva  a actualizar
  let data = await api.put(`/Director/${newData.id}`, newData).then(result => result.data);
  return data;
};
