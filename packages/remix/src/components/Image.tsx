import type { Handle } from "remix/component"

export type ImageFit = "cover" | "contain" | "fill"

export type ImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  fit?: ImageFit
  loading?: "lazy" | "eager"
  fallbackText?: string
}

export function resolveImageFit(fit?: ImageFit): ImageFit {
  return fit ?? "cover"
}

export function resolveImageLoading(loading?: "lazy" | "eager"): "lazy" | "eager" {
  return loading ?? "lazy"
}

export function resolveImageFallbackText(text?: string): string {
  return text ?? "Image unavailable"
}

export function Image(_handle: Handle) {
  return (props: ImageProps) => (
    <figure className="rf-image" data-fit={resolveImageFit(props.fit)}>
      <img
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        loading={resolveImageLoading(props.loading)}
        className="rf-image-element"
      />
      <figcaption className="rf-image-fallback" hidden>
        {resolveImageFallbackText(props.fallbackText)}
      </figcaption>
    </figure>
  )
}
