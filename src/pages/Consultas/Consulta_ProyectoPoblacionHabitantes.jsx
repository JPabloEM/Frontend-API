import { useState } from "react";
import { useQuery } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import { getConsultaPPH } from "../../services/ConsultasServicio";
import ReactPaginate from "react-paginate";


const ListaConsultaPPH = () => {
  const { data, isLoading, isError} = useQuery("consulta", getConsultaPPH, {
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
        <h1 className="Namelist">Consultas Proyectos-Poblacion-habitantes</h1>
        <div className="Div-Table">
          <table className="Table">
            <thead>
              <tr>
                {/* <th>ID Proyecto</th> */}
                <th>Titulo Proyecto</th>
                {/* <th>ID Poblacion</th> */}
                <th>Nombre Poblacion</th>
                <th>Cantidad Habitantes</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((consultaPPH) => (
                <tr key={consultaPPH.idProyecto}>
                  {/* <td>{consultaPPH.idProyecto}</td> */}
                  <td>{consultaPPH.tituloProyecto}</td>
                  {/* <td>{consultaPPH.idPoblacion}</td> */}
                  <td>{consultaPPH.nombrePoblacion}</td>
                  <td>{consultaPPH.cantidadHabitantes}</td>
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

export default ListaConsultaPPH;
