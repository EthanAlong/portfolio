"use client"
import React from 'react'
import styles from '../project/[id]/project.module.css'

export default function AboutPage() {
  return (
    <main className={styles.projectTheme}>
      <aside className={styles.sidebar}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.projectTitle}>
            <span className={styles.titleLine}>ABOUT</span>
            <span className={styles.titleLine}>ETHAN</span>
          </h1>
        </div>
        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarMetadata}>COMPUTATIONAL ARCHITECT</div>
          <div className={styles.sidebarMetadata}>LA / SHANGHAI</div>
        </div>
      </aside>

      <section className={styles.viewport}>
        <div className={styles.container}>
          {/* 简短介绍 */}
          <div className={`${styles.revealItem} ${styles.visible} ${styles.briefingText}`}>
            BRIDGING THE GAP BETWEEN ALGORITHMIC LOGIC AND ARCHITECTURAL POETICS.
          </div>
          
          {/* 2x3 个人信息矩阵 */}
          <div className={styles.metaGrid}>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>Contact</span>
              <span className={styles.metaValue}>yourname@email.com</span>
            </div>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>Location</span>
              <span className={styles.metaValue}>Los Angeles</span>
            </div>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>Social</span>
              <span className={styles.metaValue}>Instagram / LinkedIn</span>
            </div>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>Education</span>
              <span className={styles.metaValue}>M.Arch, SCI-Arc</span>
            </div>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>Tools</span>
              <span className={styles.metaValue}>Rhino / GH / React</span>
            </div>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>Focus</span>
              <span className={styles.metaValue}>Urban Systems</span>
            </div>
          </div>

          {/* 详细文本 */}
          <div className={styles.moduleText}>
            <p style={{marginBottom: '2rem'}}>
              Ethan is a computational designer and architect based in Los Angeles. 
              His work explores the intersection of high-fidelity rendering, algorithmic design, and interactive web experiences.
            </p>
            <p>
              With a background in both traditional architecture and modern web technologies, 
              he aims to create digital spaces that are as immersive and structured as physical ones.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}