import { extend } from "@react-three/fiber"
import { shaderMaterial, useTexture } from "@react-three/drei"
import * as THREE from "three"

// Importa los shaders como strings
import fragmentShader from "./shaders/fragmentShader.glsl"
import vertexShader from "./shaders/vertexShader.glsl"

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#000000"),
    uColorEnd: new THREE.Color("#ff7e29"),
  },
  vertexShader,
  fragmentShader,
)

extend({ PortalMaterial })

export default function Timeline() {

  return (
    <mesh>
      <planeGeometry args={[1, 1, 1]} />
      {/* @ts-ignore */}
      <portalMaterial />
    </mesh>
  )
}
