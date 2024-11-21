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


import { Layout, LayoutObject, Object } from "../models/Annotation"

export const parseLayoutFromXml = async (data: Blob): Promise<Layout> => {
  const xmlString = await data.text()

  const xml = new DOMParser().parseFromString(xmlString, "application/xml")

  const parseError = xml.querySelector("parsererror")

  if (parseError) {
    throw new Error(`Error parsing XML: ${parseError.textContent}`)
  }

  const sizeElement = xml.querySelector("size")

  const size = {
    width: parseInt(sizeElement?.querySelector("width")?.textContent || "0", 10),
    height: parseInt(sizeElement?.querySelector("height")?.textContent || "0", 10),
    depth: parseInt(sizeElement?.querySelector("depth")?.textContent || "0", 10)
  }

  const objects: Object[] = Array.from(xml.querySelectorAll("object"))
                                 .map((objectElement) => {
                                        const name = objectElement.querySelector("name")?.textContent || "unknown"
                                        const pose = objectElement.querySelector("pose")?.textContent || "unknown"
                                        const truncated = parseInt(
                                          objectElement.querySelector("truncated")?.textContent || "0",
                                          10
                                        )
                                        const difficult = parseInt(
                                          objectElement.querySelector("difficult")?.textContent || "0",
                                          10
                                        )

                                        const bndboxElement = objectElement.querySelector("bndbox")

                                        return {
                                          name,
                                          pose,
                                          truncated,
                                          difficult,
                                          layout: {
                                            type: "bndbox",
                                            xmin: parseInt(bndboxElement?.querySelector("xmin")?.textContent || "0", 10),
                                            ymin: parseInt(bndboxElement?.querySelector("ymin")?.textContent || "0", 10),
                                            xmax: parseInt(bndboxElement?.querySelector("xmax")?.textContent || "0", 10),
                                            ymax: parseInt(bndboxElement?.querySelector("ymax")?.textContent || "0", 10)
                                          } as LayoutObject
                                        }
                                      }
                                 )

  return {
    size,
    objects
  }
}
