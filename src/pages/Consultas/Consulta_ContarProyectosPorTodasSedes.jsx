import { useState } from "react";
import { useQuery } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import { getConsultaCPS } from "../../services/ConsultasServicio";
import ReactPaginate from "react-paginate";


const ListaConsultaCPS = () => {
  const { data, isLoading, isError} = useQuery("consulta", getConsultaCPS, {
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
        <h1 className="Namelist">Contar proyectos por sedes</h1>
        <div className="Div-Table">
          <table className="Table">
            <thead>
              <tr>
                <th>Nombre sede</th>
                <th>Cantidad de proyectos</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((consultaCPP) => (
                <tr key={consultaCPP.ciudadSede}>
                  <td>{consultaCPP.ciudadSede}</td>
                  <td>{consultaCPP.cantidadProyectos}</td>
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

export default ListaConsultaCPS;
