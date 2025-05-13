import { useTexture } from "@react-three/drei"

export default function Timeline() {
  const texture = useTexture("/textures/Ice002_1K-JPG/Ice002_1K-JPG_Color.jpg")
  console.log(texture)

  return (
    <>
      <mesh>
        <planeGeometry args={[1, 1, 1]} />
        <shaderMaterial />
      </mesh>
    </>
  )
}
