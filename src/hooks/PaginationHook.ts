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

import { useState } from "react"


export interface PaginationState {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export interface Pagination extends PaginationState {
  setSize: (size: number) => void
  setTotalElements: (size: number) => void
  setTotalPages: (size: number) => void
  setNumber: (size: number) => void
  setPagination: (pagination: PaginationState) => void
}

const initialState: PaginationState = {
  size: 10,
  totalElements: 0,
  totalPages: 0,
  number: 0
}

export const usePagination = (pagination: {
  size?: number,
  totalElements?: number,
  totalPages?: number,
  number?: number
}): Pagination => {
  const [size, setSize] = useState(pagination.size || initialState.size)
  const [totalElements, setTotalElements] = useState(pagination.totalElements || initialState.totalElements)
  const [totalPages, setTotalPages] = useState(pagination.totalPages || initialState.totalPages)
  const [number, setNumber] = useState(pagination.number || initialState.number)

  const setPagination = (pagination: PaginationState) => {
    setSize(pagination.size)
    setTotalElements(pagination.totalElements)
    setTotalPages(pagination.totalPages)
    setNumber(pagination.number)
  }

  return {
    size,
    totalElements,
    totalPages,
    number,
    setSize,
    setTotalElements,
    setTotalPages,
    setNumber,
    setPagination
  }
}
