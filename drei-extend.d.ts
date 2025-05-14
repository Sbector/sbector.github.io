import type { Object3DNode } from "@react-three/fiber"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      portalMaterial: Object3DNode<any, any>
    }
  }
}
