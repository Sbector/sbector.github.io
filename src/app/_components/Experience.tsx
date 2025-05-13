
import { MapControls, useHelper } from "@react-three/drei"
import { useRef } from "react"
import { Perf } from "r3f-perf"
import Timeline from "./Timeline"
import * as THREE from "three"

export default function Experience() {
  // Definir la ruta de la imagen que se usará para todos los items por ahora
  const imagePath = "/textures/Ice002_1K-JPG/Ice002_1K-JPG_Color.jpg"

  // Crear referencia para luz direccional
  const directionalLight = useRef<THREE.DirectionalLight>(null)
  useHelper(directionalLight as React.RefObject<THREE.Object3D>, THREE.DirectionalLightHelper, 1)


  return (
    <>
      {/* Monitoreo */}
      <Perf position="top-left"/>
      {/* Iluminación para resaltar la textura */}
      <ambientLight intensity={0.5} />
      <directionalLight ref={directionalLight} position={[0, 2, 5]} intensity={2.5} />

      {/* MapControls para zoom y paneo intuitivos */}
      <MapControls
        makeDefault
        enableRotate={false}
        enableDamping={true}
        dampingFactor={0.1}
        minDistance={1}
        maxDistance={15}
        screenSpacePanning={true}
      />

      {/* Líneas de tiempo - Reducimos la separación vertical entre líneas */}
      <Timeline></Timeline>
    </>
  )
}