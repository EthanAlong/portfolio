// src/data/projects.js

/**
 * ============================================================
 * 【 真实项目库 - REAL PROJECTS 】
 * ============================================================
 */
const realProjects = [
  {
    id: "1104-labrea-ave", 
    title: ["La Brea", "Collection"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Mixed Use",
    ringImage: "/1104-labrea-ave/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
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
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/1104-labrea-ave/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 2, // 两张图平分 100% 宽度
        images: ['/1104-labrea-ave/3.webp', '/1104-labrea-ave/4.webp' ]
      }
    ]
  },
  {
    id: "325-douglas-st", 
    title: ["325", "Douglas","St"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Mixed Use",
    ringImage: "/325-douglas-st/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/325-douglas-st/1.webp",
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
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/325-douglas-st/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 2, // 两张图平分 100% 宽度
        images: ['/325-douglas-st/3.webp', '/325-douglas-st/4.webp' ]
      },
      {
        type: 'videoEmbed',
        columns: 1, // 1video平分 100% 宽度
        src: ['/325-douglas-st/10.mp4' ]
      }
    ]
  },
  {
    id: "7221-mushmel", 
    title: ["7221", "Mushmel","court"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Mixed Use",
    ringImage: "/7221-mushmel/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/7221-mushmel/1.webp",
    location: "Sherman Oaks, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/7221-mushmel/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/7221-mushmel/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/7221-mushmel/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/7221-mushmel/5.webp']
      }
    ]
  },
  {
    id: "4070-laurelcanyon-blvd", 
    title: ["4070", "Laurel ","place"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Mixed Use",
    ringImage: "/4070-laurelcanyon-blvd/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/4070-laurelcanyon-blvd/1.webp",
    location: "Sherman Oaks, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/4070-laurelcanyon-blvd/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/4070-laurelcanyon-blvd/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/4070-laurelcanyon-blvd/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/4070-laurelcanyon-blvd/5.webp']
      }
    ]
  },
  {
    id: "1770-sawtelle-blvd", 
    title: ["1770", "Sawtelle ","place"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Mixed Use",
    ringImage: "/1770-sawtelle-blvd/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/1770-sawtelle-blvd/1.webp",
    location: "Sherman Oaks, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/1770-sawtelle-blvd/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/1770-sawtelle-blvd/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/1770-sawtelle-blvd/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/1770-sawtelle-blvd/5.webp']
      }
    ]
  },
  {
    id: "323-boylston-st", 
    title: ["323", "Boylston ","apartment"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Mixed Use",
    ringImage: "/323-boylston-st/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/323-boylston-st/1.webp",
    location: "Sherman Oaks, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/323-boylston-st/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/323-boylston-st/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/323-boylston-st/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/323-boylston-st/5.webp']
      }
    ]
  },
  {
    id: "2430-7th-st", 
    title: ["2430", "7th ","st"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Multi Family",
    ringImage: "/2430-7th-st/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/2430-7th-st/1.webp",
    location: "Sherman Oaks, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/2430-7th-st/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/2430-7th-st/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/2430-7th-st/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/2430-7th-st/5.webp']
      }
    ]
  },
  {
    id: "328-douglas-st", 
    title: ["328", "Douglas ","st"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Multi Family",
    ringImage: "/328-douglas-st/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/328-douglas-st/1.webp",
    location: "Sherman Oaks, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/328-douglas-st/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/328-douglas-st/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/328-douglas-st/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/328-douglas-st/5.webp']
      }
    ]
  },
  {
    id: "838-malcolm-ave", 
    title: ["838", "Malcolm ","Residence"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Single Family Residence",
    ringImage: "/838-malcolm-ave/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/838-malcolm-ave/1.webp",
    location: "Westwood, LA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/838-malcolm-ave/2.webp']
      }
      
    ]
  },
  {
    id: "2169-lindaflora-dr", 
    title: ["2169", "Linda flora ","dr"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Multi Family",
    ringImage: "/2169-lindaflora-dr/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/2169-lindaflora-dr/1.webp",
    location: "Sherman Oaks, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/2169-lindaflora-dr/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/2169-lindaflora-dr/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/2169-lindaflora-dr/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/2169-lindaflora-dr/5.webp']
      }
    ]
  },
  {
    id: "4355-melrose-ave", 
    title: ["4355", "Melrose ","ave"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Multi Family",
    ringImage: "/4355-melrose-ave/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/4355-melrose-ave/1.webp",
    location: "Sherman Oaks, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/4355-melrose-ave/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/4355-melrose-ave/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/4355-melrose-ave/4.webp']
      }
    ]
  },
  {
    id: "8325-beverly-blvd", 
    title: ["8325", "Beverly ","Flores"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Multi Family",
    ringImage: "/8325-beverly-blvd/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/8325-beverly-blvd/1.webp",
    location: "Sherman Oaks, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/2430-7th-st/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/2430-7th-st/3.webp']
      }
    ]
  },
  {
    id: "10706-ohio-ave", 
    title: ["10706", "Ohio ","place"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Multi Family",
    ringImage: "/10706-ohio-ave/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/10706-ohio-ave/1.webp",
    location: "Sherman Oaks, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/10706-ohio-ave/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/10706-ohio-ave/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/10706-ohio-ave/4.webp']
      },
      {
        type: 'videoEmbed',
        columns: 1, // video占据 100% 宽度
        src: ['/10706-ohio-ave/5.mp4']
      }
    ]
  },
  {
    id: "11580-pico-blvd", 
    title: ["11580", "Pico ","blvd"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Multi Family",
    ringImage: "/11580-pico-blvd/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/11580-pico-blvd/1.webp",
    location: "Sherman Oaks, CA",
    sector: "Mixed-Use / Residential",
    status: "Proposed / DD Phase",
    scale: "14,125 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD, Modeling, Rendering, Art Installation",
    content: [
      {
        type: 'textBlock',
        title: 'Project Framework',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/11580-pico-blvd/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/11580-pico-blvd/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/11580-pico-blvd/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/11580-pico-blvd/5.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/11580-pico-blvd/6.webp']
      }
    ]
  },
  {
    id: "vertical-shanghai", 
    title: ["Vertical", "Shanghai "], // 数组格式：支持精准控制两行排版
    year: "2014",
    category: "High Rise",
    ringImage: "/vertical-shanghai/1.webp", 
    description: "A 7-story mixed-use development in West Hollywood, integrating 49 residential units with street-level retail to redefine urban living.",
    mainImage: "/vertical-shanghai/1.webp",
    location: "Shanghai, China",
    sector: "Mixed-Use / Residential",
    status: "Proposed / Competition",
    scale: "-",
    architect: "School Project", 
    contribution: "Grasshopper, Modeling, Rendering, Data Analysis",
    content: [
      {
        type: 'textBlock',
        title: 'Project Description',
        text: 'The proposed project features two levels of subterranean parking beneath 1,110 sqft of ground-floor commercial space. The design prioritizes pedestrian flow and street-level engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
       
        images: ['/vertical-shanghai/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/vertical-shanghai/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/vertical-shanghai/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/vertical-shanghai/5.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/vertical-shanghai/6.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/vertical-shanghai/7.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/vertical-shanghai/8.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        hasBorder: true,
        customTitle: "Diagram",    // 【新参数】覆盖左侧的 "Plate Index"
        labels: ["Analysis"],   // 【新参数】覆盖右侧的 "01"
        images: ['/vertical-shanghai/9.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/vertical-shanghai/10.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/vertical-shanghai/11.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/vertical-shanghai/12.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/vertical-shanghai/13.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/vertical-shanghai/14.webp']
      }
    ]
  },
  {
    id: "bj-railway-complex", 
    title: ["Beijing", "Railway", "Complex"], // 数组格式：支持精准控制两行排版
    year: "2020",
    category: "Complex",
    ringImage: "/bj-railway-complex/6.webp", 
    description: "Bridging the void left by the old iron road, this residential and commercial synthesis aspires to weave dignity back into a once-fragmented urban landscape.",
    mainImage: "/bj-railway-complex/6.webp",
    location: "Beijing, China",
    sector: "Commercial / Residential",
    status: "Proposed / Competition",
    scale: "180,000 sqft",
    architect: "School Project", 
    contribution: "Design,Modeling, Rendering, Data Analysis",
    content: [
      {
        type: 'textBlock',
        title: 'Project Description',
        text: 'After Beijing north Railway station being closed and being reused recently, the old Jingzhang Rail was abandoned. The new constructed underground high-speed rail took place of the original overground rail. The area around Beijing-Zhangjiakou Railway, which turned out to become the "degraded" area that remained isolated and un-integrated, needs to be relinked with culture, history or tradition immediately. This reconstruction aims at giving dignity to a place and the users of the place through the development of a new residential and commercial complex architecture'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/bj-railway-complex/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/bj-railway-complex/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/bj-railway-complex/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/bj-railway-complex/5.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/bj-railway-complex/6.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/bj-railway-complex/7.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/bj-railway-complex/8.webp']
      }
    ]
  }
];

/**
 * ============================================================
 * 【 占位符生成逻辑 - ARCHIVE GENERATOR 】
 * 保持 Ring 界面的丰满感（共计 22 个项目）
 * ============================================================
 */
const placeholderCount = 30; 
const remainingCount = Math.max(0, placeholderCount - realProjects.length);
const placeholders = Array.from({ length: remainingCount }, (_, i) => {
  const pId = realProjects.length + i + 1;
  return {
    id: `archive-${pId}`,
    title: [`ARCHIVE`, `PROJECT ${pId}`],
    year: "202X",
    category: "Computational",
    ringImage: `https://picsum.photos/seed/${pId + 10}/400/600`,
    mainImage: `https://picsum.photos/seed/${pId + 10}/1200/800`,
    description: "This research explores digital fabrication and parametric urbanism to maximize spatial complexity in high-density environments.",
    location: "Global",
    sector: "Research",
    status: "In Progress",
    scale: "TBD",
    architect: "Way-A Architect",
    contribution: "Lead Designer",
    content: [
      {
        type: 'textBlock',
        title: 'Concept Research',
        text: 'Algorithmic growth patterns are leveraged to minimize structural waste while optimizing user experience through computational methodologies.'
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