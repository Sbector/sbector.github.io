"use client"

import { MapControls } from "@react-three/drei"
import { useMemo } from "react"
import Timeline from "./_Timeline"

export default function Experience() {
  // Definir la ruta de la imagen que se usará para todos los items por ahora
  const imagePath = "/textures/Ice002_1K-JPG/Ice002_1K-JPG_Color.jpg"

  const obrasLineaPrincipal = useMemo(() => {
    return [
      { id: 1, title: "Obra Uno", year: "2013", image: imagePath },
      { id: 2, title: "Obra Dos", year: "2013", image: imagePath },
      { id: 3, title: "Obra Tres", year: "2014", image: imagePath },
      { id: 4, title: "Obra Cuatro", year: "2015", image: imagePath },
      { id: 5, title: "Obra Cinco", year: "2016", image: imagePath },
      { id: 6, title: "Obra Seis", year: "2017", image: imagePath },
      { id: 7, title: "Obra Siete", year: "2020", image: imagePath },
      { id: 8, title: "Obra Ocho", year: "2021", image: imagePath },
    ]
  }, [])

  const obrasLineaSecundaria = useMemo(() => {
    return [
      { id: 101, title: "Obra Uno", year: "2020", image: imagePath },
      { id: 102, title: "Obra Dos con título muy largo que debería truncarse", year: "2021", image: imagePath },
      { id: 103, title: "Obra Tres", year: "2022", image: imagePath },
      { id: 104, title: "Obra Cuatro", year: "2023", image: imagePath },
    ]
  }, [])

  // Calcular el mapa de años a posiciones X después de que se calculen los anchos
  const yearToOffsetXMap = useMemo(() => {
    // Este cálculo se hará en el componente Timeline ahora
    // Aquí solo proporcionamos un valor aproximado para la alineación inicial
    return new Map([["2020", 6.5]])
  }, [])

  return (
    <>
      {/* Iluminación para resaltar la textura */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#a0f0ff" />

      {/* MapControls para zoom y paneo intuitivos */}
      <MapControls
        enableRotate={false}
        enableDamping={true}
        dampingFactor={0.1}
        minDistance={2}
        maxDistance={15}
        screenSpacePanning={true}
      />

      {/* Líneas de tiempo - Reducimos la separación vertical entre líneas */}
      <Timeline items={obrasLineaPrincipal} y={0} color="#ffffff" />
      <Timeline items={obrasLineaSecundaria} y={1.2} color="#a0ffff" offsetX={yearToOffsetXMap.get("2020") ?? 0} />
    </>
  )
}
