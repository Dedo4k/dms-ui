import React, {FC, ReactNode, useEffect, useState} from "react";
import '../styles/PageableTable.css';
import {Page} from "../types/types";
import {useDispatch} from "react-redux";
import {setPageNumber, setPageSize} from "../store/DatasetSlice";
import {ChevronLeft, ChevronRight, FirstPageRounded, LastPageRounded} from "@mui/icons-material";

export interface Column {
  header: string
  accessor: string
  renderer?: (value: any, row: any, rowIndex: number) => ReactNode
}

interface PageableTableProps {
  data: any[]
  columns: Column[]
  page: Page
  fetch: () => void
  onRowClick?: (row: any, rowIndex: number) => void
  onRowDoubleClick?: (row: any, rowIndex: number) => void
}

const PageableTable: FC<PageableTableProps> = (props: PageableTableProps) => {
  const dispatch = useDispatch();
  const {columns, data, page, fetch, onRowClick, onRowDoubleClick} = props;
  const [size, setSize] = useState(page.size);

  useEffect(() => {
    setSize(page.size)
  }, [page.size]);

  const handleNextPage = () => {
    dispatch(setPageNumber(page.number + 1))
    fetch()
  }

  const handlePrevPage = () => {
    dispatch(setPageNumber(page.number - 1))
    fetch()
  }

  const handleFirstPage = () => {
    dispatch(setPageNumber(0))
    fetch()
  }

  const handleLastPage = () => {
    dispatch(setPageNumber(page.totalPages - 1))
    fetch()
  }

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number.parseInt(event.currentTarget.value);

    setSize(value)
  }

  const applySizeChange = (event: React.FocusEvent<HTMLInputElement>) => {
    let value = Number.parseInt(event.currentTarget.value);

    if (value < 1) {
      value = 1
    }

    setSize(value)
    dispatch(setPageSize(value))

    fetch()
  }

  return <>
    <div className={"pageable-table-container"}>
      {
        page &&
          <div className={"pageable-header"}>
              <div className={"size-controls"}>
                  <div>Show</div>
                  <input className={"page-size"} type="number" value={size} min={1}
                         onChange={handleSizeChange}
                         onBlur={applySizeChange}/>
                  <div>entries</div>
              </div>
              <div className="pageable-controls">
                  <button className={"page-btn"} onClick={handleFirstPage} disabled={page.number <= 0}>
                      <FirstPageRounded fontSize={"medium"}/>
                  </button>
                  <button className={"page-btn"} onClick={handlePrevPage} disabled={page.number <= 0}>
                      <ChevronLeft/>
                  </button>
                  <div className={"pages"}>{page.number + 1} of {page.totalPages}</div>
                  <button className={"page-btn"} onClick={handleNextPage} disabled={page.number >= page.totalPages - 1}>
                      <ChevronRight/>
                  </button>
                  <button className={"page-btn"} onClick={handleLastPage} disabled={page.number >= page.totalPages - 1}>
                      <LastPageRounded/>
                  </button>
              </div>
          </div>
      }
      <div className={"pageable-table"}>
        <table>
          <thead className={"pageable-table-head"}>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
          </tr>
          </thead>
          <tbody className={"pageable-table-body"}>
          {
            data.map((row, rowIndex) => (
              <tr key={rowIndex}
                  onClick={() => onRowClick ? onRowClick(row, rowIndex) : null}
                  onDoubleClick={() => onRowDoubleClick ? onRowDoubleClick(row, rowIndex) : null}>
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}>{col.renderer ? col.renderer(row[col.accessor], row, rowIndex) : row[col.accessor]}</td>
                ))}
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
      <div className="pageable-footer">
        <div className={"showing-entries"}>Showing {data.length}-{page.size} of {page.totalElements} entries</div>
      </div>
    </div>
  </>
}

export default PageableTable
