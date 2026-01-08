// src/data/projects.js
const placeholders = Array.from({ length: 20 }, (_, i) => ({
  id: `project-${i + 1}`,
  title: `PROJECT NAME ${i + 1}`,
  description: "这是一个建筑设计项目的详细介绍占位符。描述了空间的流动性、材料的运用以及与城市的对话。",
  ringImage: `https://picsum.photos/80/120?random=${i}`, // 较窄的比例，模拟书页
  mainImage: `https://picsum.photos/1200/800?random=${i}`,
  location: "Los Angeles, CA",
  year: "2026",
  category: "Computational Design",
  gallery: [
    `https://picsum.photos/800/600?random=${i + 100}`,
    `https://picsum.photos/800/600?random=${i + 101}`,
    `https://picsum.photos/800/1200?random=${i + 102}` // 测试长图
  ]
}));

export const projects = placeholders;