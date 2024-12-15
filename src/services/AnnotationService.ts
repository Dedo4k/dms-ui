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


import { v1 as uuidv1 } from "uuid"
import { Layout, LayoutObject, Object } from "../models/Annotation"

export const XmlToLayout = async (data: Blob): Promise<Layout> => {
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
                                          id: uuidv1(),
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

export const LayoutToXml = (layout: Layout): string => {
  const doc = document.implementation.createDocument(null, "annotation")
  const root = doc.documentElement

  const createElement = (name: string, text?: string) => {
    const elem = doc.createElement(name)
    if (text) elem.textContent = text
    return elem
  }

  const size = createElement("size")
  size.appendChild(createElement("width", layout.size.width.toString()))
  size.appendChild(createElement("height", layout.size.height.toString()))
  size.appendChild(createElement("depth", layout.size.depth.toString()))
  root.appendChild(size)

  layout.objects.forEach((obj) => {
    const objectNode = createElement("object")
    objectNode.appendChild(createElement("name", obj.name))
    objectNode.appendChild(createElement("pose", obj.pose || "Unspecified"))
    objectNode.appendChild(createElement("truncated", obj.truncated?.toString() || "0"))
    objectNode.appendChild(createElement("difficult", obj.difficult?.toString() || "0"))

    if (obj.layout.type === "bndbox") {
      const bndbox = createElement("bndbox")
      bndbox.appendChild(createElement("xmin", obj.layout.xmin.toString()))
      bndbox.appendChild(createElement("ymin", obj.layout.ymin.toString()))
      bndbox.appendChild(createElement("xmax", obj.layout.xmax.toString()))
      bndbox.appendChild(createElement("ymax", obj.layout.ymax.toString()))
      objectNode.appendChild(bndbox)
    } else if (obj.layout.type === "polygon") {
      const polygon = createElement("polygon")
      obj.layout.points.forEach((point) => {
        const pointNode = createElement("point")
        pointNode.appendChild(createElement("x", point.x.toString()))
        pointNode.appendChild(createElement("y", point.y.toString()))
        polygon.appendChild(pointNode)
      })
      objectNode.appendChild(polygon)
    }

    root.appendChild(objectNode)
  })

  const serializer = new XMLSerializer()

  return serializer.serializeToString(doc)
}
