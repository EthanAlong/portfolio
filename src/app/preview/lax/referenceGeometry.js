import * as THREE from 'three';

// Outline coordinates traced from S2-04 / S2-05, normalized to the
// 1824px-wide reference rendering. Heights and member spacing are illustrative.
// No RVT data is read or embedded in this preview.
const head = [[528,206],[681,206],[721,190],[922,190],[962,206],[1108,206],[1108,326],[1080,326],[1041,357],[881,357],[694,357],[600,326],[528,326]];
const neck = [[694,363],[879,363],[830,480],[830,619],[694,619]];
const middle = [[694,623],[830,623],[830,935],[694,935]];
const end = [[675,940],[848,940],[848,1081],[675,1081]];
const toWorld = ([u,v]) => [(640-v)/29, (u-790)/29];
function inside(p, polygon) {
  let yes = false;
  for (let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
    const a=polygon[i], b=polygon[j];
    if ((a[1]>p[1]) !== (b[1]>p[1]) && p[0] < (b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]) yes=!yes;
  }
  return yes;
}
function build(outline, height, bottom, headhouse=false, opening=null) {
  const poly=outline.map(toWorld), beams=[], columns=[];
  const hole=opening ? { center:toWorld(opening), rx:opening[3]/29, rz:opening[2]/29 } : null;
  const valid=(x,z) => inside([x,z],poly) && (!hole || ((x-hole.center[0])/hole.rx)**2+((z-hole.center[1])/hole.rz)**2>1);
  const add=(a,b,thickness=.045) => {
    const dx=b[0]-a[0], dz=b[1]-a[1];
    beams.push([(a[0]+b[0])/2,0,(a[1]+b[1])/2,Math.hypot(dx,dz),.10,thickness,-Math.atan2(dz,dx)]);
  };
  poly.forEach((p,i)=>add(p,poly[(i+1)%poly.length],.065));
  const xmin=Math.min(...poly.map(p=>p[0])), xmax=Math.max(...poly.map(p=>p[0]));
  const zmin=Math.min(...poly.map(p=>p[1])), zmax=Math.max(...poly.map(p=>p[1]));
  // Clip schematic framing to each traced outline and the actual roof opening.
  function scan(fixed,lo,hi,alongX) {
    let start=null;
    for(let t=lo;t<=hi+.025;t+=.025) {
      const p=alongX?[t,fixed]:[fixed,t];
      if(t<=hi && valid(...p)) { if(start===null) start=t; }
      else if(start!==null) { add(alongX?[start,fixed]:[fixed,start],alongX?[t-.025,fixed]:[fixed,t-.025]);start=null; }
    }
  }
  for(let x=Math.ceil(xmin/.46)*.46;x<xmax;x+=.46) scan(x,zmin,zmax,false);
  for(let z=Math.ceil(zmin/1.38)*1.38;z<zmax;z+=1.38) scan(z,xmin,xmax,true);
  for(let x=Math.ceil(xmin/1.38)*1.38;x<xmax;x+=1.38)
    for(let z=zmin+.10;z<zmax;z+=1.38)
      if(valid(x,z)) columns.push([x,-(height-bottom)/2,z,.065,height-bottom,.065,0]);
  const shape=new THREE.Shape(poly.map(([x,z])=>new THREE.Vector2(x,-z)));
  if(hole) {
    const path=new THREE.Path();
    path.absellipse(hole.center[0],-hole.center[1],hole.rx,hole.rz,0,Math.PI*2,true);
    shape.holes.push(path);
    for(let i=0;i<96;i++) {
      const point=t=>[hole.center[0]+hole.rx*Math.cos(t),hole.center[1]+hole.rz*Math.sin(t)];
      add(point(i*Math.PI/48),point((i+1)*Math.PI/48),.08);
    }
  }
  return {beams,columns,shape,height,head:headhouse};
}
export const referenceLevels = [
  {height:1.0,parts:[build(head,1,0,true),build(neck,1,0),build(end,1,0)]},
  {height:2.8,parts:[build(head,2.8,1,true),build(neck,2.8,1),build(middle,2.8,0),build(end,2.8,1)]},
  {height:4.2,parts:[build(head,4.2,2.8,true),build(neck,4.2,2.8,false,[788,493,43,58]),build(middle,4.2,2.8),build(end,4.2,2.8)]},
  {height:5.6,parts:[build(head,5.6,4.2,true),build(neck,5.6,4.2,false,[788,493,28,28])]},
];
