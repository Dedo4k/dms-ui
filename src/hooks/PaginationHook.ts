import {useState} from "react";


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
