import api from "../api/config";

export const getPoblacionActuacion = async () => {
  try {
    const response = await api.get('Poblacion_Actuacion');
    return response.data;
  } catch (error) {
    console.error("Error al obtener directores:", error);
    throw error; // Lanzar una excepción para manejar el error en el componente
  }
};


export const eliminarPoblacionActuacion = async (id) => {
    try {
      const response = await api.delete(`Poblacion_Actuacion/${id}`);
      console.log(`Poblacion con ID ${id} eliminado correctamente. Respuesta del servidor:`, response.data);
  
      // Puedes devolver la respuesta si es necesario
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la poblacion/actuacion con ID ${id}:`, error);
  
      // Verifica si hay una respuesta del servidor y si hay un mensaje de error en la respuesta
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(`Error al eliminar la poblacion/actuacion: ${error.response.data.message}`);
      } else {
        // Si no hay una respuesta del servidor o un mensaje de error, lanzar la excepción original
        throw error;
      }
    }
  };

export const createPoblacionActuacion = async (director) => {
  try {
    const response = await api.post('/Poblacion_Actuacion', director);
    return response.data;
  } catch (error) {
    console.error("Error al crear director:", error);
    throw error; // Lanzar una excepción para manejar el error en el componente
  }
};

export const getPoblacionActuacionID = async (id) => { 
  let data = await api.get(`Poblacion_Actuacion/${id}`).then(result => result.data);
  return data;
};

export const updatePoblacionActuacion = async (newData) => { 
  
  console.log(newData);    
  // En este punto, `newData` debe ser un objeto con los datos de la reserva  a actualizar
  let data = await api.put(`/Poblacion_Actuacion/${newData.id}`, newData).then(result => result.data);
  return data;
};
