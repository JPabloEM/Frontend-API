import api from "../api/config";


export const getPoblacion = async () => { 
    let data = await api.get('Poblacion').then(result => result.data);
    return data;
};

export const eliminarPoblacion= async (id) => {
    try {
        const response = await api.delete(`Poblacion/${id}`);
        console.log(response.data);
    } catch (error) {
    
        console.error(error);
    } 
};


export const createPoblacion = async (sede) => { 
    let data = await api.post('/Poblacion', sede).then(result => result.data);
    return data;
};


export const getPoblacionID = async (id) => { 
    let data = await api.get(`Poblacion/${id}`).then(result => result.data);
    return data;
};

export const updatePoblacion = async (newData) => { 
    
    console.log(newData);    
    // En este punto, `newData` debe ser un objeto con los datos de la reserva  a actualizar
    let data = await api.put(`/Poblacion/${newData.id}`, newData).then(result => result.data);
    return data;
};
