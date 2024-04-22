import { useState } from "react";
import { useQuery } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import { getConsultaPAP } from "../../services/ConsultasServicio";
import ReactPaginate from "react-paginate";


const ListaConsultaPAP = () => {
  const { data, isLoading, isError} = useQuery("consulta", getConsultaPAP, {
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
        <h1 className="Namelist">Consultas Proyectos de actuacion en poblacion</h1>
        <div className="Div-Table">
          <table className="Table">
            <thead>
              <tr>
                {/* <th>ID Proyecto</th> */}
                <th>Titulo Proyecto</th>
                {/* <th>ID Actuacion</th> */}
                <th>Nombre Actuacion</th>
                <th>Descripcion</th>
                {/* <th>ID Poblacion</th> */}
                <th>Nombre Poblacion</th>

              </tr>
            </thead>
            <tbody>
              {currentData.map((consultaPAP) => (
                <tr key={consultaPAP.idProyecto}>
                  {/* <td>{consultaPAP.idProyecto}</td> */}
                  <td>{consultaPAP.tituloProyecto}</td>
                  {/* <td>{consultaPAP.idActuacion}</td> */}
                  <td>{consultaPAP.nombreActuacion}</td>
                  <td>{consultaPAP.descripcionActuacion}</td>
                  {/* <td>{consultaPAP.idPoblacion}</td> */}
                  <td>{consultaPAP.nombrePoblacion}</td>
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

export default ListaConsultaPAP;
