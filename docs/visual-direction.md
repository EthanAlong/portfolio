# Portfolio visual direction

The owner prefers an Apple-inspired, restrained design with meaningful spatial
motion. Keep ring navigation; do not add a grid view. Use generous whitespace,
neutral surfaces, clear typography, subtle depth, and a small number of controls.
Avoid dashboard-style framing, colorful control panels, and ornamental glow.

The Software & AI concept covers are approved. Workflow walkthroughs now blend
into the white project page with a light-gray image stage, compact segmented
controls, and a restrained perspective transition. Actual screenshot colors
remain intact. Reduced-motion visitors get static frame transitions.

## Proposed LAX direction (not implemented)

The current website assets are three flattened WebP images: overall structure,
an exploded view by level, and construction segmentation. These can support
camera-like framing and image transitions, but not genuine rotation or independent
movement of their structural elements.

A suitable future experience would progress with scroll from an overall neutral
structural model, through an exploded level sequence, to one highlighted
construction segment. A final stage could focus on a coordination detail. The
camera should move slowly and deliberately; each stage should introduce only a
short piece of explanatory text. Use white/light-gray surroundings and soft
shadows, preserving source data colors only where they convey meaning.

True interactive 3D requires a lightweight web model with floors and segments
kept as separate groups, exported from the original project model. The existing
Three.js/React Three Fiber and GSAP stack can support the scene and scroll-linked
camera/motion. Spline is a visual authoring option, but not a prerequisite.
