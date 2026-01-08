"use client"
import React, { use } from 'react'
import { projects } from '@/data/projects'
import Link from 'next/link'

export default function ProjectPage({ params }) {
  const resolvedParams = use(params);
  const project = projects.find(p => p.id === resolvedParams.id);

  if (!project) return <div className="p-20 font-black">LOADING...</div>;

  return (
    <main className="split-screen-wrapper">
      
      {/* --- 左侧仓 (Sidebar) --- */}
      <aside className="sidebar-locked p-16">
        <div className="flex flex-col">
          <Link href="/" className="mb-20 text-[10px] font-black tracking-[0.5em] uppercase hover:underline">
            ← RING
          </Link>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter mb-12">
            {project.title}
          </h1>
          <div className="border-t-2 border-black pt-8 max-w-xs">
            <p className="text-[10px] font-black tracking-widest uppercase mb-4">Brief</p>
            <p className="text-base font-light leading-relaxed italic text-gray-800">
              {project.description}
            </p>
          </div>
        </div>
        <div className="text-[10px] font-black tracking-[0.6em] uppercase">
          {project.year} / {project.category}
        </div>
      </aside>

      {/* --- 右侧仓 (Content Viewport) --- */}
      <section className="viewport-scrollable">
        {/* magazine-container 是居中的关键 */}
        <div className="magazine-container">
          
          {/* 模块：首图 */}
          <div className="w-full mb-48">
            <img src={project.mainImage} alt="Hero" className="magazine-img" />
          </div>

          {/* 模块：大字号引言 */}
          <div className="max-w-3xl mb-48">
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter">
              "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
            </h2>
          </div>

          {/* 模块：网格图流 */}
          <div className="grid grid-cols-12 gap-x-12 gap-y-24 md:gap-y-48">
            {project.gallery && project.gallery.map((img, i) => (
              <div 
                key={i} 
                className={i % 3 === 0 ? "col-span-12" : "col-span-6"}
              >
                <img src={img} alt="" className="magazine-img" />
                <div className="mt-4 flex justify-between text-[10px] font-black border-t border-black pt-2">
                  <span>PLATE 0{i+1}</span>
                  <span>{project.location}</span>
                </div>
              </div>
            ))}
          </div>

          <footer className="mt-60 py-20 text-center">
            <Link href="/" className="text-sm font-black tracking-[0.6em] border-2 border-black px-12 py-6 hover:bg-black hover:text-white transition-all">
              NEXT PROJECT
            </Link>
          </footer>
        </div>
      </section>

    </main>
  )
}