import { useState } from "react";
import { useQuery } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import { getConsultaInfoH } from "../../services/ConsultasServicio";
import ReactPaginate from "react-paginate";


const ListaConsultaInfoH = () => {
  const { data, isLoading, isError} = useQuery("consulta", getConsultaInfoH, {
    enabled: true,
  });


  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };


  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;


  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(length / itemsPerPage);
  const currentData = data.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Buscar Informacion de poblacion</h1>
        <div className="Div-Table">
          <table className="Table">
            <thead>
              <tr>
                <th>Nombre Poblacion</th>
                <th>Cantidad de Habitantes</th>
                <th>Pais</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((consultaCPP) => (
                <tr key={consultaCPP.nombrePoblacion}>
                  <td>{consultaCPP.nombrePoblacion}</td>
                  <td>{consultaCPP.cantidadHabitantes}</td>
                  <td>{consultaCPP.pais}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
    </>
  );
};

export default ListaConsultaInfoH;
