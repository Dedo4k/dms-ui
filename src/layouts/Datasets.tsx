import {FC, useEffect} from "react";
import "../styles/Datasets.css";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/Store";
import {getDatasets} from "../services/DatasetApi";
import {addDatasets} from "../store/DatasetSlice";
import PageableTable, {Column} from "../components/PageableTable";
import {Link, useNavigate} from "react-router-dom";
import {Dataset} from "../models/Dataset";
import {Download, InfoRounded} from "@mui/icons-material";

export const Datasets: FC = () => {
  const dispatch = useDispatch();
  const datasets = useSelector((state: RootState) => state.datasetsState.datasets);
  const page = useSelector((state: RootState) => state.datasetsState.page);
  const navigate = useNavigate();

  const columns: Column[] = [
    {header: "ID", accessor: "id"},
    {header: "Name", accessor: "name"},
    {header: "Description", accessor: "description"},
    {header: "Owner ID", accessor: "ownerId"},
    {header: "Created", accessor: "creationDate", renderer: (value: string) => new Date(value).toLocaleString()},
    {header: "Modified", accessor: "modificationDate", renderer: (value: string) => new Date(value).toLocaleString()},
    {
      header: "",
      accessor: "",
      renderer: (value, row: Dataset, rowIndex: number) => rowActionsRenderer(value, row, rowIndex)
    }
  ];

  useEffect(() => {
    fetchDatasets()
  }, [])

  const fetchDatasets = async () => {
    const apiResponse = await getDatasets();

    dispatch(addDatasets(apiResponse.data))
  }

  const handleRowDoubleClick = (row: Dataset, rowIndex: number) => {
    navigate(row.id.toString())
  }

  const rowActionsRenderer = (value: any, row: Dataset, rowIndex: number) => {
    return <>
      <div className={"action-cell"}>
        <Link to={row._links?.download?.href} title={"Download"} target={"_blank"}>
          <Download/>
        </Link>
        <Link to={row.id.toString()}><InfoRounded/></Link>
      </div>
    </>
  }

  return <>
    <div className={"datasets"}>
      <div className={"table-container"}>
        <PageableTable data={datasets} columns={columns} page={page} fetch={fetchDatasets}
                       onRowDoubleClick={handleRowDoubleClick}/>
      </div>
    </div>
  </>
}
