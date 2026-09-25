import {exportBrowser} from './export-browser.js';
import {applyPreset} from './reference-presets.js';
import {sample,validate,draft,cardHTML,packProject,unpackProject} from './core.js';
const $=id=>document.getElementById(id);let project=structuredClone(sample),selected=0,timer;
function notify(message){$('toast').textContent=message;$('toast').style.display='block';clearTimeout(timer);timer=setTimeout(()=>$('toast').style.display='none',5000);}
try{const saved=localStorage.getItem('card-studio-v1');if(saved){project=validate(unpackProject(JSON.parse(saved)));if(!project.designVersion){localStorage.setItem('card-studio-before-v2',saved);if(project.brand==='YOUR STUDIO'&&project.slides[0].title.startsWith('좋은 콘텐츠를'))project=structuredClone(sample);else project={...project,theme:'approved',accent:'#ff86a6',designVersion:2};}}}catch{notify('저장 데이터를 읽지 못해 샘플을 표시합니다.');}
if(project.instagram===undefined)project.instagram='';
function persist(){try{localStorage.setItem('card-studio-v1',JSON.stringify(packProject(project)));$('saveStatus').textContent='이 브라우저에 자동 저장됨';}catch{$('saveStatus').textContent='자동 저장 공간 부족 · JSON으로 저장하세요';}}
function render(edit=true){
 $('preview').innerHTML=cardHTML(project,project.slides[selected],selected);
 const scale=matchMedia('(min-width:1500px)').matches?.48:matchMedia('(max-width:650px)').matches?.3:.4;
 $('preview').style.height=(project.ratio==='square'?1080:1350)*scale+'px';
 $('count').textContent=project.slides.length+'장의 이야기';$('dimensions').textContent=project.ratio==='square'?'1080 × 1080 px':'1080 × 1350 px';
 $('strip').replaceChildren(...project.slides.map((s,i)=>{const b=document.createElement('button');b.className='thumb'+(selected===i?' active':'');b.textContent=String(i+1).padStart(2,'0');const small=document.createElement('small');small.textContent=s.title;b.append(small);b.onclick=()=>{selected=i;render();};return b;}));
 if(edit){for(const key of ['brand','instagram','theme','ratio','accent','skin'])$(key).value=project[key]??'';for(const key of ['kind','eyebrow','title','body','rules','action','closing','art'])$(key).value=project.slides[selected][key]??'';}
 $('editTitle').textContent=String(selected+1).padStart(2,'0')+' 카드 편집';persist();
}
for(const key of ['brand','instagram','theme','ratio','accent','skin'])$(key).addEventListener('input',()=>{project[key]=$(key).value;if(key==='skin'){if(project.skin)project=applyPreset(project,project.skin);else project.accent='#ff86a6';}if(key==='theme'&&project.theme==='approved')project.accent='#ff86a6';render(false);});
for(const key of ['kind','eyebrow','title','body','rules','action','closing','art'])$(key).addEventListener('input',()=>{project.slides[selected][key]=$(key).value;render(false);});
function replace(value){project=validate(value);selected=0;render();}
$('draft').onclick=()=>{try{const value=draft($('topic').value,$('source').value,$('brand').value,$('cta').value);replace({...value,theme:project.theme,ratio:project.ratio,accent:project.accent,instagram:project.instagram||'',designVersion:2});notify('원문을 카드로 구성했습니다. 제목과 흐름을 검토해주세요.');}catch(e){notify(e.message);}};
$('sample').onclick=()=>{if(confirm('현재 편집 내용을 샘플로 바꿀까요? 필요한 경우 프로젝트를 먼저 저장하세요.'))replace(structuredClone(sample));};
$('add').onclick=()=>{if(project.slides.length>=12)return notify('최대 12장까지 지원합니다.');project.slides.splice(selected+1,0,{kind:'statement',eyebrow:'NEW NOTE',title:'새로운 이야기',body:'내용을 입력하세요.'});selected++;render();};
$('delete').onclick=()=>{if(project.slides.length<=2)return notify('최소 2장이 필요합니다.');project.slides.splice(selected,1);selected=Math.min(selected,project.slides.length-1);render();};
for(const [id,delta]of [['prev',-1],['next',1]])$(id).onclick=()=>{const next=selected+delta;if(next<0||next>=project.slides.length)return;[project.slides[selected],project.slides[next]]=[project.slides[next],project.slides[selected]];selected=next;render();};
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);}
$('save').onclick=()=>download(new Blob([JSON.stringify(project,null,2)],{type:'application/json'}),'card-project.json');
$('load').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>25000000)throw Error('프로젝트는 25MB 이하여야 합니다.');replace(JSON.parse(await file.text()));notify('프로젝트를 불러왔습니다.');}catch(e){notify(e.message);}finally{$('load').value='';}};
$('image').onchange=async e=>{const index=selected;try{const file=e.target.files[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5000000)throw Error('5MB 이하 PNG, JPEG, WebP 파일을 선택하세요.');const reader=new FileReader();reader.onload=()=>{if(project.slides[index]){project.slides[index].image=reader.result;delete project.slides[index].imageAsset;render();}};reader.readAsDataURL(file);}catch(e){notify(e.message);}finally{$('image').value='';}};
$('removeImage').onclick=()=>{delete project.slides[selected].image;delete project.slides[selected].imageAsset;render();};
$('export').onclick=async()=>{const b=$('export');try{validate(project);b.disabled=true;b.textContent='이미지 만드는 중…';const blob=await exportBrowser(project);download(blob,'card-news.zip');notify('PNG 이미지와 편집용 JSON, 캡션을 ZIP으로 저장했습니다.');}catch(e){notify(e.message);}finally{b.disabled=false;b.textContent='PNG 전체 다운로드 ↗';}};
$('prompt').onclick=async()=>{const prompt=`한국어 인스타그램 카드뉴스 원고를 작성하세요.\n주제: ${$('topic').value||'사용자가 정할 주제'}\n자료: ${$('source').value||'사용자에게 사실 근거가 될 자료를 요청하세요.'}\nCTA: ${$('cta').value||'저장과 공유'}\n자료에 없는 수치, 후기, 효능, 사례를 만들지 마세요. 자료가 부족하면 먼저 질문하세요. 표지-핵심내용-마무리 순서 5~8장. 한 장에 한 메시지, 제목 35자 이내, 본문 180자 이내. 아래 JSON 구조만 출력하세요. slides의 kind는 cover, statement, number, cta 중 하나입니다.\n{"slides":[{"kind":"cover","eyebrow":"짧은 분류","title":"제목","body":"본문"}]}`;try{await navigator.clipboard.writeText(prompt);notify('프롬프트를 복사했습니다. AI 대화에 붙여넣고 결과를 가져오세요.');}catch{$('ai').value=prompt;notify('클립보드에 접근하지 못해 원고 입력란에 프롬프트를 표시했습니다.');}};
$('importAI').onclick=()=>{try{const raw=$('ai').value.trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,'');const data=JSON.parse(raw);replace({...project,slides:data.slides});notify('AI 원고를 적용했습니다. 사실과 문구를 검토하세요.');}catch(e){notify('원고를 확인하세요: '+e.message);}};
window.addEventListener('resize',()=>render(false));render();
