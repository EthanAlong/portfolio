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
    category: "Multi-Family Residential (TOC)",
    ringImage: "/325-douglas-st/1.webp", 
    mainImage: "/325-douglas-st/1.webp",
    description: "An 8-story multi-residential project utilizing TOC-1 incentives to deliver 66 high-density units. Following PZA approval, the design was strategically updated to accommodate complex LADWP transformer vault relocation, ensuring seamless utility integration while maximizing subterranean parking efficiency.",    mainImage: "/325-douglas-st/1.webp",
    location: "Echo Park, Los Angeles, CA",
    sector: "High-Density Residential / TOC Tier 1",
    status: "PZA Approved / Infrastructure Optimization Phase",
    scale: "66 Units / 54,592 sqft Total",
    architect: "Plus Architect", 
    contribution: "LADWP Coordination, Technical Redesign, PZA Entitlement Support",
    content: [
      {
      type: 'textBlock',
      title: 'Infrastructure & Entitlement Synergy',
      text: 'Located on a 16,760 sqft lot in Echo Park, this project leverages a proposed FAR of $4.2:1$ to achieve significant urban densification. A critical phase involved direct negotiation with LADWP to relocate major electrical components within the ground-floor footprint. This technical redesign was essential to clearing municipal hurdles post-PZA, balancing the requirements of the 54,592 sqft structure with the practicalities of Los Angeles’ utility infrastructure and the TOC Tier 1 framework.'
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
    year: "2025",
    category: "Multi-Family Residential",
    ringImage: "/7221-mushmel/1.webp", 
    mainImage: "/7221-mushmel/1.webp",
    description: "A 6-story multi-residential development featuring 80 units over ground-floor parking and one level of subterranean garage. My role focused on the initial schematic design phase, high-fidelity visualization, and seamless coordination with the landscape team to integrate lush roof decks and communal outdoor spaces.",
    location: "Van Nuys, Los Angeles, CA",
    sector: "High-Density Residential (MIP)",
    status: "SD / DD",
    scale: "80 Units / 67,570 sqft Total",
    architect: "Plus Architect", 
    contribution: "SD, 3D Visualization, Landscape Coordination",
    content: [
      {
      type: 'textBlock',
      title: 'Integrated Urban Living',
      text: 'The project replaces an open parking lot with a high-density residential hub, utilizing TOC-2 / MIP incentives to achieve a proposed FAR of 3.8:1. A key aspect of the design was the collaboration with the landscape team to ensure the 67,570 sqft building mass provided ample open space for residents, balancing the technical requirements of Type IA/IIA construction with a high-quality living environment.'
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
    year: "2025",
    category: "Adaptive Reuse / Commercial Remodel",
    ringImage: "/4070-laurelcanyon-blvd/1.webp", 
    mainImage: "/4070-laurelcanyon-blvd/1.webp",
    description: "A comprehensive remodeling and vertical addition project transforming an existing commercial structure into a modern mixed-use destination. My role involves intensive coordination with structural engineers during construction to modify existing structural members, ensuring optimal space flexibility for future restaurant and gym tenants.",
    location: "Studio City, CA",
    sector: "Commercial (Restaurant & Gym)",
    status: "nder Construction / Structural Coordination",
    scale: "11,563 sqft Total",
    architect: "Plus Architect", 
    contribution: "Structural Coordination, Tenant Layout Optimization, CA Phase Support",
    content: [
      {
      type: 'textBlock',
      title: 'Tenant-Driven Structural Intervention',
      text: 'The project focuses on a significant change of use and height increase (from 30\' to 43\') within the Ventura/Cahuenga Blvd. Corridor. During the active construction phase, I lead the coordination between the ownership and structural teams to relocate key structural components. This strategic intervention resolves spatial conflicts, allowing for unobstructed 11,500+ sqft of leasable space, specifically optimized for high-occupancy A-2 (Restaurant) and A-3 (Gym) tenants.'
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
    year: "2022",
    category: "Mixed-Use / Affordable Housing",
    ringImage: "/1770-sawtelle-blvd/1.webp", 
    mainImage: "/1770-sawtelle-blvd/1.webp",
    description: "A 7-story development featuring 36 units (including 4 VLI and 2 Moderate units) over ground-floor retail. By leveraging AB 1287 and the CHIP ordinance, the project achieved a 'By-right' ministerial review path, effectively bypassing previous public hearing requirements.",
    location: "West Los Angeles, CA",
    sector: "High-Density Residential & Commercial",
    status: "Ministerial Review (By-Right) / CHIP Filed",
    scale: "36 Units / 29,090 sqft Total",
    architect: "Plus Architect", 
    contribution: "CHIP Entitlement Strategy, AB 1287 Incentive Analysis, DD Documentation",
    content: [
      {
      type: 'textBlock',
      title: 'Policy-Driven Optimization',
      text: 'Originally subject to discretionary public hearings, this project was strategically re-filed in early 2026 to utilize Los Angeles’ Citywide Housing Incentive Program (CHIP). By integrating a stackable bonus under AB 1287, we achieved a 71% density increase over the base 21 units. The design maximizes the 8,112 SF lot with 2 levels of subterranean parking while securing one on-menu and three off-menu incentives, including significant relief in height and FAR.'
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
    title: ["Boylston", "Apartments"], // 数组格式：支持精准控制两行排版
    year: "2025",
    category: "Multi-Family Residential",
    ringImage: "/323-boylston-st/1.webp", 
    mainImage: "/323-boylston-st/1.webp",
    description: "A 59-unit residential project in Los Angeles undergoing a strategic 2025 update. By leveraging the Citywide Housing Incentive Program (CHIP), the design introduces an additional floor and optimized unit density over the project’s 2015 baseline approval.",    mainImage: "/323-boylston-st/1.webp",
    location: "Los Angeles, CA",
    sector: "High-Density Residential / Land Use Strategy",
    status: "Zoning Review / Land Use Optimization",
    scale: "59 Units / 57,134 sqft Total",
    architect: "Plus Architect", 
    contribution: "CHIP Expansion Strategy, Land Use Coordination, DD Documentation",
    content: [
      {
      type: 'textBlock',
      title: 'Strategic Density Optimization',
      text: 'Originally approved in 2015, this 7-story project is being reimagined under the 2025 CHIP (Citywide Housing Incentive Program) framework. My work focuses on coordinating with land-use consultants to maximize the 5.3:1 F.A.R. potential, adding a residential tier and expanding the program to 59 units. This phase requires meticulous navigation of off-menu incentives and hybrid Type IA/IIIA construction standards.'
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
    title: ["7th Street", "Townhouses"], // 数组格式：支持精准控制两行排版
    year: "2025",
    category: "Multi-Family Residential",
    ringImage: "/2430-7th-st/1.webp", 
    mainImage: "/2430-7th-st/1.webp",
    description: "A high-end 7-unit residential project in Santa Monica utilizing Density Bonus incentives. The design features a 2-story over basement typology, currently undergoing rigorous Architectural Review Board (ARB) processing and Condominium Entitlement coordination.",    mainImage: "/2430-7th-st/1.webp",
    location: "Santa Monica, CA",
    sector: "Luxury Condominiums",
    status: "Entitlement / ARB Review Phase",
    scale: "7,854 sqft Residential / 7 Units",
    architect: "Plus Architect", 
    contribution: "ARB Review, Interior Design, Entitlement Coordination",
    content: [
      {
      type: 'textBlock',
      title: 'Entitlement & Interior Synergy',
      text: 'This project represents a dual challenge of navigating Santa Monica’s strict Architectural Review Board (ARB) standards while simultaneously developing a cohesive interior design language. My role involves managing city corrections—specifically regarding the Tentative Tract Map for condominium filing—to ensure the architectural vision aligns with complex legal and structural requirements.'
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
    title: ["Douglas II", "Apartments"], // 数组格式：支持精准控制两行排版
    year: "2023",
    category: "Multi-Family Residential (TOC)",
    ringImage: "/328-douglas-st/1.webp", 
    mainImage: "/328-douglas-st/1.webp",
    description: "A 7-story TOIA-T1 project featuring 66 units in Echo Park. Having secured PZA and Soil Approval in late 2025, the design maximizes urban density through Transit Oriented Communities (TOC) incentives.",    mainImage: "/328-douglas-st/1.webp",
    location: "Echo Park, Los Angeles, CA",
    sector: "Affordable Housing / TOC Tier 1",
    status: "PZA Approved / Plan Check Phase",
    scale: "66 Units / 52,061 sqft Total",
    architect: "Plus Architect", 
    contribution: "PZA Entitlement, DD Documentation",
    content: [
      {
      type: 'textBlock',
      title: 'Transit-Oriented Density',
      text: 'This 52,061 sqft project utilizes TOC Tier 1 incentives to achieve a 66-unit density on a 17,508 sqft lot. The design includes 2 levels of subterranean parking and a 7-story residential structure, balancing market-rate housing with essential ELI (Extremely Low Income) units. My role involved navigating the complex entitlement process, securing PZA, and coordinating technical soil approvals.'
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
    title: ["Malcolm", "House"], // 数组格式：支持精准控制两行排版
    year: "2025",
    category: "Single Family Residence",
    ringImage: "/838-malcolm-ave/1.webp", 
    mainImage: "/838-malcolm-ave/1.webp",
    description: "A comprehensive remodeling and 2-story addition for an existing residence in Westwood, expanding the living space to 4,150 sqft while navigating the latest 2026 L.A. building code corrections.",
    location: "Westwood, LA",
    sector: "Residential Addition & Remodel",
    status: "Plan Check Phase",
    scale: "959 sqft Addition / 4,150 sqft Total",
    architect: "Plus Architect", 
    contribution: "Addition Strategy, Interior Remodeling, Plan Check Coordination",
    content: [
      {
      type: 'textBlock',
      title: 'Surgical Intervention',
      text: 'The project focuses on a sensitive vertical and lateral expansion of an existing 3,191 sqft home. By adding 959 sqft of new living area and performing a full interior remodel, the design modernizes the spatial flow while maintaining the character of the neighborhood. The work involves complex structural retrofitting and meticulous coordination with the City of Los Angeles for plan check compliance.'
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
    title: ["Linda Flora", "Residence"], // 数组格式：支持精准控制两行排版
    year: "2022",
    category: "Single-Family Residential",
    ringImage: "/2169-lindaflora-dr/1.webp", 
    mainImage: "/2169-lindaflora-dr/1.webp",
    description: "A 5,160 sqft custom residence in Bel Air featuring an expansive subterranean level and integrated hillside landscaping, currently navigating the technical grading and permitting process.",
    location: "Bel Air, Los Angeles, CA",
    sector: "Luxury Residential",
    status: "Permitting / Plan Check Phase",
    scale: "7,778 sqft Total Area",
    architect: "Plus Architect", 
    contribution: "Grading Coordination, Permitting Documentation, Technical Detailing",
    content: [
      {
      type: 'textBlock',
      title: 'Hillside Architecture',
      text: 'The project explores the integration of a 2-story modern dwelling into the steep topography of Bel Air. It features 5,160 sqft of above-grade living space plus a 2,618 sqft exempted basement, requiring precise coordination with civil engineering and soil reports to satisfy stringent Los Angeles grading requirements.'
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
    title: ["Melose-Edge", "Apartments"], // 数组格式：支持精准控制两行排版
    year: "2025",
    category: "Mixed-Use / Multi-Family",
    ringImage: "/4355-melrose-ave/1.webp", 
    mainImage: "/4355-melrose-ave/1.webp",
    description: "A 7-story landmark project on Melrose Avenue featuring 131 apartment units over 20,000 sqft of commercial space, utilizing a 4.21:1 FAR to maximize transit-oriented density.",
    location: "Los Angeles, CA",
    sector: "Commercial & High-Density Residential",
    status: "Proposed / Entitlement Phase",
    scale: "153,485 sqft Total",
    architect: "Plus Architect", 
    contribution: "DD Documentation / Urban Massing Analysis",
    content: [
      {
      type: 'textBlock',
      title: 'Urban Densification',
      text: 'This 153,485 sqft development represents a significant urban infill effort, replacing low-density structures with a 7-story residential hub. The design balances 131 diverse units with three levels of subterranean parking and a vibrant ground-floor commercial presence, optimized through L.A. density bonus incentives.'
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
    title: [ "Beverly ","Flores"], // 数组格式：支持精准控制两行排版
    year: "2023",
    category: "Mixed-Use / Residential",
    ringImage: "/8325-beverly-blvd/1.webp",
    mainImage: "/8325-beverly-blvd/1.webp",
    description: "A 6-story mixed-use development currently under construction, leveraging the Citywide Housing Incentive Program (CHIP) for mid-stream vertical expansion to maximize urban density.",    mainImage: "/8325-beverly-blvd/1.webp",
    location: "Los Angeles, CA",
    sector: "Commercial & Multi-Family",
    status: "Under Construction / CHIP Expansion Phase",
    scale: "4,399 sqft Lot",
    architect: "Plus Architect", 
    contribution: "Construction Administration, CHIP Amendment Strategy, DD Documentation",
    content: [
       {
      type: 'textBlock',
      title: 'Adaptive Construction Strategy',
      text: 'Originally permitted as a smaller scale development, this project is currently undergoing a vertical addition during active construction. By integrating the new CHIP (Citywide Housing Incentive Program) guidelines, we are adding an additional residential tier, navigating the technical and legal complexities of mid-stream design amendments.'
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
    title: [ "Ohio ","place"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Multi-Family Residential",
    ringImage: "/10706-ohio-ave/1.webp", 
    mainImage: "/10706-ohio-ave/1.webp",
    description: "A 5-story multi-family residential project in Los Angeles featuring 13 rental units over a subterranean parking garage, optimized for high-density urban infill.",    mainImage: "/10706-ohio-ave/1.webp",
    location: "Los Angeles, CA",
    sector: "Residential",
    status: "DD Phase / Permitting",
    scale: "6,956 sqft Lot",
    architect: "Plus Architect", 
    contribution: "DD Documentation / 3D Modeling & Visualization",
    content: [
        {
      type: 'textBlock',
      title: 'Design Strategy',
      text: 'The project replaces an existing structure with a 56-foot tall residential complex, maximizing the lot’s potential through a 13,050 sqft floor area design. It integrates modern living standards with Type IIIA/IA construction and efficient open-space planning.'
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
    title: [ "Pico ","Center"], // 数组格式：支持精准控制两行排版
    year: "2024",
    category: "Mixed-Use",
    ringImage: "/11580-pico-blvd/1.webp",
    mainImage: "/11580-pico-blvd/1.webp",
    description: "A 6-story Density Bonus project featuring 65 residential units and 6,200+ sqft of ground-floor commercial space, designed to densify the Pico Boulevard corridor.",    mainImage: "/11580-pico-blvd/1.webp",
    location: "Los Angeles, CA",
    sector: "Residential & Retail",
    status: "DD Phase / Permitting",
    scale: "69,455 sqft Total",
    architect: "Plus Architect", 
    contribution: "DD Documentation / 3D Visualization",
    content: [
       {
      type: 'textBlock',
      title: 'Project Framework',
      text: 'The development maximizes urban land use with 3 levels of subterranean parking and 69,455 sqft of total floor area. It balances high-density housing with Type III-A over Type I-A construction, prioritizing street-level commercial engagement.'
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
    category: "Speculative High-Rise",
    ringImage: "/vertical-shanghai/1.webp", 
    mainImage: "/vertical-shanghai/1.webp",
    description: "A data-driven vertical prototype for Shanghai that translates traditional urban fabric into a fluid, mixed-use skyscraper featuring an adaptive UAV-integrated shading system",
    mainImage: "/vertical-shanghai/1.webp",
    location: "Shanghai, China",
    sector: "Mixed-Use (Residential / Office / Hotel)",
    status: "Design Research / Competition Phase",
    scale: "Super-tall Prototype",
    architect: "Independent Research", 
    contribution: "Parametric Morphology, Environmental Simulation, Data Analysis",
    content: [
      {
      type: 'textBlock',
      title: 'Vertical Urbanism',
      text: 'The project investigates a strategy of generating vertical cities directly from existing urban blocks. It synthesizes residential, commercial, and public functions into a high-rise typology that responds to Shanghai’s unique cultural and spatial complexity.'
      },
      {
      type: 'textBlock',
      title: 'Kinetic Sustainability',
      text: 'Driven by solar radiation analysis, the design introduces an autonomous shading system utilizing unmanned aerial vehicle (UAV) technology. This creates a transformable facade that optimizes lighting and thermal performance throughout the seasons.'
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
    mainImage: "/digital-escape/1.webp",
    description: "A cinematic exploration of digital immortality, where a 'soul cache' satellite network archives human existence amidst an impending global catastrophe and a clandestine power struggle",
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
  },
  {
    id: "local-ai-deploy", 
    title: ["AI", "Generative","Workflow"], // 数组格式：支持精准控制两行排版
    year: "2026",
    category: "AI Generation / Architectural Visualization",
    ringImage: "/local-ai-deploy/1.webp", 
    description: "A modular ComfyUI workflow leveraging the FLUX model to bridge the gap between architectural conceptualization and high-fidelity visualization.",
    mainImage: "/local-ai-deploy/1.webp",
    location: "Digital",
    sector: "Architectural Design Technology",
    status: "Workflow Developed / In Use",
    scale: "-",
    architect: "-", 
    contribution: "Node Graph Design / FLUX Implementation / Pipeline Integration",
    content: [
      {
        type: 'textBlock',
        title: 'Project Description',
        text: 'This project documents the establishment of a high-precision generative AI workflow tailored specifically for architectural design. Moving away from "black-box" generation, this approach utilizes the node-based architecture of ComfyUI alongside the advanced FLUX transformer model to achieve granular control over the output. The central goal is to create a pipeline where architectural intent (perspective, scale, and form) is preserved while harnessing the creative potential of AI for materiality, lighting, and atmospheric context. This digital workspace represents a shift from linear rendering to iterative, modular design generation.'
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        customTitle: "ComfyUI Node Graph",    // 【新参数】覆盖左侧的 "Plate Index"
        labels: ["Two Images Combination FLUX Workflow"],   // 【新参数】覆盖右侧的 "01"
        images: ['/local-ai-deploy/2.webp']
      },
      {
        type: 'imageGrid',
        columns: 1, // 一张图占据 100% 宽度
        customTitle: "ComfyUI Node Graph",    // 【新参数】覆盖左侧的 "Plate Index"
        labels: ["One Images Edit FLUX Workflow"],   // 【新参数】覆盖右侧的 "01"
        images: ['/local-ai-deploy/3.webp']
      },
      
       
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