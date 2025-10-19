declare module 'react-simple-maps' {
  import { ComponentType, CSSProperties } from 'react'

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: {
      scale?: number
      center?: [number, number]
      rotate?: [number, number, number]
    }
    width?: number
    height?: number
    style?: CSSProperties
    className?: string
    children?: React.ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (args: { geographies: any[] }) => React.ReactNode
  }

  export interface GeographyProps {
    geography: any
    style?: {
      default?: CSSProperties
      hover?: CSSProperties
      pressed?: CSSProperties
    }
    fill?: string
    stroke?: string
    strokeWidth?: number
    className?: string
    onClick?: () => void
  }

  export const ComposableMap: ComponentType<ComposableMapProps>
  export const Geographies: ComponentType<GeographiesProps>
  export const Geography: ComponentType<GeographyProps>
  export const Marker: ComponentType<any>
  export const Line: ComponentType<any>
  export const Graticule: ComponentType<any>
  export const Sphere: ComponentType<any>
  export const Annotation: ComponentType<any>
  export const ZoomableGroup: ComponentType<any>
}
