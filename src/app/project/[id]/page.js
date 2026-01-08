"use client"
import React, { use, useEffect, useRef } from 'react'
import { projects } from '@/data/projects'
import Link from 'next/link'
import styles from './project.module.css'
import Lenis from 'lenis'

export default function ProjectPage({ params }) {
  const resolvedParams = use(params);
  const project = projects.find(p => p.id === resolvedParams.id);
  
  // --- 关键定义：动画帧引用与视口引用 ---
  const requestRef = useRef();
  const viewportRef = useRef();
  const lenisRef = useRef();

  // 1. 初始化 Lenis 滚动引擎
  useEffect(() => {
    if (!project) return;

    // 创建 Lenis 实例
    const lenis = new Lenis({
      wrapper: viewportRef.current,
      content: document.querySelector(`.${styles.container}`),
      duration: 1.8,
      lerp: 0.05,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // 滚动动画循环
    function raf(time) {
      lenis.raf(time);
      requestRef.current = requestAnimationFrame(raf);
    }
    requestRef.current = requestAnimationFrame(raf);

    // 解决高度计算错误的函数
    const handleResize = () => {
      lenis.resize();
    };

    // 三重保险：定时刷新、窗口监听
    const resizeInterval = setInterval(handleResize, 1000);
    window.addEventListener('resize', handleResize);

    return () => {
      lenis.destroy();
      clearInterval(resizeInterval);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [project]);

  // 2. 滚动曝光监视器 (Reveal Animation)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.05 } // 露出 5% 即可触发，提高灵敏度
    );

    const elements = document.querySelectorAll(`.${styles.revealItem}, .${styles.metaItem}`);
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [project]);

  if (!project) return null;

  // 图片加载后的回调：强制刷新滚动条高度
  const onImageLoad = () => {
    if (lenisRef.current) {
      lenisRef.current.resize();
    }
  };

  // 3x2 矩阵数据
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
      
      {/* --- 左侧仓 --- */}
      <aside className={styles.sidebar}>
        <h1 className={styles.projectTitle}>
          {project.title}
        </h1>

        <div>
          <Link href="/" className={styles.actionLink}>
            ALL PROJECTS +
          </Link>
          <div className="mt-8 text-[11px] font-black tracking-[0.5em] text-black uppercase opacity-40">
            {project.year} / {project.category}
          </div>
        </div>
      </aside>

      {/* --- 右侧仓 --- */}
      <section className={styles.viewport} ref={viewportRef}>
        <div className={styles.container}>
          
          {/* 1. Briefing */}
          <div className={`${styles.revealItem} ${styles.briefingText}`}>
            {project.description}
          </div>

          {/* 2. Hero Image */}
          <div className={`${styles.revealItem} ${styles.heroWrapper}`}>
            <img 
              src={project.mainImage} 
              alt="Hero" 
              className={styles.magazineImg} 
              onLoad={onImageLoad}
            />
          </div>

          {/* 3. Metadata Grid */}
          <div className={styles.metaGrid}>
            {metaData.map((item, i) => (
              <div 
                key={i} 
                className={styles.metaItem}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className={styles.metaLabel}>{item.label}</span>
                <span className={styles.metaValue}>{item.value || "—"}</span>
              </div>
            ))}
          </div>

          {/* 4. 动态内容模块 */}
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
                    <div 
                      key={i} 
                      className={block.columns === 1 ? styles.colFull : styles.colHalf}
                    >
                      <img 
                        src={img} 
                        alt="" 
                        className={styles.magazineImg} 
                        onLoad={onImageLoad}
                      />
                      <div className="mt-4 flex justify-between text-[10px] font-black border-t border-black pt-2 uppercase">
                        <span>Plate Index</span>
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