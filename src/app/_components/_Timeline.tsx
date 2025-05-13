"use client"

import { Html, useTexture } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useMemo } from "react"

type Item = {
  id: number
  title: string
  year: string
  image: string
}

// Reducimos la altura a un valor más conservador
const CARD_HEIGHT = 0.8

export default function Timeline({
  items,
  y = 0,
  color = "white",
  offsetX = 0,
}: {
  items: Item[]
  y?: number
  color?: string
  offsetX?: number
}) {
  const { size } = useThree()

  // Cargar todas las texturas de la lista de items
  const textures = useTexture(
    items.reduce(
      (acc, item) => {
        acc[item.id] = item.image
        return acc
      },
      {} as Record<number, string>,
    ),
  )

  // Calcular anchos basados en la proporción de aspecto de las imágenes
  const itemsWithWidth = useMemo(() => {
    return items.map((item) => {
      const texture = textures[item.id]
      // Si la textura está cargada, calcular el ancho basado en la proporción de aspecto
      let width = CARD_HEIGHT // Valor predeterminado

      if (texture && texture.image) {
        const aspectRatio = texture.image.width / texture.image.height
        width = CARD_HEIGHT * aspectRatio
      }

      return {
        ...item,
        width,
        texture,
      }
    })
  }, [items, textures])

  let currentX = 0

  return (
    <>
      {itemsWithWidth.map((item) => {
        const positionX = offsetX + currentX + item.width / 2

        currentX += item.width + 0.1 // Espacio entre tarjetas

        return (
          <group key={item.id}>
            {/* Elemento del timeline con textura */}
            <mesh position={[positionX, y, 0] as [number, number, number]}>
              <planeGeometry args={[item.width, CARD_HEIGHT]} />
              <meshStandardMaterial map={item.texture} color={color} roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Texto con año y título usando HTML */}
            <Html
              position={[positionX - item.width / 2, y + CARD_HEIGHT / 2 + 0.05, 0]}
              transform
              style={{
                width: `${item.width * 20}px`, // Multiplicar por 100 para escalar correctamente
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "2px 4px",
                borderRadius: "2px",
                fontSize: "8px", // Reducimos el tamaño del texto
                fontFamily: "Arial, sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                pointerEvents: "none",
              }}
            >
              <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <strong>{item.year}</strong> | {item.title}
              </div>
            </Html>
          </group>
        )
      })}
    </>
  )
}
