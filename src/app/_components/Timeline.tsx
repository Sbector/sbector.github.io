import { useRef } from "react"
import { useFrame, useThree, extend } from "@react-three/fiber"
import { shaderMaterial, useTexture } from "@react-three/drei"
import * as THREE from "three"

// Importa los shaders como strings
import fragmentShader from "./shaders/fragmentShader.glsl"
import vertexShader from "./shaders/vertexShader.glsl"


const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color('#000000'),
        uColorEnd: new THREE.Color('#ff7e29')
    },
    vertexShader,
    fragmentShader,
)

extend({ PortalMaterial })

export default function Timeline() {
  const texture = useTexture("/textures/Ice002_1K-JPG/Ice002_1K-JPG_Color.jpg")
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 1]} />
      <portalMaterial/>
    </mesh>
  )
}
