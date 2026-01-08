"use client"
import React, { use } from 'react'
import { projects } from '@/data/projects'
import Link from 'next/link'
import styles from './project.module.css'

export default function ProjectPage({ params }) {
  const resolvedParams = use(params);
  const project = projects.find(p => p.id === resolvedParams.id);

  if (!project) return <div style={{ padding: '40px', fontWeight: '900' }}>LOADING ARCHIVE...</div>;

  return (
    <main className={styles.splitRoot}>
      
      {/* --- 左侧仓：侧边栏 --- */}
      <aside className={styles.sidebar} style={{ padding: '4rem 3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link href="/" style={{ 
            marginBottom: '5rem', 
            fontSize: '10px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5em', 
            color: '#000',
            textDecoration: 'none'
          }}>
            ← INDEX
          </Link>
          
          <h1 style={{ 
            fontSize: 'clamp(3rem, 6vw, 6rem)', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            lineHeight: '0.85', 
            letterSpacing: '-0.06em',
            margin: '0 0 3rem 0'
          }}>
            {project.title}
          </h1>

          <div style={{ borderTop: '2px solid #000', paddingTop: '2rem' }}>
            <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>
              Project Narrative
            </p>
            <p style={{ fontSize: '15px', lineHeight: '1.5', color: '#000', fontWeight: '300', fontStyle: 'italic', maxWidth: '320px' }}>
              {project.description}
            </p>
          </div>
        </div>

        <div style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
          DESIGN ARCHIVE / {project.year}
        </div>
      </aside>

      {/* --- 右侧仓：独立滚动内容区 --- */}
      <section className={styles.viewport}>
        <div className={styles.container}>
          
          {/* 模块 A：主视觉图 */}
          <div style={{ width: '100%', marginBottom: '10rem' }}>
            <img src={project.mainImage} alt="Main Visual" className={styles.magazineImg} />
          </div>

          {/* 模块 B：引言文本 */}
          <div style={{ maxWidth: '800px', marginBottom: '10rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1', letterSpacing: '-0.02em' }}>
              "Logic is the new aesthetic in the age of computation."
            </h2>
          </div>

          {/* 模块 C：参数化图片网格 (解决紧贴问题) */}
          {/* 使用标准 CSS Grid 确保间距 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(12, 1fr)', 
            gap: '4rem 2rem', 
            width: '100%' 
          }}>
            {project.gallery && project.gallery.map((img, i) => (
              <div 
                key={i} 
                style={{ gridColumn: i % 3 === 0 ? 'span 12' : 'span 6' }}
              >
                <img src={img} alt="" className={styles.magazineImg} />
                <div style={{ 
                  marginTop: '1rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '9px', 
                  fontWeight: '900', 
                  textTransform: 'uppercase', 
                  borderTop: '1px solid #eee', 
                  paddingTop: '0.5rem' 
                }}>
                  <span>Visual Sequence</span>
                  <span>0{i+1}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 底部导航 */}
          <footer style={{ marginTop: '15rem', paddingBottom: '10rem', textAlign: 'center' }}>
            <Link href="/" style={{ 
              fontSize: '12px', 
              fontWeight: '900', 
              textTransform: 'uppercase', 
              letterSpacing: '0.6em', 
              border: '2px solid #000', 
              padding: '1.5rem 3rem',
              color: '#000',
              textDecoration: 'none'
            }}>
              Next Project →
            </Link>
          </footer>

        </div>
      </section>
      
    </main>
  )
}