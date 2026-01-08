// src/data/projects.js
const placeholders = Array.from({ length: 20 }, (_, i) => ({
  id: `project-${i + 1}`,
  title: `PROJECT NAME ${i + 1}`,
  description: "这是一个建筑设计项目的详细介绍占位符。描述了空间的流动性、材料的运用以及与城市的对话。",
  ringImage: `https://picsum.photos/seed/${i + 1}/80/120`, // 使用 seed 代替 random 确保确定性
  mainImage: `https://picsum.photos/seed/${i + 1}/1200/800`,
  location: "Los Angeles, CA",
  year: "2026",
  category: "Computational Design",
  gallery: [
    `https://picsum.photos/seed/${i + 20}/800/600`,
    `https://picsum.photos/seed/${i + 21}/800/600`,
    `https://picsum.photos/seed/${i + 22}/800/1200`
  ]
}));

export const projects = placeholders;