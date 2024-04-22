import api from "../api/config";


export const getPais = async () => { 
    let data = await api.get('Pais').then(result => result.data);
    return data;
};

export const createPais = async (pais) => { 
    let data = await api.post('/Pais', pais).then(result => result.data);
    return data;
};


export const eliminarPais= async (id) => {
    try {
        const response = await api.delete(`Pais/${id}`);
        console.log(response.data);
    } catch (error) {
    
        console.error(error);
    } 
};

// export const getPaisID = async (id) => { 
//     let data = await api.get(`Pais/${id}`).then(result => result.data);
//     return data;
// };

export const getPaisID = async (id) => {
    try {
        const response = await api.get(`Pais/${id}`);
        console.log("Respuesta completa del servicio:", response);
        return response.data;
        } catch (error) {
        console.error(`Error al obtener datos del país con ID ${id}:`, error);
        throw error;
        }
    };


export const updatePais = async (newData) => { 
    
    console.log(newData);    
    // En este punto, `newData` debe ser un objeto con los datos de la reserva  a actualizar
    let data = await api.put(`/Pais/${newData.id}`, newData).then(result => result.data);
    return data;
};

