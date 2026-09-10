import * as THREE from 'three';

/** Deterministic front shell, outlines and raised controls, all sampled as points. */
export function controller(count:number){
 let seed=48271;
 const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
 const outline=new THREE.Shape();
 outline.moveTo(-1.14,.52);
 outline.bezierCurveTo(-1.48,.55,-1.64,.23,-1.73,-.15);
 outline.bezierCurveTo(-1.83,-.56,-1.99,-1.05,-1.74,-1.22);
 outline.bezierCurveTo(-1.44,-1.45,-1.12,-.81,-.82,-.63);
 outline.bezierCurveTo(-.42,-.54,.42,-.54,.82,-.63);
 outline.bezierCurveTo(1.12,-.81,1.44,-1.45,1.74,-1.22);
 outline.bezierCurveTo(1.99,-1.05,1.83,-.56,1.73,-.15);
 outline.bezierCurveTo(1.64,.23,1.48,.55,1.14,.52);
 outline.bezierCurveTo(.68,.67,-.68,.67,-1.14,.52);
 const polygon=outline.getPoints(100);
 const inside=(x:number,y:number)=>{let yes=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],b=polygon[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)yes=!yes}return yes};
 const pos=new Float32Array(count*3),cloud=new Float32Array(count*3),orbit=new Float32Array(count*3),seeds=new Float32Array(count);
 for(let i=0;i<count;i++){
  const k=i/count;let x=0,y=0,z=0;
  if(k<.46){do{x=(rand()-.5)*3.9;y=rand()*2-.5- .8}while(!inside(x,y));z=.06+Math.sqrt(Math.max(0,1-x*x/4))*.22+(rand()-.5)*.14;
   // Leave dark pockets around raised buttons and sticks.
   if((Math.hypot(x-.58,y+.38)<.235||Math.hypot(x+.58,y+.38)<.235)||Math.abs(x)<.57&&y>-.015&&y<.43){z=-.18}
  }else if(k<.59){const q=rand()*(polygon.length-1),a=polygon[Math.floor(q)],b=polygon[Math.ceil(q)];x=THREE.MathUtils.lerp(a.x,b.x,q%1);y=THREE.MathUtils.lerp(a.y,b.y,q%1);z=(rand()-.5)*.18}
  else if(k<.72){const side=rand()<.5?-1:1,a=rand()*Math.PI*2,r=rand()<.72?.195+rand()*.018:Math.sqrt(rand())*.17;x=side*.58+Math.cos(a)*r;y=-.38+Math.sin(a)*r;z=.28+rand()*.065}
  else if(k<.81){const a=rand()*Math.PI*2,b=Math.floor(rand()*4),cx=1.13+Math.cos(b*Math.PI/2)*.205,cy=.09+Math.sin(b*Math.PI/2)*.205,r=.079+rand()*.014;x=cx+Math.cos(a)*r;y=cy+Math.sin(a)*r;z=.25+rand()*.04}
  else if(k<.89){x=(rand()-.5)*.45;y=(rand()-.5)*.45;if(Math.abs(x)>.072&&Math.abs(y)>.072){x*=.3}x-=1.13;y+=.09;z=.27+rand()*.02}
  else if(k<.985){const edge=rand()<.8;if(edge){const a=rand()*4;if(a<1){x=-.56+a*1.12;y=.43}else if(a<2){x=.56;y=.43-(a-1)*.44}else if(a<3){x=.56-(a-2)*1.12;y=-.01}else{x=-.56;y=-.01+(a-3)*.44}}else{x=(rand()-.5)*1.1;y=rand()*.44-.01}z=.23}
  else{const a=rand()*Math.PI*2,r=Math.sqrt(rand())*.14;x=Math.pow(Math.cos(a),3)*r;y=-.25+Math.pow(Math.sin(a),3)*r;z=.36}
  pos.set([x,y+.27,z],i*3);
  const a=rand()*Math.PI*2,r=2.2+rand()*3.2;
  cloud.set([Math.cos(a)*r,Math.sin(a)*r,(rand()-.5)*5],i*3);
  const t=i/count*Math.PI*2*7,ring=1.25+(rand()-.5)*.18;
  orbit.set([Math.cos(t)*ring,Math.sin(t)*ring,Math.sin(t*3)*.24+(rand()-.5)*.2],i*3);
  seeds[i]=rand();
 }
 const portal=new Float32Array(count*3);
 const star=new Float32Array(count*3),ribbon=new Float32Array(count*3);
 const sizes=new Float32Array(count),opacities=new Float32Array(count),colors=new Float32Array(count*3);
 for(let i=0;i<count;i++){
  const a=rand()*Math.PI*2,r=Math.sqrt(rand()),z=(rand()-.5)*.35;
  star.set([Math.pow(Math.cos(a),3)*r*1.9,Math.pow(Math.sin(a),3)*r*1.9,z],i*3);
  const t=(i/count-.5)*Math.PI*5;
  ribbon.set([Math.sin(t)*1.25, t*.19, Math.cos(t)*.58+(rand()-.5)*.16],i*3);
  const edge=Math.floor(rand()*4),u=rand(),jitter=(rand()-.5)*.09;
  let px=edge===0?-.92+u*1.84:edge===1?.92:edge===2?.92-u*1.84:-.92;
  let py=edge===0?1.48:edge===1?1.48-u*2.96:edge===2?-1.48:-1.48+u*2.96;
  if(i/count>.91){const a=rand()*Math.PI*2,r=Math.sqrt(rand())*.27;px=Math.pow(Math.cos(a),3)*r;py=Math.pow(Math.sin(a),3)*r}
  portal.set([px+jitter,py+jitter,(rand()-.5)*.55],i*3);
  orbit.set([px*1.55,py*.6,(rand()-.5)*.35],i*3);
  sizes[i]=1.65+rand()*2.25;
  const pocket=pos[i*3+2]<0&&i/count<.46;
  opacities[i]=pocket?.15:.55+rand()*.4;
  const white=rand()>.76;
  colors.set(white?[.96,.96,.96]:rand()>.3?[.90,.035,.078]:[.48,0,0],i*3);
 }
 return {portal,pos,cloud,orbit,seeds,star,ribbon,sizes,opacities,colors};
}
