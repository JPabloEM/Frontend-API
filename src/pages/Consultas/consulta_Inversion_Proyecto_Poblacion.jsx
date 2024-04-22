import { useState } from "react";
import { useQuery } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import { getConsultaIPP } from "../../services/ConsultasServicio";
import ReactPaginate from "react-paginate";


const ListaConsultaIPP = () => {
  const { data, isLoading, isError} = useQuery("consulta", getConsultaIPP, {
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
        <h1 className="Namelist">Consultas Inversiones-Proyectos-Poblacion</h1>
        <div className="Div-Table">
          <table className="Table">
            <thead>
              <tr>
                {/* <th>ID Proyecto</th> */}
                <th>Titulo Proyecto</th>
                {/* <th>ID Poblacion</th> */}
                <th>Nombre Poblacion</th>
                <th>Inversion en poblacion</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((consultaIPP) => (
                <tr key={consultaIPP.idProyecto}>
                  {/* <td>{consultaIPP.idProyecto}</td> */}
                  <td>{consultaIPP.tituloProyecto}</td>
                  {/* <td>{consultaIPP.idPoblacion}</td> */}
                  <td>{consultaIPP.nombrePoblacion}</td>
                  <td>{consultaIPP.inversionEnPoblacion}</td>
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

export default ListaConsultaIPP;
