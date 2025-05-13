"use client"

import { Canvas } from "@react-three/fiber"
import Experience from "./_components/Experience"
import { useControls } from "leva"

export default function Home() {
  const {bgColor} = useControls({
    bgColor: "#56d2ff"
  })

  console.log(bgColor)
  return (
    <main className="w-full h-screen">
      <Canvas
        camera={{
          position: [0, 0, 2],
          near: 0.5,
          far: 20,
        }}
      >
        
        <color attach="background" args={[bgColor]} />
        <Experience />
      </Canvas>

      {/* Instrucciones para el usuario */}
      <div className="fixed bottom-4 left-4 text-white/70 text-sm bg-black/30 p-3 rounded-lg backdrop-blur-sm">
        <p>🖱️ Rueda del ratón: Zoom in/out</p>
        <p>🖱️ Arrastrar: Mover vista</p>
      </div>
    </main>
  )
}
