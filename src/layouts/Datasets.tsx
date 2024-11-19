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

import { Download, InfoRounded, PlayArrow } from "@mui/icons-material"
import { FC, useEffect } from "react"
import "../styles/Datasets.css"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import PageableTable, { Column } from "../components/table/PageableTable"
import { usePagination } from "../hooks/PaginationHook"
import { Dataset } from "../models/Dataset"
import { downloadDataset } from "../services/DatasetApi"
import { fetchDatasets } from "../services/DatasetService"
import { RootState } from "../store/Store"

export const Datasets: FC = () => {
  const datasets = useSelector((state: RootState) => state.datasetsState.datasets)
  const pagination = usePagination({size: 5})
  const navigate = useNavigate()

  const columns: Column[] = [
    {
      header: "ID",
      accessor: "id"
    },
    {
      header: "Name",
      accessor: "name"
    },
    {
      header: "Description",
      accessor: "description"
    },
    {
      header: "Owner ID",
      accessor: "ownerId"
    },
    {
      header: "Created",
      accessor: "creationDate",
      renderer: (value: string) => new Date(value).toLocaleString()
    },
    {
      header: "Modified",
      accessor: "modificationDate",
      renderer: (value: string) => new Date(value).toLocaleString()
    },
    {
      header: "",
      accessor: "",
      renderer: (value, row: Dataset, rowIndex: number) => rowActionsRenderer(value, row, rowIndex)
    }
  ]

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
