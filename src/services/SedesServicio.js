import api from "../api/config";


export const getSedes = async () => { 
    let data = await api.get('Sede').then(result => result.data);
    return data;
};

export const eliminarSede= async (id) => {
    try {
        const response = await api.delete(`Sede/${id}`);
        console.log(response.data);
    } catch (error) {
    
        console.error(error);
    } 
};


export const createSede = async (sede) => { 
    let data = await api.post('/Sede', sede).then(result => result.data);
    return data;
};


export const getSedeID = async (id) => { 
    let data = await api.get(`Sede/${id}`).then(result => result.data);
    return data;
};

export const updateSede = async (newData) => { 
    
    console.log(newData);    
    // En este punto, `newData` debe ser un objeto con los datos de la reserva  a actualizar
    let data = await api.put(`/Sede/${newData.id}`, newData).then(result => result.data);
    return data;
};
