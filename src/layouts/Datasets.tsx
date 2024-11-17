import {FC, useEffect} from "react";
import "../styles/Datasets.css";
import {useSelector} from "react-redux";
import {RootState} from "../store/Store";
import PageableTable, {Column} from "../components/PageableTable";
import {Link, useNavigate} from "react-router-dom";
import {Dataset} from "../models/Dataset";
import {Download, InfoRounded, PlayArrow} from "@mui/icons-material";
import {fetchDatasets} from "../services/DatasetService";
import {downloadDataset} from "../services/DatasetApi";
import {usePagination} from "../hooks/PaginationHook";

export const Datasets: FC = () => {
  const datasets = useSelector((state: RootState) => state.datasetsState.datasets);
  const pagination = usePagination({size: 5})
  const navigate = useNavigate()

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
    fetchDatasets(pagination)
  }, [pagination.number, pagination.size])

  const handleRowDoubleClick = (row: Dataset, rowIndex: number) => {
    navigate(row.id.toString())
  }

  const rowActionsRenderer = (value: any, row: Dataset, rowIndex: number) => {
    return <>
      <div className={"action-cell"}>
        <Link to={`/editor/${row.id}`} title={"Go to editor"}>
          <PlayArrow fontSize={"medium"}/>
        </Link>
        <div title={"Download"} onClick={() => downloadDataset(row.id)}>
          <Download fontSize={"medium"}/>
        </div>
        <Link to={row.id.toString()}>
          <InfoRounded fontSize={"medium"}/>
        </Link>
      </div>
    </>
  }

  return <>
    <div className={"datasets"}>
      <div className={"table-container"}>
        <PageableTable data={datasets} columns={columns} page={pagination}
                       onRowDoubleClick={handleRowDoubleClick}/>
      </div>
    </div>
  </>
}
