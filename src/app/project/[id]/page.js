"use client"
import React, { use, useEffect, useRef, useState } from 'react'
import { projects } from '@/data/projects'
import Link from 'next/link'
import styles from './project.module.css'
import Lenis from 'lenis'

// --- 【子组件：处理带延迟循环的视频】 ---
const DelayedVideo = ({ src, className, onLoadedData }) => {
  const videoRef = useRef(null);

  const handleEnded = () => {
    // 视频结束时，等待 3000ms (3秒) 再播放
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 3000);
  };

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      onEnded={handleEnded}
      onLoadedData={onLoadedData}
      className={className}
    />
  );
};

export default function ProjectPage({ params }) {
  const resolvedParams = use(params);
  const project = projects.find(p => p.id === resolvedParams.id);
  
  const requestRef = useRef();
  const viewportRef = useRef();
  const lenisRef = useRef();

  // 1. Lenis 滚动引擎 + 动态高度 Resize
  useEffect(() => {
    if (!project) return;
    const lenis = new Lenis({
      wrapper: viewportRef.current,
      content: document.querySelector(`.${styles.container}`),
      duration: 1.8,
      lerp: 0.05,
      smoothWheel: true,
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

  // 2. 曝光动效监视
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add(styles.visible);
        });
      },
      { threshold: 0.05 }
    );
    document.querySelectorAll(`.${styles.revealItem}, .${styles.metaItem}`).forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [project]);

  if (!project) return null;

  const onImageLoad = () => {
    if (lenisRef.current) lenisRef.current.resize();
  };

  return (
    <main className={styles.projectTheme}>
      
      {/* --- 左侧侧边栏 --- */}
      <aside className={styles.sidebar}>
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
          
          <div className={`${styles.revealItem} ${styles.briefingText}`}>
            {project.description}
          </div>

          <div className={`${styles.revealItem} ${styles.heroWrapper}`}>
            <img src={project.mainImage} alt="Hero" className={styles.magazineImg} onLoad={onImageLoad} />
          </div>

          {/* 参数矩阵 (2排3列) */}
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

          {/* 动态内容渲染 */}
          {project.content?.map((block, idx) => {
            // 文字模块
            if (block.type === 'textBlock') {
              return (
                <div key={idx} className={`${styles.revealItem} ${styles.contentSection}`}>
                  <h2 className={styles.moduleHeading}>{block.title}</h2>
                  <p className={styles.moduleText}>{block.text}</p>
                </div>
              );
            }

            // 图片阵列模块
            if (block.type === 'imageGrid') {
  return (
    <div key={idx} className={`${styles.revealItem} ${styles.gridSystem} mb-[15vh]`}>
      {block.images.map((img, i) => (
        <div key={i} className={block.columns === 1 ? styles.colFull : styles.colHalf}>
          <img 
            src={img} 
            alt="" 
            className={`${styles.magazineImg} ${block.hasBorder ? styles.withBorder : ''}`} 
            onLoad={onImageLoad} 
          />
          <div className="mt-4 flex justify-between text-[10px] font-black border-t border-black pt-2 uppercase">
            {/* 优先显示 customTitle，否则显示默认的 Plate Index */}
            <span>{block.customTitle || "Plate Index"}</span>
            
            {/* 优先显示 labels 数组里对应位置的文字，否则显示自动生成的 01, 02... */}
            <span>
              {block.labels && block.labels[i] ? block.labels[i] : `0${i+1}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

            // 【新增】视频嵌入模块 (带 3s 延迟循环)
            if (block.type === 'videoEmbed') {
              return (
                <div key={idx} className={`${styles.revealItem} ${styles.gridSystem} mb-[15vh]`}>
                  <div className={block.columns === 1 ? styles.colFull : styles.colHalf}>
                    <DelayedVideo 
                      src={block.src} 
                      className={styles.magazineImg} 
                      onLoadedData={onImageLoad}
                    />
                    <div className="mt-4 flex justify-between text-[10px] font-black border-t border-black pt-2 uppercase">
                      <span>Motion Sequence</span>
                      <span>3S Interval Loop</span>
                    </div>
                  </div>
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