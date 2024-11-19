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

import { Pagination } from "../hooks/PaginationHook"
import { addDatasets } from "../store/DatasetSlice"
import { store } from "../store/Store"
import { getDatasets } from "./DatasetApi"

export const fetchDatasets = async (pagination?: Pagination) => {
  const apiResponse = await getDatasets(pagination)

  store.dispatch(addDatasets(apiResponse.data))
}
