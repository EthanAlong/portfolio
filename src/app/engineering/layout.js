// Server layout so /engineering can declare its own title and share preview
// (page.js is a client component). The preview image is opengraph-image.js.
export const metadata = {
  title: "Engineering",
  description:
    "Find the pain. Ship the fix. Measure it. Internal tools, AI agents and the Azure platform behind them at Saiful Bouquet Structural Engineers: an RFI agent, a Revit AI agent with an approval gate, an AI detail library, and the ROI.",
  openGraph: {
    title: "Engineering · Ethan Huang",
    description: "Find the pain. Ship the fix. Measure it. 8 tools in production, 9 daily users, 89× return on run cost.",
    url: "/engineering",
  },
}

export default function EngineeringLayout({ children }) {
  return children
}
