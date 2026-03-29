// @ts-nocheck
import { createRoot, on } from "remix/component"
// Consumer example from component docs migration
import { ImageViewer, ImageViewerImage } from "@lukasmurdock/remix-ui-components"
const images: ImageViewerImage[] = [
  { src: "/images/release-1.png", alt: "Release details 1" },
  { src: "/images/release-2.png", alt: "Release details 2" },
  { src: "/images/release-3.png", alt: "Release details 3" },
]
type ExampleProps = {
  open: boolean
  onOpenChange: (nextOpen: boolean) => void
}

export function Example(_handle) {
  return ({ open, onOpenChange }: ExampleProps) => (
    <>
      <button className="docs-button" type="button" mix={[on("click", () => onOpenChange(true))]}>
        Open image viewer
      </button>
      <ImageViewer
        open={open}
        images={images}
        defaultIndex={0}
        onClose={() => {
          onOpenChange(false)
        }}
        onIndexChange={(next) => console.log(next)}
      />
    </>
  )
}

export function mount(mountEl: HTMLElement) {
  let open = false
  const root = createRoot(mountEl)
  let renderQueued = false

  const render = () => {
    root.render(
      <Example
        key={open ? "open" : "closed"}
        open={open}
        onOpenChange={(nextOpen) => {
          if (open === nextOpen) return
          open = nextOpen
          if (renderQueued) return
          renderQueued = true
          queueMicrotask(() => {
            renderQueued = false
            render()
          })
        }}
      />,
    )
  }

  render()
}
