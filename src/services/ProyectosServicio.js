import api from "../api/config";


export const getProyecto = async () => { 
    let data = await api.get('Proyecto').then(result => result.data);
    return data;
};

export const eliminarProyecto= async (id) => {
    try {
        const response = await api.delete(`Proyecto/Eliminar/${id}`);
        console.log(response.data);
    } catch (error) {
    
        console.error(error);
    } 
};


export const createProyecto = async (sede) => { 
    let data = await api.post('/Proyecto/Insertar', sede).then(result => result.data);
    return data;
};


export const getProyectoID = async (id) => { 
    let data = await api.get(`Proyecto/${id}`).then(result => result.data);
    return data;
};

export const updateProyecto = async (newData) => { 
    
    console.log(newData);    
    // En este punto, `newData` debe ser un objeto con los datos de la reserva  a actualizar
    let data = await api.put(`/Proyecto/Actualizar/${newData.id}`, newData).then(result => result.data);
    return data;
};
