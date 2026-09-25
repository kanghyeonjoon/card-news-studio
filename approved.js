import {photoStoryHTML} from './photo-story.js';
import {batchHTML} from './batch-art.js';
import {inquiryHTML,inquiryLayouts} from './inquiry-art.js';
import {artHTML,artLayouts} from './art-directed.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const handleOf=p=>(p.instagram||'').trim().replace(/^@/,'');
export const approvedSample={designVersion:2,brand:'CONTENT NOTE',instagram:'',theme:'approved',ratio:'portrait',accent:'#ff86a6',slides:[
 {kind:'cover',eyebrow:'카드뉴스 디자인 노트',title:'좋은 콘텐츠인데,\n**왜 안 넘겨볼까?**',body:'첫 장에서 달라지는 카드뉴스의 인상\n사진 · 제목 · 강조, 세 가지만 바꿔보세요.'},
 {kind:'statement',eyebrow:'첫 장의 역할',title:'설명을 늘리기보다\n**볼 이유를 먼저.**',body:'표지에는 모든 정보를 담지 않아도 됩니다.\n다음 장에서 얻을 것을 한눈에 보여주세요.',rules:'사진은 하나를 크게 | 시선이 머무는 장면\n제목은 짧고 구체적으로 | 읽을 이유가 보이게\n강조색은 핵심에만 | 중요한 단어에 집중'},
 {kind:'cta',eyebrow:'다음 콘텐츠를 만들 때',title:'막막한 첫 장,\n**이 기준부터.**',body:'사진 한 장, 분명한 제목, 하나의 강조.\n좋은 시작은 작은 선택에서 나옵니다.',action:'이 글 저장해두기',closing:'더 많은 콘텐츠는 팔로우해주세요.'}
]};
export function approvedHTML(p,s,i){
 if(['photo-story','brand-end'].includes(s.art))return photoStoryHTML(p,s,i);
 if(['batch-map','batch-compare','batch-sequence','batch-note','batch-check','batch-summary','batch-follow'].includes(s.art))return batchHTML(p,s,i);
 if(inquiryLayouts.includes(s.art))return inquiryHTML(p,s,i);
 if(s.kind!=='cover'&&artLayouts.includes(s.art))return artHTML(p,s,i);
 const kind=s.kind==='cover'?'cover':s.kind==='cta'?'end':'bodycard';const img=s.image||(s.imageAsset?`/sample/${s.imageAsset}.png`:'');
 const title=esc(s.title).replace(/\*\*(.+?)\*\*/gs,'<span class="pink">$1</span>');
 const account=handleOf(p)?'@'+handleOf(p):'';
 const top=`<div class="top"><span class="brand">${esc(p.brand)}</span><span class="tag">${kind==='cover'?esc(p.series||'DESIGN SERIES'):kind==='end'?'SAVE FOR LATER':`${String(i).padStart(2,'0')} / CONTENT NOTE`}</span></div>`;
 const dots=`<span class="pages">${p.slides.map((_,n)=>`<i class="${i===n?'on':''}"></i>`).join('')}</span>`;
 const photo=img?`<img class="photo" src="${esc(img)}" alt="">`:'';
 const rules=s.rules?`<div class="rules">${s.rules.split('\n').filter(l=>l.trim()).map((r,n)=>{const [label,...detail]=r.split('|');return `<div class="rule"><span class="num">${n+1}</span><strong>${esc(label.trim())}</strong><small>${esc(detail.join('|').trim())}</small></div>`;}).join('')}</div>`:'';
 const saveIcon='<div class="save-icon"><svg viewBox="0 0 40 48" fill="none"><path d="M8 5H32V42L20 33L8 42V5Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg></div>';
 const content=`<div class="main card-content">${kind==='end'?saveIcon:''}<div class="kicker">${esc(s.eyebrow)}</div><${kind==='cover'?'h1':'h2'}>${title}</${kind==='cover'?'h1':'h2'}><p class="${kind==='bodycard'?'lead':'sub'}">${esc(s.body)}</p>${kind==='bodycard'?rules:''}${kind==='end'?`<div class="pill">${esc(account||(s.action||'이 글 저장해두기'))} <span>↗</span></div><p class="action">${esc(s.closing||(account?'더 많은 콘텐츠는 팔로우해주세요.':'도움이 되었다면 저장하고 공유해주세요.'))}</p>`:''}</div>`;
 const window=kind==='bodycard'&&img?`<div class="photo-window"><img src="${esc(img)}" alt=""><div class="note">${esc(p.photoLabel||'ONE CARD. ONE MESSAGE.')}</div></div>`:'';
 return `<article class="card approved ${kind} ${p.ratio} ${['editorial','contrast','minimal'].includes(p.skin)?'skin-'+p.skin:''} ${p.edition==='practical'?'practical':''} ${['compare','flow','checklist','poster'].includes(s.layout)?s.layout:''} ${img?'':'no-photo'}" style="--accent:${p.accent}">${kind!=='bodycard'?photo+'<div class="shade"></div>':''}${top}${window}${content}<div class="footer"><span class="account">${esc(account||(kind==='cover'?'옆으로 넘겨보기 →':p.brand))}</span>${dots}</div></article>`;
}
