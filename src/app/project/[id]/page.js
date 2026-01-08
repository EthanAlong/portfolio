"use client"
import React, { use } from 'react'
import { projects } from '@/data/projects'
import Link from 'next/link'

export default function ProjectPage({ params }) {
  const resolvedParams = use(params);
  const project = projects.find(p => p.id === resolvedParams.id);

  if (!project) return <div className="p-20 bg-white text-black font-bold uppercase tracking-widest">Loading...</div>;

  return (
    /* 【物理锁定层】：
      1. flexDirection: 'row' 强制左右并排，绝不堆叠。
      2. alignItems: 'flex-start' 确保左侧栏高度不被拉伸，sticky 才能生效。
    */
    <main style={{ 
      display: 'flex', 
      flexDirection: 'row', 
      width: '100%', 
      minHeight: '100vh', 
      backgroundColor: '#fff', 
      alignItems: 'flex-start',
      position: 'relative',
      overflow: 'visible'
    }}>
      
      {/* --- 左侧栏：38.2% 杂志封面感侧边栏 (硬锁定) --- */}
      <aside style={{
        width: '38.2%',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        backgroundColor: '#fff',
        borderRight: '1px solid #eee',
        padding: '4rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0, // 防止被右侧内容挤压
        zIndex: 50
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link href="/" className="mb-20 text-[10px] font-black tracking-[0.4em] uppercase hover:line-through text-black block">
            ← ARCHIVE
          </Link>
          
          <h1 className="text-6xl lg:text-8xl font-black uppercase leading-[0.8] tracking-tighter mb-12 text-black">
            {project.title}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ borderTop: '2px solid black', paddingTop: '1.5rem', maxWidth: '300px' }}>
              <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem', color: '#000' }}>Brief</p>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#444', fontWeight: '300', fontStyle: 'italic' }}>
                {project.description}
              </p>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5em', color: '#000' }}>
          EDITION 2026 / {project.id}
        </div>
      </aside>

      {/* --- 右侧栏：61.8% 杂志化图片流 (硬锁定) --- */}
      <section style={{
        width: '61.8%',
        backgroundColor: '#fff',
        padding: '8rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '12rem', // 图片之间的垂直呼吸间距
        flexGrow: 1
      }}>
        
        {/* 模块：全宽大图 */}
        <div style={{ width: '100%' }}>
          <img 
            src={project.mainImage} 
            alt="Hero" 
            style={{ width: '100%', height: 'auto', display: 'block', grayscale: '100%' }} 
            className="hover:grayscale-0 transition-all duration-1000"
          />
        </div>

        {/* 模块：杂志感引言文本 */}
        <div style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '4rem', fontWeight: '900', textTransform: 'uppercase', lineHeight: '0.9', letterSpacing: '-0.05em', color: '#000' }}>
            "Space is not a void, but a computational field."
          </h2>
        </div>

        {/* 模块：错落有致的图片网格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4rem' }}>
          {project.gallery && project.gallery.map((img, i) => (
            <div key={i} style={{ gridColumn: i % 3 === 0 ? 'span 2' : 'span 1' }}>
              <img 
                src={img} 
                alt={`Detail ${i}`} 
                style={{ width: '100%', height: 'auto', backgroundColor: '#f9f9f9', display: 'block' }} 
              />
              <p style={{ marginTop: '1.5rem', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                Project Detail / Sequence 0{i + 1}
              </p>
            </div>
          ))}
        </div>

        {/* 底部导航 */}
        <footer style={{ paddingTop: '10rem', paddingBottom: '10rem', textAlign: 'center', borderTop: '1px solid #eee' }}>
          <Link href="/" style={{ fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#000', textDecoration: 'none' }} className="hover:underline">
            BACK TO RING →
          </Link>
        </footer>
      </section>
    </main>
  )
}