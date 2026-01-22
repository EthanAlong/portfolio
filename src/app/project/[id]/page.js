"use client"
import React, { use, useEffect, useRef, useState } from 'react'
import { projects } from '@/data/projects'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './project.module.css'
import Lenis from 'lenis'

/**
 * ============================================================
 * 【 项目详情页配置 】
 * ============================================================
 */
const PAGE_CONFIG = {
  BREAKPOINT: 768,  // 移动端断点
}

/**
 * ============================================================
 * 【 子组件：处理带延迟循环的视频 】
 * ============================================================
 */
const DelayedVideo = ({ src, className, onLoadedData }) => {
  const videoRef = useRef(null)

  const handleEnded = () => {
    // 视频结束时，等待 3000ms (3秒) 再播放
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play()
      }
    }, 3000)
  }

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
  )
}

/**
 * ============================================================
 * 【 主页面组件 】
 * ============================================================
 */
export default function ProjectPage({ params }) {
  const resolvedParams = use(params)
  const project = projects.find(p => p.id === resolvedParams.id)
  const router = useRouter()

  const requestRef = useRef()
  const viewportRef = useRef()
  const lenisRef = useRef()

  // 移动端检测
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < PAGE_CONFIG.BREAKPOINT)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  /**
   * 获取上一个和下一个项目
   */
  const currentIndex = projects.findIndex(p => p.id === resolvedParams.id)
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  /**
   * Lenis 滚动引擎 + 动态高度 Resize
   * 桌面端使用 Lenis 平滑滚动，移动端使用原生滚动
   */
  useEffect(() => {
    if (!project) return
    // 移动端使用原生滚动，不初始化 Lenis
    if (isMobile) return

    const lenis = new Lenis({
      wrapper: viewportRef.current,
      content: document.querySelector(`.${styles.container}`),
      duration: 1.8,
      lerp: 0.05,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestRef.current = requestAnimationFrame(raf)
    }
    requestRef.current = requestAnimationFrame(raf)

    const handleResize = () => lenis.resize()
    const resizeInterval = setInterval(handleResize, 1000)
    window.addEventListener('resize', handleResize)

    return () => {
      lenis.destroy()
      clearInterval(resizeInterval)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(requestRef.current)
    }
  }, [project, isMobile])

  /**
   * 曝光动效监视（Intersection Observer）
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add(styles.visible)
        })
      },
      { threshold: 0.05 }
    )
    document.querySelectorAll(`.${styles.revealItem}, .${styles.metaItem}`).forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [project, isMobile])

  if (!project) return null

  const onImageLoad = () => {
    if (lenisRef.current) lenisRef.current.resize()
  }

  /**
   * 获取标题字符串
   */
  const getTitleString = () => {
    return Array.isArray(project.title) ? project.title.join(' ') : project.title
  }

  /**
   * ============================================================
   * 【 移动端布局 - 单列垂直滚动 】
   * ============================================================
   */
  if (isMobile) {
    return (
      <main className={styles.mobileTheme}>
        {/* 固定导航栏 */}
        <nav className={styles.mobileNav}>
          <button onClick={() => router.push('/')} className={styles.backButton}>
            ← Back
          </button>
          <Link href="/" className={styles.mobileLogo}>
            EthanDigital
          </Link>
        </nav>

        {/* 主内容区 - 自然滚动 */}
        <div className={styles.mobileContent}>
          {/* Hero 区域 */}
          <div className={styles.mobileHero}>
            <img
              src={project.mainImage}
              alt={getTitleString()}
              className={styles.mobileHeroImg}
              onLoad={onImageLoad}
            />
          </div>

          {/* 项目标题 */}
          <div className={styles.mobileTitleSection}>
            <h1 className={styles.mobileTitle}>
              {getTitleString().toUpperCase()}
            </h1>
            <div className={styles.mobileSubtitle}>
              {project.year} / {project.category}
            </div>
          </div>

          {/* Metadata 两列 Grid */}
          <div className={styles.mobileMetaGrid}>
            {[
              { label: "Location", value: project.location },
              { label: "Sector", value: project.sector },
              { label: "Status", value: project.status },
              { label: "Scale", value: project.scale },
              { label: "Architect", value: project.architect },
              { label: "Contribution", value: project.contribution }
            ].map((item, i) => (
              <div key={i} className={styles.mobileMetaItem}>
                <span className={styles.mobileMetaLabel}>{item.label}</span>
                <span className={styles.mobileMetaValue}>{item.value || "—"}</span>
              </div>
            ))}
          </div>

          {/* 项目简介 */}
          <div className={styles.mobileBriefing}>
            <h2 className={styles.mobileSectionTitle}>BRIEFING</h2>
            <p className={styles.mobileBriefingText}>{project.description}</p>
          </div>

          {/* 动态内容渲染 */}
          {project.content?.map((block, idx) => {
            // 文字模块
            if (block.type === 'textBlock') {
              return (
                <div key={idx} className={styles.mobileContentSection}>
                  <h2 className={styles.mobileSectionTitle}>{block.title}</h2>
                  <p className={styles.mobileText}>{block.text}</p>
                </div>
              )
            }

            // 图片阵列模块
            if (block.type === 'imageGrid') {
              return (
                <div key={idx} className={styles.mobileImageGrid}>
                  {block.images.map((img, i) => (
                    <div key={i} className={styles.mobileImageItem}>
                      <img
                        src={img}
                        alt=""
                        className={`${styles.mobileImg} ${block.hasBorder ? styles.withBorder : ''}`}
                        onLoad={onImageLoad}
                      />
                      <div className={styles.mobileCaption}>
                        <span>{block.customTitle || "Plate Index"}</span>
                        <span>{block.labels && block.labels[i] ? block.labels[i] : `0${i + 1}`}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }

            // 视频嵌入模块
            if (block.type === 'videoEmbed') {
              return (
                <div key={idx} className={styles.mobileVideoSection}>
                  <DelayedVideo
                    src={block.src}
                    className={styles.mobileVideo}
                    onLoadedData={onImageLoad}
                  />
                  <div className={styles.mobileCaption}>
                    <span>Motion Sequence</span>
                    <span>3S Interval Loop</span>
                  </div>
                </div>
              )
            }

            // 混合网格模块
            if (block.type === 'mixedGrid') {
              return (
                <div key={idx} className={styles.mobileImageGrid}>
                  {block.items.map((item, i) => (
                    <div key={i} className={styles.mobileImageItem}>
                      {item.type === 'image' && (
                        <>
                          <img
                            src={item.src}
                            alt=""
                            className={`${styles.mobileImg} ${item.hasBorder ? styles.withBorder : ''}`}
                            onLoad={onImageLoad}
                          />
                          <div className={styles.mobileCaption}>
                            <span>{item.customTitle || "Plate Index"}</span>
                            <span>{item.label || `0${i + 1}`}</span>
                          </div>
                        </>
                      )}
                      {item.type === 'video' && (
                        <>
                          <DelayedVideo
                            src={item.src}
                            className={styles.mobileVideo}
                            onLoadedData={onImageLoad}
                          />
                          <div className={styles.mobileCaption}>
                            <span>{item.customTitle || "Motion Sequence"}</span>
                            <span>{item.label || "Loop"}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )
            }

            return null
          })}

          {/* 项目导航 */}
          <div className={styles.mobileProjectNav}>
            {prevProject && (
              <Link href={`/project/${prevProject.id}`} className={styles.mobileNavLink}>
                ← {Array.isArray(prevProject.title) ? prevProject.title[0] : prevProject.title}
              </Link>
            )}
            {nextProject && (
              <Link href={`/project/${nextProject.id}`} className={styles.mobileNavLink}>
                {Array.isArray(nextProject.title) ? nextProject.title[0] : nextProject.title} →
              </Link>
            )}
          </div>

          {/* 底部留白 */}
          <div className={styles.mobileFooterSpace} />
        </div>
      </main>
    )
  }

  /**
   * ============================================================
   * 【 桌面端布局 - 左右两栏 】
   * ============================================================
   */
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
            if (block.type === 'mixedGrid') {
              return (
                <div key={idx} className={`${styles.revealItem} ${styles.gridSystem} mb-[15vh]`}>
                  {block.items.map((item, i) => (
                    <div key={i} className={styles.colHalf}> {/* 强制两列布局，每列占一半 */}
                      
                      {/* 如果是图片 */}
                      {item.type === 'image' && (
                        <>
                          <img 
                            src={item.src} 
                            alt="" 
                            className={`${styles.magazineImg} ${item.hasBorder ? styles.withBorder : ''}`} 
                            onLoad={onImageLoad} 
                          />
                          <div className="mt-4 flex justify-between text-[10px] font-black border-t border-black pt-2 uppercase">
                            <span>{item.customTitle || "Plate Index"}</span>
                            <span>{item.label || `0${i+1}`}</span>
                          </div>
                        </>
                      )}

                      {/* 如果是视频 */}
                      {item.type === 'video' && (
                        <>
                          <DelayedVideo 
                            src={item.src} 
                            className={styles.magazineImg} 
                            onLoadedData={onImageLoad}
                          />
                          <div className="mt-4 flex justify-between text-[10px] font-black border-t border-black pt-2 uppercase">
                            <span>{item.customTitle || "Motion Sequence"}</span>
                            <span>{item.label || "Loop"}</span>
                          </div>
                        </>
                      )}

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