import { projects } from '@/data/projects'
import Link from 'next/link'

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const project = projects.find(p => p.id === id);

  if (!project) return <div className="p-20 text-white">Not Found</div>;

  return (
    <div className="min-h-screen bg-white text-black">
      <Link href="/" className="fixed top-8 left-8 z-50 font-bold underline">← BACK</Link>
      
      <div className="max-w-4xl mx-auto pt-32 px-6 pb-20">
        <h1 className="text-6xl font-black uppercase mb-10">{project.title}</h1>
        
        {/* 主图：设置最大高度防止占满全屏 */}
        <div className="w-full h-[60vh] rounded-2xl overflow-hidden bg-gray-100 mb-16">
          <img src={project.mainImage} className="w-full h-full object-cover" />
        </div>

        <p className="text-2xl font-light leading-relaxed mb-20">
          {project.description}
        </p>

        <div className="grid grid-cols-1 gap-10">
          {project.gallery.map((img, i) => (
            <img key={i} src={img} className="w-full rounded-lg shadow-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}