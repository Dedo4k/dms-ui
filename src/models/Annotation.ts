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

export interface Annotation {
  imageObjectUrl?: string
  layout?: Layout
}

export interface Layout {
  size: {
    width: number
    height: number
    depth: number
  }
  objects: Object[]
}

export interface Object {
  name: string
  pose: string
  truncated: number
  difficult: number
  layout: LayoutObject
}

export interface Bndbox {
  type: "bndbox"
  xmin: number
  ymin: number
  xmax: number
  ymax: number
}

export interface Polygon {
  type: "polygon"
  points: {
    x: number,
    y: number
  }[]
}

export type LayoutObject = Bndbox | Polygon
