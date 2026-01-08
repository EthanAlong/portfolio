// src/data/projects.js

// 1. 【真实项目区】：你以后每做一个新项目，就按这个格式往 realProjects 数组里加一个对象
const realProjects = [
  {
    id: "1104-labrea-ave", 
    title: "LaBrea Collection",
    year: "2024",
    category: "Mixed Use",
    ringImage: "/1104-labrea-ave/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine high-density urban living.",
    mainImage: "/1104-labrea-ave/1.webp",
    location: "West Hollywood, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    quote: "Harmonizing urban density with high-end residential logic at the intersection of La Brea.",
    content: [
      {
        type: 'textBlock',
        title: 'Project Data',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space, prioritizing pedestrian flow.'
      },
      {
        type: 'imageGrid',
        columns: 1,
        images: ['/1104-labrea-ave/2.jpg']
      },
      {
        type: 'imageGrid',
        columns: 2,
        images: ['/1104-labrea-ave/3.jpg', '/1104-labrea-ave/4.jpg']
      }
    ]
  },
  // 下一个真实项目放在这里...
];

// 2. 【占位符区】：自动生成剩余的坑位
const placeholderCount = 22; // 你想要总共有多少个项目（包含真实项目）
const remainingCount = Math.max(0, placeholderCount - realProjects.length);

const placeholders = Array.from({ length: remainingCount }, (_, i) => {
  const pId = realProjects.length + i + 1;
  return {
    id: `archive-${pId}`,
    title: `ARCHIVE PROJECT ${pId}`,
    year: "202X",
    category: "Computational Design",
    ringImage: `https://picsum.photos/seed/${pId + 10}/400/600`, // 圆环预览图
    mainImage: `https://picsum.photos/seed/${pId + 10}/1200/800`, // 详情页主图
    description: "This is a placeholder for a future architectural project entry. It maintains the visual rhythm of the archive ring.",
    location: "Global",
    sector: "Research",
    status: "In Progress",
    scale: "TBD",
    architect: "Way-A Architect",
    contribution: "Lead Designer",
    quote: "Architecture is the learned game, correct and magnificent, of forms assembled in the light.",
    // 给占位符也加一个基础的 content 数组，防止点击进入详情页时报错
    content: [
      {
        type: 'imageGrid',
        columns: 2,
        images: [
          `https://picsum.photos/seed/${pId + 50}/800/600`,
          `https://picsum.photos/seed/${pId + 51}/800/600`
        ]
      }
    ]
  };
});

// 3. 【合并导出】：真实项目排在最前面
export const projects = [...realProjects, ...placeholders];