import {approvedHTML,approvedSample} from './approved.js';
export const legacySample = {
 brand: 'YOUR STUDIO', theme: 'editorial', ratio: 'portrait', accent: '#de5538',
 slides: [
 {kind:'cover',eyebrow:'CONTENT DESIGN / 01',title:'좋은 콘텐츠를\n넘겨보게 만드는 법',body:'읽히는 카드뉴스를 위한\n작고 확실한 4가지 기준'},
 {kind:'statement',eyebrow:'01 · 시작',title:'첫 장에는\n하나의 약속만',body:'누구를 위한 글인지, 무엇을 얻을 수 있는지 알려주세요.\n\n모든 내용을 첫 장에 설명할 필요는 없습니다.'},
 {kind:'number',eyebrow:'02 · 구성',title:'한 장에\n한 가지 이야기',body:'긴 문단은 작은 단위로 나눠주세요.\n\n제목은 핵심을 말하고, 본문은 그 핵심을 구체적으로 설명합니다.'},
 {kind:'statement',eyebrow:'03 · 호흡',title:'여백도\n콘텐츠입니다',body:'글자를 더 넣기 전에 한 문장을 덜어보세요.\n\n중요한 문장과 나머지 문장의 크기를 다르게 하면 읽는 순서가 생깁니다.'},
 {kind:'number',eyebrow:'04 · 일관성',title:'디자인의 규칙을\n반복하세요',body:'같은 색, 같은 글꼴, 같은 위치.\n\n반복되는 규칙은 제작 시간을 줄이고 브랜드의 인상을 만듭니다.'},
 {kind:'cta',eyebrow:'MAKE IT YOURS',title:'다음 콘텐츠에\n바로 적용해보세요',body:'저장해두고 제작할 때 확인하세요.\n나만의 주제로 바꿔 첫 카드뉴스를 만들어보세요.'}
 ]
};
export const sample = approvedSample;
export function validate(value){
 if(!value || !Array.isArray(value.slides)||value.slides.length<2||value.slides.length>12) throw Error('카드는 2~12장이어야 합니다.');
 const str=(v,n)=>typeof v==='string'&&v.length<=n;
 for(const key of ['series','photoLabel'])if(value[key]!==undefined&&!str(value[key],60))throw Error('분류 이름은 60자 이내로 입력하세요.');
 if(!str(value.brand,60)) throw Error('브랜드명은 60자 이내로 입력하세요.');
 if(!['approved','editorial','midnight','paper'].includes(value.theme)) throw Error('지원하지 않는 테마입니다.');
 if(!['portrait','square'].includes(value.ratio)) throw Error('지원하지 않는 비율입니다.');
 if(!/^#[0-9a-f]{6}$/i.test(value.accent)) throw Error('색상 형식이 잘못되었습니다.');
 if(value.instagram!==undefined && (typeof value.instagram!=='string'||!/^@?[A-Za-z0-9._]{0,30}$/.test(value.instagram))) throw Error('아이디는 영문, 숫자, 점, 밑줄로 30자 이내 입력하세요.');
 for(const s of value.slides){
 if(s.imageAsset && !['hero','single'].includes(s.imageAsset)) throw Error('알 수 없는 샘플 이미지입니다.');
 for(const key of ['rules','action','closing']) if(s[key]!==undefined&&!str(s[key],key==='rules'?600:100))throw Error('목록 또는 마무리 문구가 너무 깁니다.');
 if(!str(s.title,110)||!s.title.trim()||!str(s.body,650)||!str(s.eyebrow,80)||!['cover','statement','number','cta'].includes(s.kind)) throw Error('카드 제목(1~110자), 본문(650자 이내), 분류를 확인하세요.');
 if(s.image && (!str(s.image,7000000)||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s.image))) throw Error('PNG, JPEG, WebP 이미지만 지원합니다.');
 }
 return value;
}
export function draft(topic, source, brand,cta){
 if(!topic.trim())throw Error('주제를 입력하세요.');
 if(topic.trim().length>110)throw Error('주제는 110자 이내로 입력하세요.');
 const text=source.trim();
 if(!text)throw Error('카드에 담을 원문을 입력하세요. AI 원고가 필요하면 원고 프롬프트를 사용하세요.');
 if(text.length>5000)throw Error('원문은 5,000자 이내로 입력하세요.');
 const paragraphs=text.split(/\n\s*\n/).filter(Boolean);
 const chunks=[];
 for(const p of paragraphs){
 let rest=p;
 while(rest.length>300){let cut=rest.lastIndexOf(' ',300);if(cut<100)cut=300;chunks.push(rest.slice(0,cut));rest=rest.slice(cut).trim();}if(rest)chunks.push(rest);
 }
 if(chunks.length>10)throw Error('본문이 10장을 초과합니다. 내용을 줄여주세요.');
 return validate({...sample,brand:brand||'YOUR STUDIO',slides:[{kind:'cover',eyebrow:'NEW STORY',title:topic.trim(),body:'핵심 내용을 한 장씩 살펴보세요.'},...chunks.map((p,i)=>{const lines=p.split('\n');return {kind:i%2?'number':'statement',eyebrow:`${String(i+1).padStart(2,'0')} · 핵심 내용`,title:lines[0].length<=65&&lines.length>1?lines.shift():`핵심 포인트 ${i+1}`,body:lines.join('\n')};}),{kind:'cta',eyebrow:'NEXT STEP',title:'다음 행동으로\n이어가세요',body:cta||'도움이 되었다면 저장하고 다음 콘텐츠에서 다시 만나요.'}]});
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function cardHTML(project,s,i){if(project.theme==='approved')return approvedHTML(project,s,i);return `<article class="card ${project.theme} ${s.kind} ${project.ratio} ${s.image?'with-image':''}" style="--accent:${project.accent}"><div class="card-top"><span>${escape(project.brand)}</span><span>${String(i+1).padStart(2,'0')} / ${String(project.slides.length).padStart(2,'0')}</span></div><div class="card-content"><div class="eyebrow">${escape(s.eyebrow)}</div><h1>${escape(s.title)}</h1><p>${escape(s.body)}</p>${s.image?`<img class="card-image" src="${s.image}" alt="">`:''}</div><div class="card-bottom"><span>${s.kind==='cta'?'SAVE · SHARE':'SWIPE TO EXPLORE'}</span><span class="arrow">↗</span></div><div class="decoration" aria-hidden="true"></div></article>`;}

// Store repeated images once so multi-card projects fit browser storage.
export function packProject(project){
 const copy=structuredClone(project),images=[];
 for(const slide of copy.slides)if(slide.image){let index=images.indexOf(slide.image);if(index===-1){index=images.length;images.push(slide.image);}slide.storedImage=index;delete slide.image;}
 return {storageVersion:1,project:copy,images};
}
export function unpackProject(saved){
 if(saved.storageVersion!==1)return saved;
 const project=structuredClone(saved.project);
 for(const slide of project.slides)if(slide.storedImage!==undefined){const image=saved.images?.[slide.storedImage];if(typeof image!=='string')throw Error('저장된 이미지를 찾을 수 없습니다.');slide.image=image;delete slide.storedImage;}
 return project;
}
