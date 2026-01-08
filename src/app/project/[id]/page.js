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

  useEffect(() => {
  if (!project) return;

  // 1. 初始化 Lenis
  const lenis = new Lenis({
    wrapper: viewportRef.current,
    content: document.querySelector(`.${styles.container}`),
    duration: 1.8,
    lerp: 0.05,
    smoothWheel: true,
  });

  // 2. 核心修复：监听图片加载和窗口大小变化
  const handleResize = () => {
    lenis.resize(); // 强制重新计算高度
  };

  // 定时检查：在图片加载的黄金 3 秒内，每隔一段时间刷新一次高度
  // 这能解决图片异步加载导致的滚动死锁
  const resizeInterval = setInterval(handleResize, 1000);

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);

  function raf(time) {
    lenis.raf(time);
    requestRef.current = requestAnimationFrame(raf);
  }
  requestRef.current = requestAnimationFrame(raf);

  // 3. 清理函数
  return () => {
    lenis.destroy();
    clearInterval(resizeInterval);
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(requestRef.current);
  };
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