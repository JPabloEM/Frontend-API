import api from "../api/config";


export const getActuacion = async () => { 
    let data = await api.get('Actuacion').then(result => result.data);
    return data;
};

export const eliminarActuacion= async (id) => {
    try {
        const response = await api.delete(`Actuacion/${id}`);
        console.log(response.data);
    } catch (error) {
    
        console.error(error);
    } 
};


export const createActuacion = async (actuacion) => { 
    let data = await api.post('/Actuacion', actuacion).then(result => result.data);
    return data;
};


export const getActuacionID = async (id) => { 
    let data = await api.get(`Actuacion/${id}`).then(result => result.data);
    return data;
};

export const updateActuacion = async (newData) => { 
    
    console.log(newData);    
    // En este punto, `newData` debe ser un objeto con los datos de la reserva  a actualizar
    let data = await api.put(`/Actuacion/${newData.id}`, newData).then(result => result.data);
    return data;
};
