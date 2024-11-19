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

import { store } from "../store/Store"

export const downloadResorce = (url: string) => {
  const user = store.getState().authState.user

  if (!user) {
    return
  }

  const headers = new Headers()
  headers.append("X-User-Id", user.id.toString())

  let filename: string | undefined = ""

  fetch(url, {headers: headers})
    .then(response => {
      if (!response.ok) {
        throw new Error(`Bad request. Status code ${response.status}`)
      }

      const contentDisposition = response.headers.get("Content-Disposition")

      if (!contentDisposition) {
        throw new Error("Content-Disposition header was not provided")
      }

      const match = contentDisposition.match(/filename="(.+?)"/)

      if (match && match[1]) {
        filename = match[1]
      }

      return {
        filename: filename,
        blob: response.blob()
      }
    })
    .catch(error => console.error("Error downloading resource:", error))
}
