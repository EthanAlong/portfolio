// src/data/projects.js

// 1. 【真实项目】：La Brea Collection
const realProjects = [
  {
    id: "1104-labrea-ave", 
    title: ["La Brea", "Collection"], 
    year: "2024",
    category: "Mixed Use",
    ringImage: "/1104-labrea-ave/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail.",
    mainImage: "/1104-labrea-ave/1.webp",
    location: "West Hollywood, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 占据全宽
        images: ['/1104-labrea-ave/1.webp']
      },
      {
        type: 'imageGrid',
        columns: 2, // 两张并排
        images: ['https://picsum.photos/seed/lb1/800/600', 'https://picsum.photos/seed/lb2/800/600']
      }
    ]
  }
];

// 2. 【占位符生成】：保持 22 个项目的 Archive 环
const placeholderCount = 22; 
const remainingCount = Math.max(0, placeholderCount - realProjects.length);
const placeholders = Array.from({ length: remainingCount }, (_, i) => {
  const pId = realProjects.length + i + 1;
  return {
    id: `archive-${pId}`,
    title: [`ARCHIVE`, `PROJECT ${pId}`],
    year: "202X",
    category: "Research",
    ringImage: `https://picsum.photos/seed/${pId + 10}/400/600`,
    mainImage: `https://picsum.photos/seed/${pId + 10}/1200/800`,
    description: "This research explores digital fabrication and parametric urbanism to maximize spatial complexity.",
    location: "Global",
    sector: "Research",
    status: "In Progress",
    scale: "TBD",
    architect: "Way-A Architect",
    contribution: "Lead Designer",
    content: [
      {
        type: 'textBlock',
        title: 'Design Philosophy',
        text: 'Algorithmic growth patterns are leveraged to minimize structural waste while optimizing user experience in high-density environments.'
      },
      {
        type: 'imageGrid',
        columns: 2,
        images: [`https://picsum.photos/seed/${pId+50}/800/600`, `https://picsum.photos/seed/${pId+51}/800/600`]
      }
    ]
  };
});

export const projects = [...realProjects, ...placeholders];