"use client"
import React, { use, useEffect, useRef } from 'react'
import { projects } from '@/data/projects'
import Link from 'next/link'
import styles from './project.module.css'
import Lenis from 'lenis'

export default function ProjectPage({ params }) {
  const resolvedParams = use(params);
  const project = projects.find(p => p.id === resolvedParams.id);
  
  const requestRef = useRef();
  const viewportRef = useRef();
  const lenisRef = useRef();

  // 1. Lenis 滚动引擎
  useEffect(() => {
    if (!project) return;
    const lenis = new Lenis({
      wrapper: viewportRef.current,
      content: document.querySelector(`.${styles.container}`),
      duration: 1.8, lerp: 0.05, smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestRef.current = requestAnimationFrame(raf);
    }
    requestRef.current = requestAnimationFrame(raf);

    const handleResize = () => lenis.resize();
    const resizeInterval = setInterval(handleResize, 1000);
    window.addEventListener('resize', handleResize);

    return () => {
      lenis.destroy();
      clearInterval(resizeInterval);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [project]);

  // 2. 元素曝光动效
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add(styles.visible); });
    }, { threshold: 0.05 });
    document.querySelectorAll(`.${styles.revealItem}, .${styles.metaItem}`).forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [project]);

  if (!project) return null;

  const onImageLoad = () => { if (lenisRef.current) lenisRef.current.resize(); };

  return (
    <main className={styles.projectTheme}>
      
      {/* --- 左侧侧边栏 --- */}
      <aside className={styles.sidebar}>
        {/* 标题置顶容器 */}
        <div className={styles.titleWrapper}>
          <h1 className={styles.projectTitle}>
            {Array.isArray(project.title) ? (
              project.title.map((line, i) => (
                <span key={i} className={styles.titleLine} style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
                  {line}
                </span>
              ))
            ) : (
              <span className={styles.titleLine}>{project.title}</span>
            )}
          </h1>
        </div>

        {/* 底部信息：锁定在视口底部 */}
        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.actionLink}>ALL PROJECTS +</Link>
          <div className={styles.sidebarMetadata}>
            {project.year} / {project.category}
          </div>
        </div>
      </aside>

      {/* --- 右侧视口 --- */}
      <section className={styles.viewport} ref={viewportRef}>
        <div className={styles.container}>
          
          <div className={`${styles.revealItem} ${styles.briefingText}`}>{project.description}</div>

          <div className={`${styles.revealItem} ${styles.heroWrapper}`}>
            <img src={project.mainImage} alt="Hero" className={styles.magazineImg} onLoad={onImageLoad} />
          </div>

          {/* 3. Meta Data 矩阵 (2排3列) */}
          <div className={styles.metaGrid}>
            {[
              { label: "Location", value: project.location },
              { label: "Sector", value: project.sector },
              { label: "Status", value: project.status },
              { label: "Scale", value: project.scale },
              { label: "Architect", value: project.architect },
              { label: "Contribution", value: project.contribution }
            ].map((item, i) => (
              <div key={i} className={styles.metaItem} style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className={styles.metaLabel}>{item.label}</span>
                <span className={styles.metaValue}>{item.value || "—"}</span>
              </div>
            ))}
          </div>

          {/* 4. 动态模块 */}
          {project.content?.map((block, idx) => (
            <div key={idx} className={`${styles.revealItem} ${styles.contentSection}`}>
              {block.type === 'textBlock' ? (
                <div className="mb-[15vh]">
                  <h2 className={styles.moduleHeading}>{block.title}</h2>
                  <p className={styles.moduleText}>{block.text}</p>
                </div>
              ) : (
                <div className={`${styles.gridSystem} mb-[15vh]`}>
                  {block.images.map((img, i) => (
                    <div key={i} className={block.columns === 1 ? styles.colFull : styles.colHalf}>
                      <img src={img} alt="" className={styles.magazineImg} onLoad={onImageLoad} />
                      <div className="mt-4 flex justify-between text-[10px] font-black border-t border-black pt-2 uppercase">
                        <span>Plate Index</span>
                        <span>0{i+1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="h-[25vh]" />
        </div>
      </section>
    </main>
  )
}