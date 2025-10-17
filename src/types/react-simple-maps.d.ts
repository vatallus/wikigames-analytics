declare module 'react-simple-maps' {
  import { ComponentType } from 'react'

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, unknown>
    width?: number
    height?: number
    className?: string
    children?: React.ReactNode
  }

  export interface ZoomableGroupProps {
    zoom?: number
    center?: [number, number]
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void
    minZoom?: number
    maxZoom?: number
    children?: React.ReactNode
  }

  export interface GeographiesProps {
    geography: string
    children?: (data: { geographies: unknown[] }) => React.ReactNode
  }

  export interface GeographyProps {
    geography: unknown
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    onClick?: () => void
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
    fill?: string
    stroke?: string
    strokeWidth?: number
    children?: React.ReactNode
  }

  export const ComposableMap: ComponentType<ComposableMapProps>
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>
  export const Geographies: ComponentType<GeographiesProps>
  export const Geography: ComponentType<GeographyProps>
}
