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
    id: "digital-escape", 
    title: ["Digital", "Escape"], // 数组格式：支持精准控制两行排版
    year: "2022",
    category: "Digital Media",
    ringImage: "/digital-escape/1.webp", 
    description: "A cinematic exploration of digital immortality, where a 'soul cache' satellite network archives human existence amidst an impending global catastrophe and a clandestine power struggle",
    mainImage: "/digital-escape/1.webp",
    location: "-",
    sector: "Cultural Archive",
    status: "Academic / Research Phase",
    scale: "Multi-node Network",
    architect: "UCLA Project", 
    contribution: "3D Visualization, Data Scripting, Video Editing",
    content: [
      {
        type: 'textBlock',
        title: 'Project Description',
        text: 'In an age of digital immortality, the Soul Cache serves as a remote repository for human experiences, transmitted via a satellite network linked by biological code. As a meteorite strike looms, the masses scramble to archive their lives while a rogue scientist attempts to hack the system, turning humanity’s final preservation into a desperate struggle for control.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/digital-escape/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/digital-escape/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/digital-escape/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/digital-escape/5.webp']
      },
      {
        type: 'mixedGrid',
        items: [
          { type: 'image', src: '/digital-escape/6.webp' },
          { type: 'video', src: '/digital-escape/6.mp4' }
        ]
      },
      {
        type: 'mixedGrid',
        items: [
          { type: 'image', src: '/digital-escape/7.webp' },
          { type: 'video', src: '/digital-escape/7.mp4' }
        ]
      },
      {
        type: 'mixedGrid',
        items: [
          { type: 'image', src: '/digital-escape/8.webp' },
          { type: 'video', src: '/digital-escape/8.mp4' }
        ]
      }
        
    ]
  },
  {
    id: "in-the-mood-for-love", 
    title: ["In The Mood", "For Love"], // 数组格式：支持精准控制两行排版
    year: "2017",
    category: "Urban Renovation",
    ringImage: "/in-the-mood-for-love/1.webp", 
    description: "A cinematic reimagining of urban intimacy: translating the nostalgic communal fabric of In the Mood for Love into a modern spatial strategy for Enning Road.",
    mainImage: "/in-the-mood-for-love/1.webp",
    location: "Guangzhou, China",
    sector: "Urban Cultural Archive & Heritage Preservation",
    status: "Academic / Research Phase",
    scale: "Urban Network",
    architect: "GAFA Project", 
    contribution: "Cinematic Visualization, Multimedia Narrative",
    content: [
      {
        type: 'textBlock',
        title: 'Project Description',
        text: 'This project addresses the erosion of neighborly connections in the wake of urban refurbishment at Enning Road. Using the 1970s Hong Kong setting of In the Mood for Love as a cultural and spatial benchmark, the design researches how narrow, constrained environments can paradoxically foster closer human relationships. The intervention aims to recreate the vibrant social atmosphere of the past, utilizing the cinematic art story to inform a contemporary spatial framework where intimate communal life can once again thrive amidst the historic fabric of Yongqingfang.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/in-the-mood-for-love/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/in-the-mood-for-love/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/in-the-mood-for-love/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/in-the-mood-for-love/5.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/in-the-mood-for-love/6.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/in-the-mood-for-love/7.webp']
      },  
    ]
  },
  {
    id: "mosaic-bookstore", 
    title: ["Mosaic", "Bookstore"], // 数组格式：支持精准控制两行排版
    year: "2019",
    category: "Interior Design / Installation",
    ringImage: "/mosaic-bookstore/1.webp", 
    description: "A full-cycle architectural intervention: Translating the metaphor of enlightenment into a spatial sequence of light and shadow in Shunde, China",
    mainImage: "/mosaic-bookstore/1.webp",
    location: "Shunde, China",
    sector: "Commercial & Cultural Space",
    status: "Built / Completed",
    scale: "Interior Installation",
    architect: "Way-A Architects", 
    contribution: "Technical Detailing, Construction Administration",
    content: [
      {
        type: 'textBlock',
        title: 'Project Description',
        text: 'From preliminary research to on-site construction, this project explores the concept of the “book as light” within a cave-like setting. Located in Shunde’s Overseas Chinese Town, the design utilizes installation-based interventions to create a sense of guidance and intellectual advancement. By choreographing the virtual medium of light and shadow, the intervention shapes a fluid, atmospheric space that transcends traditional retail, encouraging visitors to linger and find direction within its sculptural volumes.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/mosaic-bookstore/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/mosaic-bookstore/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/mosaic-bookstore/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/mosaic-bookstore/5.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/mosaic-bookstore/6.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/mosaic-bookstore/7.webp']
      },  
      {
        type: 'imageGrid',
        columns: 2, // 一张图占据 100% 宽度
        images: ['/mosaic-bookstore/8.webp', '/mosaic-bookstore/9.webp']
      },  {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/mosaic-bookstore/10.webp']
      },  {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/mosaic-bookstore/11.webp']
      },  
    ]
  },
  {
    id: "traditional-chinese-medicine", 
    title: ["Traditional", "Chinese Medicine"], // 数组格式：支持精准控制两行排版
    year: "2020",
    category: "Urban Renovation / Cultural",
    ringImage: "/traditional-chinese-medicine/1.webp", 
    description: "A modular dialogue between heritage and healing: Reimagining Guangzhou's historic Qingping Market as a contemporary hub for Traditional Chinese Medicine (TCM) culture",
    mainImage: "/traditional-chinese-medicine/1.webp",
    location: "Guangzhou, China",
    sector: "Commercial & Cultural Space",
    status: "Academic / Undergraduate Design",
    scale: "Urban Block Renovation",
    architect: "Peng Li", 
    contribution: "CD, DD, Parametric Modeling, Cinematic Rendering",
    content: [
      {
        type: 'textBlock',
        title: 'Project Description',
        text: 'Located in the historic medical district of Guangzhou, the Medicine Bucket City Renovation addresses the revitalization of the Qingping Market (Phase II). Historically a nexus for hospitals and medicinal trade, the site now faces the challenge of reconciling its aging residential fabric with a fragmented TCM industry. This project proposes a systemic urban intervention that integrates modern architectural principles with the traditional essence of TCM. By translating the rhythmic, modular logic of the "medicine bucket" into a spatial framework, the design creates a multi-scale network—from urban planning to tectonic detail—that fosters cultural education and industrial innovation. The resulting space acts as a catalyst for community growth, bridging the gap between the district’s historical legacy and its future functional demands'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/traditional-chinese-medicine/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/traditional-chinese-medicine/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/traditional-chinese-medicine/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/traditional-chinese-medicine/5.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/traditional-chinese-medicine/6.webp']
      },
    ]
  },
  {
    id: "river-residence", 
    title: ["River", "Residence"], // 数组格式：支持精准控制两行排版
    year: "2018",
    category: "Adaptive Reuse / Urban Waterfront",
    ringImage: "/river-residence/1.webp", 
    description: "From Vessel Fabrication to Aquatic Habitation: The adaptive reuse of the historic Guangzhou Shipyard into a resilient mixed-use waterfront.",
    mainImage: "/river-residence/1.webp",
    location: "Guangzhou, China",
    sector: "Mixed-use / Industrial Heritage",
    status: "Academic / Undergraduate Design",
    scale: "Large-scale Urban Intervention",
    architect: "Peng Li", 
    contribution: "CD, DD, Parametric Modeling, Cinematic Rendering",
    content: [
      {
        type: 'textBlock',
        title: 'Project Description',
        text: 'As a century-old icon of China\'s industrial evolution, the Guangzhou Shipyard faced marginalization amidst rapid urbanization. This project seeks to preserve this indelible cultural symbol by transforming the abandoned industrial site into a vibrant commercial and residential hub. The design intervention pivots on the conceptual evolution from "shipbuilding" to "boat dwelling"—a typology that honors the site\'s maritime heritage while addressing contemporary housing needs. By repurposing industrial relics as structural frameworks for modern living, the project ensures that the spirit of the riverboat is not merely remembered, but inhabited, creating a seamless continuity between Guangzhou\'s industrial past and its urban future.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/river-residence/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/river-residence/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/river-residence/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/river-residence/5.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/river-residence/6.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/river-residence/7.webp']
      },{
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/river-residence/8.webp']
      },{
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/river-residence/9.webp']
      },
    ]
  },
  {
    id: "pulse-station", 
    title: ["Pulse", "Station"], // 数组格式：支持精准控制两行排版
    year: "2022",
    category: "Speculative Design / XR Narrative",
    ringImage: "/pulse-station/1.webp", 
    description: "An immersive Unreal Engine narrative exploring the future of social intimacy through emotional masks and AR-driven persona projections.",
    mainImage: "/pulse-station/1.webp",
    location: "Virtual",
    sector: "Academic Research & Prototyping",
    status: "Experimental Prototype",
    scale: "Installation / Model Scale",
    architect: "-", 
    contribution: "UE5 Development / Interaction Logic",
    content: [
      {
        type: 'textBlock',
        title: 'Project Description',
        text: 'Set within a surreal liminal space, Pulse Station is a speculative exploration of human connection in the age of augmented reality. The journey begins at a transitional station where users are required to don a physical-digital mask before entering a communal bar environment. This mask serves as an interface for “Affective Casting”: users select their current emotional state, which is then translated into a persistent AR aura projected onto their physical form. Through the lens of the mask, participants perceive a world where emotions are no longer internal, but externalized, atmospheric data. This project leverages the cinematic power of Unreal Engine to visualize a future where social barriers are replaced by digital transparency, challenging the authenticity of identity in a gamified social landscape.'
      },
      {
        type: 'videoEmbed',
        columns: 1, // 一张图占据 100% 宽度
        src: ['/pulse-station/7.mp4']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/pulse-station/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/pulse-station/3.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/pulse-station/4.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/pulse-station/5.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        images: ['/pulse-station/6.webp']
      }
       
    ]
  }
];

/**
 * ============================================================
 * 【 占位符生成逻辑 - ARCHIVE GENERATOR 】
 * 保持 Ring 界面的丰满感（共计 24 个项目，日后可补充）
 * ============================================================
 */
const placeholderCount = 24; 
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