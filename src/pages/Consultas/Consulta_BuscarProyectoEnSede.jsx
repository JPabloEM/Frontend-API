import { useState } from "react";
import { useQuery } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import { getConsultaBPS } from "../../services/ConsultasServicio";
import ReactPaginate from "react-paginate";


const ListaConsultaBPS = () => {
  const { data, isLoading, isError} = useQuery("consulta", getConsultaBPS, {
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
        <h1 className="Namelist">Buscar Proyectos en sedes</h1>
        <div className="Div-Table">
          <table className="Table">
            <thead>
              <tr>
                <th>Nombre sede</th>
                <th>Direccion</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((consultaCPP) => (
                <tr key={consultaCPP.sede}>
                  <td>{consultaCPP.sede}</td>
                  <td>{consultaCPP.direccion}</td>
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

export default ListaConsultaBPS;
