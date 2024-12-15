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

import { useEffect, useState } from "react"
import { uploadAnnotation } from "../services/DatasetApi"

export interface UploadAnnotation {
  file: string
  datasetId: number
  groupId: number
  fileId: number
  status?: UploadStatus
}

type UploadStatus = "pending" | "uploading" | "uploaded" | "error"

export const useAsyncAnnotationsUploader = () => {
  const [annotations, setAnnotations] = useState<UploadAnnotation[]>([])
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    uploadAnnotations()
  }, [annotations.length])

  const setStatus = (annotation: UploadAnnotation, status: UploadStatus) => {
    setAnnotations((prevState) => prevState.map(a => a === annotation ? {
      ...a,
      status: status
    } : a))
  }

  const uploadAnnotations = async () => {
    // setIsUploading(true)
    while (annotations.some(annotation => annotation.status === "pending")) {
      const nextAnnotation = annotations.find((annotation) => annotation.status === "pending")
      if (nextAnnotation) {
        await upload(nextAnnotation)
      }
    }
    // setIsUploading(false)
  }

  const upload = async (annotation: UploadAnnotation) => {
    setStatus(annotation, "uploading")

    uploadAnnotation(annotation.datasetId, annotation.groupId, annotation.fileId, annotation.file)
      .then(() => setStatus(annotation, "uploaded"))
      .catch(() => setStatus(annotation, "error"))
      .finally(
        () => setAnnotations(annotations.filter(ann => ann !== annotation))
      )
  }

  const addAnnotation = (annotation: UploadAnnotation) => {
    setAnnotations([
                     ...annotations,
                     {
                       ...annotation,
                       status: "pending"
                     }
                   ])
  }

  return {
    addAnnotation
  }
}
