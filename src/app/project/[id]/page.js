"use client"
import React, { use, useEffect, useRef } from 'react'
import { projects } from '@/data/projects'
import Link from 'next/link'
import styles from './project.module.css'
import Lenis from 'lenis'

export default function ProjectPage({ params }) {
  const resolvedParams = use(params);
  const project = projects.find(p => p.id === resolvedParams.id);
  const viewportRef = useRef();

  // 1. Lenis 惯性滚动
  useEffect(() => {
    if (!project) return;
    const lenis = new Lenis({
      wrapper: viewportRef.current,
      duration: 1.8,
      lerp: 0.05,
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [project]);

  // 2. 滚动曝光监视器
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll(`.${styles.revealItem}, .${styles.metaItem}`);
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [project]);

  if (!project) return null;

  // --- 【3列 2排 数据定义】 ---
  const metaData = [
    { label: "Location", value: project.location },
    { label: "Sector", value: project.sector },
    { label: "Status", value: project.status },
    { label: "Scale", value: project.scale },
    { label: "Architect", value: project.architect },
    { label: "Contribution", value: project.contribution }
  ];

  return (
    <main className={styles.projectTheme}>
      
      <aside className={styles.sidebar}>
        <h1 className={styles.projectTitle}>{project.title}</h1>
        <div>
          <Link href="/" className={styles.actionLink}>ALL PROJECTS +</Link>
          <div className="mt-8 text-[11px] font-black tracking-[0.5em] text-black uppercase opacity-40">
            {project.year} / {project.category}
          </div>
        </div>
      </aside>

      <section className={styles.viewport} ref={viewportRef}>
        <div className={styles.container}>
          
          {/* 1. Briefing */}
          <div className={`${styles.revealItem} ${styles.briefingText}`}>
            {project.description}
          </div>

          {/* 2. Hero Image */}
          <div className={`${styles.revealItem} ${styles.heroWrapper}`}>
            <img src={project.mainImage} alt="Hero" className={styles.magazineImg} />
          </div>

          {/* 3. Metadata Grid (3列 x 2排) */}
          <div className={styles.metaGrid}>
            {metaData.map((item, i) => (
              <div 
                key={i} 
                className={styles.metaItem}
                style={{ transitionDelay: `${i * 0.12}s` }} // 逐个划入动画
              >
                <span className={styles.metaLabel}>{item.label}</span>
                <span className={styles.metaValue}>{item.value || "—"}</span>
              </div>
            ))}
          </div>

          {/* 4. 动态内容模块解算 */}
          {project.content?.map((block, idx) => {
            if (block.type === 'textBlock') {
              return (
                <div key={idx} className={`${styles.revealItem} ${styles.contentSection}`}>
                  <h2 className={styles.moduleHeading}>{block.title}</h2>
                  <p className={styles.moduleText}>{block.text}</p>
                </div>
              );
            }
            if (block.type === 'imageGrid') {
              return (
                <div key={idx} className={`${styles.revealItem} ${styles.gridSystem} mb-[20vh]`}>
                  {block.images.map((img, i) => (
                    <div key={i} className={block.columns === 1 ? styles.colFull : styles.colHalf}>
                      <img src={img} alt="" className={styles.magazineImg} />
                      <div className="mt-4 flex justify-between text-[10px] font-black border-t border-black pt-2 uppercase">
                        <span>Detail Plate</span>
                        <span>0{i+1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          })}

          <div className="h-[25vh]" />
        </div>
      </section>

    </main>
  )
}