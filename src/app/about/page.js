"use client"
import React from 'react'
import Image from 'next/image' // 引入 Image 组件
import Link from 'next/link'   // 引入 Link 组件
import styles from '../project/[id]/project.module.css'

export default function AboutPage() {
  return (
    <main className={styles.projectTheme}>
      <aside className={styles.sidebar}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.projectTitle}>
            <span className={styles.titleLine}>I AM</span>
            <span className={styles.titleLine}>ETHAN</span>
          </h1>
        </div>
        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarMetadata}>COMPUTATIONAL ARCHITECT</div>
          <div className={styles.sidebarMetadata}>ZONING STRATEGIST</div>
        </div>
      </aside>

      <section className={styles.viewport}>
        <div className={styles.container}>
          {/* 核心宣言 */}
          <div className={`${styles.revealItem} ${styles.visible} ${styles.briefingText}`}>
            I DECODE COMPLEX URBAN ORDINANCES THROUGH ALGORITHMIC PRECISION TO UNLOCK ARCHITECTURAL POTENTIAL.
          </div>
          
          <div className={styles.metaGrid}>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>Contact</span>
              <span className={styles.metaValue}>ethan_along@outlook.com</span>
              <span className={styles.metaValue}>ethanh@plusarchitects.com</span>
            </div>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>Focus</span>
              <span className={styles.metaValue}>Regulatory Innovation</span>
              <span className={styles.metaValue}>Digital Entitlement</span>
            </div>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>Tech Stack</span>
              <span className={styles.metaValue}>Python / Grasshopper</span>
              <span className={styles.metaValue}>UE5 / React / Three.js</span>
            </div>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>LA Expertise</span>
              <span className={styles.metaValue}>CHIP / TOC / AB 1287</span>
              <span className={styles.metaValue}>Ministerial Review</span>
            </div>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>Education</span>
              <span className={styles.metaValue}>UCLA Architecture & Urban Design</span>
            </div>
            <div className={`${styles.metaItem} ${styles.visible}`}>
              <span className={styles.metaLabel}>Location</span>
              <span className={styles.metaValue}>Los Angeles, CA</span>
            </div>
          </div>

          {/* 第一人称详细文本 */}
          <div className={styles.moduleText}>
            <p style={{marginBottom: '2rem'}}>
              My practice is built on the conviction that the most innovative architectural solutions lie in the 
              <strong> fusion of computational logic and regulatory intelligence</strong>. 
              I don’t just design spaces; I build systems that navigate the intricate parameters of modern city codes. 
            </p>
            <p style={{marginBottom: '2rem'}}>
              At the start of 2026, I have pivoted my focus toward the <strong>Citywide Housing Incentive Program (CHIP)</strong>, 
              using custom-built scripts to automate the feasibility analysis of high-density infill. 
              By integrating <strong>AB 1287 stackable bonuses</strong> into my design workflows, I successfully transition projects 
              from discretionary public hearings into streamlined <strong>Ministerial (By-right) paths</strong>, 
              maximizing density while ensuring technical compliance.
            </p>
            <p>
              Whether I am programming 6-axis robotic arms at UCLA or coordinating structural corrections with LADWP on a 
              150k+ SQFT construction site, my goal is to bridge the gap between high-fidelity digital narrative and the 
              ground-level realities of urban development.
            </p>
          </div>

          {/* --- 【新增：社交二维码链接模块】 --- */}
          <div style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '900', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase', 
              marginBottom: '1.5rem',
              color: '#000',
              opacity: 0.8
            }}>
              Connect
            </h3>
            
            <div style={{ display: 'flex', gap: '2rem' }}>
              {/* LinkedIn QR */}
              <Link href="https://www.linkedin.com/in/yixiang-huang-08b70620a/" target="_blank" rel="noopener noreferrer">
                <div style={{ width: '150px', height: '186px', background: '#f0f0f0', position: 'relative', cursor: 'pointer' }}>
                  {/* 这里放你的二维码图片。暂时用灰色占位，回头你替换 src */}
                  <Image 
                    src="/qrcode-linkedin.png"  // 替换成你的图片路径，例如放在 public 文件夹下
                    alt="LinkedIn QR Code"
                    fill
                    style={{ objectFit: 'cover' }} // 保持图片比例填充
                  />
                </div>
                
              </Link>

            </div>
          </div>

        </div>
      </section>
    </main>
  )
}