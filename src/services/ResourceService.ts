import {store} from "../store/Store";

export const downloadResorce = (url: string) => {
  const user = store.getState().authState.user

  if (!user) {
    return
  }

  const headers = new Headers();
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

      const match = contentDisposition.match(/filename="(.+?)"/);

      if (match && match[1]) {
        filename = match[1]
      }

      return {
        filename: filename,
        blob: response.blob()
      }
    })
    .catch(error => console.error('Error downloading resource:', error));
}
