// src/data/about.js
//
// Single source for the About page (desktop and mobile both read it).
// Facts come from the resume (resume/master.yaml in the private resume
// repo). Public site: no street address, phone or visa status, and the
// current employer is described, not named (same as /engineering).

export const aboutIntro = {
  manifesto: 'I READ HOW THE WORK ACTUALLY FLOWS, THEN BUILD WHAT THE TEAM KEEPS USING.',
  subtitle: ['COMPUTATIONAL ARCHITECT', 'TOOLS · AI · AZURE'],
}

// Paragraphs: plain strings; **bold** is rendered as <strong>.
export const aboutStory = [
  'Architect by training, software engineer since 2022 (C#, Python, TypeScript). My practice is built on the conviction that the most innovative architectural solutions lie in the **fusion of computational logic and regulatory intelligence**. I don’t just design spaces; I build systems that navigate the intricate parameters of modern city codes.',
  'At Plus Architects I worked as computational designer and zoning strategist. In early 2026 I focused on the **Citywide Housing Incentive Program (CHIP)**, using custom-built scripts to automate the feasibility analysis of high-density infill; by integrating **AB 1287 stackable bonuses** into the design workflow, projects moved from discretionary public hearings onto streamlined **ministerial (by-right) paths**.',
  'Whether I am programming 6-axis robotic arms at UCLA or coordinating structural corrections with LADWP on a 150k+ SQFT construction site, my goal is to bridge the gap between high-fidelity digital narrative and the ground-level realities of urban development.',
  'Since April 2026 I have been the senior BIM & computational designer, and the only software engineer, at a structural engineering practice in Los Angeles. I build and run its internal tools: an **AI detail library**, an **RFI agent**, a **Revit add-in suite** and the **Azure platform** under them, eight tools nine people use every day. Same method as on a building: sit with the people doing the work, find the step that costs the most, ship the smallest thing that removes it, and measure whether it stuck.',
]

export const aboutTimeline = [
  { when: '2026 –', what: 'Senior BIM & Computational Designer', where: 'Structural engineering practice, Los Angeles · sole software engineer', current: true },
  { when: '2024 – 26', what: 'Computational Designer & Zoning Strategist', where: 'Plus Architects · Rhino / Grasshopper plugin development' },
  { when: '2023', what: 'Full Stack Developer', where: 'BridgeWater Mortgage Group · DTI-Cal' },
  { when: '2022 –', what: 'Co-Founder & Lead Developer', where: 'LEW ADU Consultant' },
  { when: '2022 – 23', what: 'Technical Support Specialist', where: 'UCLA Architecture & Urban Design' },
  { when: '2022', what: 'M.S. Architecture & Urban Design', where: 'UCLA', edu: true },
  { when: '2020', what: 'B.Arch', where: 'Guangzhou Academy of Fine Arts', edu: true },
]

export const aboutCredentials = [
  'Microsoft Certified: Azure Administrator Associate (AZ-104)',
  'Certificate in Application Programming, UCLA Extension',
  'M.S. Information Studies, Trine University (in progress)',
  'NCARB AXP 2,150+ hours',
]

export const aboutLocation = ['Los Angeles, CA', 'Open to relocation']
