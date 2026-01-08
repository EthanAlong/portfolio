"use client"
import React, { useEffect, useState, useRef, use } from 'react'
import { projects } from '@/data/projects'
import Link from 'next/link'

export default function ProjectPage({ params }) {
  const resolvedParams = use(params);
  const project = projects.find(p => p.id === resolvedParams.id);

  if (!project) return <div className="p-20 bg-white min-h-screen text-black font-bold uppercase tracking-widest">Project Loading...</div>;

  return (
    // 【关键修复 1】：items-start 是让 sticky 生效的核心
    <main className="relative flex flex-col md:flex-row min-h-screen bg-white text-black items-start overflow-visible">
      
      {/* --- 左侧：黄金分割固定栏 (38.2%) --- */}
      {/* 【关键修复 2】：h-screen + sticky 确保文字锁定在左侧不随页面滑走 */}
      <aside className="w-full md:w-[38.2%] md:h-screen md:sticky md:top-0 p-8 md:p-16 flex flex-col justify-between bg-white border-r border-gray-100 z-20">
        <div>
          <Link href="/" className="inline-block mb-20 text-[10px] font-black tracking-[0.4em] uppercase hover:line-through">
            ← ARCHIVE
          </Link>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter mb-12">
            {project.title}
          </h1>
          
          <div className="space-y-12">
            <div className="max-w-xs border-t-2 border-black pt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4">Design Intent</p>
              <p className="text-sm leading-relaxed text-gray-700 font-light italic">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-0">
          <Link href="/" className="text-3xl font-black border-b-4 border-black pb-1 hover:opacity-50">
            INDEX +
          </Link>
        </div>
      </aside>

      {/* --- 右侧：杂志排版流动区 (61.8%) --- */}
      <section className="w-full md:w-[61.8%] bg-white p-4 md:p-16 pt-32 space-y-32">
        
        {/* 杂志模块 A：全宽大图 */}
        <div className="w-full mb-12">
          <img src={project.mainImage} alt="Main" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000" />
        </div>

        {/* 杂志模块 B：杂志感引言文字 */}
        <div className="max-w-2xl py-20 border-y border-gray-100">
          <h2 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter text-black">
            "Spatial complexity driven by computational logic."
          </h2>
        </div>

        {/* 杂志模块 C：混合网格图流 (根据索引自动生成杂志感错落排版) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.gallery && project.gallery.map((img, i) => (
            <div key={i} className={i % 3 === 0 ? "md:col-span-2" : "md:col-span-1"}>
              <div className="bg-gray-50 overflow-hidden">
                <img src={img} alt={`Detail ${i}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="mt-4 text-[9px] uppercase tracking-widest text-gray-400">View / Sequence 0{i + 1}</p>
            </div>
          ))}
        </div>

        {/* 页脚 */}
        <footer className="py-40 text-center border-t border-gray-100">
          <Link href="/" className="text-[10px] font-black tracking-[0.6em] uppercase hover:underline">
            Discovery Next
          </Link>
        </footer>
      </section>
      
    </main>
  )
}