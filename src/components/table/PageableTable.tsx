/*
 * Copyright (c) 2024 Uladzislau Lailo.
 *
 * All rights reserved.
 *
 * This source code, and any associated documentation, is the intellectual property of Uladzislau Lailo.
 * Unauthorized copying, modification, distribution, or any form of reuse of this code, in whole or in part,
 * without explicit permission from the copyright holder is strictly prohibited, except where explicitly permitted
 * under applicable open-source licenses (if any).
 *
 * Licensed use:
 * If the code is provided under an open-source license, you must follow the terms of that license, which can be found in the LICENSE file.
 * For any permissions not covered by the license or any inquiries about usage, please contact: [lailo.vlad@gmail.com]
 */

import { ChevronLeft, ChevronRight, FirstPageRounded, LastPageRounded } from "@mui/icons-material"
import React, { FC, ReactNode, useEffect, useState } from "react"
import "../../styles/PageableTable.css"
import { Pagination } from "../../hooks/PaginationHook"

export interface Column {
  header: string
  accessor: string
  renderer?: (value: any, row: any, rowIndex: number) => ReactNode
}

interface PageableTableProps {
  data: any[]
  columns: Column[]
  page: Pagination
  onRowClick?: (row: any, rowIndex: number) => void
  onRowDoubleClick?: (row: any, rowIndex: number) => void
}

const PageableTable: FC<PageableTableProps> = (props: PageableTableProps) => {
  const {
    columns,
    data,
    page,
    onRowClick,
    onRowDoubleClick
  } = props
  const [size, setSize] = useState(page.size)

  useEffect(() => {
    setSize(page.size)
  }, [page.size])

  const handleNextPage = () => {
    page.setNumber(page.number + 1)
  }

  const handlePrevPage = () => {
    page.setNumber(page.number - 1)
  }

  const handleFirstPage = () => {
    page.setNumber(0)
  }

  const handleLastPage = () => {
    page.setNumber(page.totalPages - 1)
  }

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number.parseInt(event.currentTarget.value)

    setSize(value)
  }

  const applySizeChange = (event: React.FocusEvent<HTMLInputElement>) => {
    let value = Number.parseInt(event.currentTarget.value)

    if (!value || value < 1) {
      value = 1
    }

    setSize(value)
    page.setSize(value)
    page.setNumber(0)
  }

  const handleOnRowClick = (row: any, rowIndex: number, e: React.MouseEvent<HTMLTableRowElement>) => {
    e.stopPropagation()

    onRowClick && onRowClick(row, rowIndex)
  }

  const handleOnRowDoubleClick = (row: any, rowIndex: number, e: React.MouseEvent<HTMLTableRowElement>) => {
    e.stopPropagation()

    onRowDoubleClick && onRowDoubleClick(row, rowIndex)
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
                  onClick={(e) => handleOnRowClick(row, rowIndex, e)}
                  onDoubleClick={(e) => handleOnRowDoubleClick(row, rowIndex, e)}>
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}>{col.renderer ? col.renderer(
                    row[col.accessor],
                    row,
                    rowIndex
                  ) : row[col.accessor]}</td>
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
