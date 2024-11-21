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

import React, { FC } from "react"
import "../styles/AnnotationView.css"
import { Annotation, Bndbox, Object, Polygon } from "../models/Annotation"

interface AnnotationsViewProps {
  annotation: Annotation | null
}

export const AnnotationsView: FC<AnnotationsViewProps> = (props: AnnotationsViewProps) => {
  const {annotation} = props

  const renderLayoutObject = (object: Object, index: number) => {
    switch (object.layout.type) {
      case "polygon":
        return renderPolygon(object.layout, index)
      case "bndbox":
        return renderBndbox(object.layout, index)
    }
  }

  const renderBndbox = (bndbox: Bndbox, index: number) => {
    return <React.Fragment key={index}>
      <div className={"bndbox"} style={{
        position: "absolute",
        top: bndbox.ymin,
        left: bndbox.xmin,
        width: bndbox.xmax - bndbox.xmin,
        height: bndbox.ymax - bndbox.ymin,
        border: "2px solid red",
        boxSizing: "border-box"
      }}>

      </div>
    </React.Fragment>
  }

  const renderPolygon = (polygon: Polygon, index: number) => {
    return <React.Fragment key={index}>
      <div id={index.toString()} className="polygon">

      </div>
    </React.Fragment>
  }

  return <>
    <div className="annotations-view">
      {
        annotation?.layout?.objects.map((object: Object, index: number) => renderLayoutObject(object, index))
      }
    </div>
  </>
}
