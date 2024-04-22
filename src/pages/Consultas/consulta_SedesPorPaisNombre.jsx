import { useState } from "react";
import { useQuery } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import { getConsultaCSP } from "../../services/ConsultasServicio";
import ReactPaginate from "react-paginate";


const ListaConsultaCSPN = () => {
  const { data, isLoading, isError } = useQuery("consulta", getConsultaCSP, {
    enabled: true,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page when the search term changes
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  // Filter data based on the search term
  const filteredData = (data || []).filter((consultaCSPN) =>
    consultaCSPN.nombrePais &&
    consultaCSPN.nombrePais.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Consultas sedes por país nombre</h1>
        <div>
          {/* Agregar el input para la búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre de país"
            className="label-input" 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {/* Mostrar la tabla y el encabezado incluso antes de la búsqueda */}
        <div className="Div-Table">
          <table className="Table">
            <thead>
              <tr>
                <th>Nombre Pais</th>
                <th>Cantidad de sedes</th>
              </tr>
            </thead>
            <tbody>
              {/* Mostrar los datos de la tabla solo si hay una búsqueda */}
              {searchTerm &&
                currentData.map((consultaCSPN) => (
                  <tr key={consultaCSPN.nombrePais}>
                    <td>{consultaCSPN.nombrePais}</td>
                    <td>{consultaCSPN.cantidadSedes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {searchTerm && (
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      )}
    </>
  );
};

export default ListaConsultaCSPN;