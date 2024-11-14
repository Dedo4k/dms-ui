export interface ApiResponse<T> {
  data: T
}

export interface Page{
  size: number
  totalElements: number
  totalPages: number
  number: number
}
