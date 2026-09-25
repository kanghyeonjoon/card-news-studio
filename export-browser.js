import {cardHTML,packProject} from './core.js';
export async function exportBrowser(project){
 const zip=new JSZip(),host=document.createElement('div');host.style.cssText='position:fixed;left:0;top:0;z-index:-10;pointer-events:none;width:1080px;';document.body.append(host);
 try{await document.fonts.ready;for(let i=0;i<project.slides.length;i++){
 host.innerHTML=cardHTML(project,project.slides[i],i);const card=host.firstElementChild;card.style.transform='none';card.style.width='1080px';card.style.height=project.ratio==='square'?'1080px':'1350px';
 await Promise.all([...card.querySelectorAll('img')].map(im=>im.decode()));
 if(card.scrollHeight>card.clientHeight+2)throw Error(`${i+1}장 문구가 넘칩니다. 문구를 줄여주세요.`);
 const blob=await htmlToImage.toBlob(card,{width:1080,height:project.ratio==='square'?1080:1350,pixelRatio:1,cacheBust:false});if(!blob)throw Error('이미지 생성 실패');zip.file(String(i+1).padStart(2,'0')+'.png',blob);
 }zip.file('project.json',JSON.stringify(packProject(project),null,2));zip.file('caption.txt',project.slides.map(s=>[s.title,s.body].filter(Boolean).join('\n')).join('\n\n'));return await zip.generateAsync({type:'blob'});
 }finally{host.remove();}
}
