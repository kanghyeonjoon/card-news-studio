export const presets=[
{id:'editorial',name:'에디토리얼 · 아이보리',color:'#efece5',accent:'#214f45',description:'밝은 본문과 짙은 초록 강조. 사례 설명·전후 비교에 적합.',basis:'스몰브랜더의 사진 표지와 밝은 인터뷰 본문에서 착안',sources:['https://www.instagram.com/p/DZrjiJzHxDr/']},
{id:'contrast',name:'정보형 · 블루',color:'#f3f5f8',accent:'#2453db',description:'흰 바탕, 큰 번호, 파란 핵심 장. 과정·체크리스트에 적합.',basis:'캐릿 피드의 정보별 도표·사진 배치에서 착안',sources:['https://www.instagram.com/careet.official/']},
{id:'minimal',name:'문장형 · 모노',color:'#f7f7f5',accent:'#333333',description:'장식을 줄인 흑백과 큰 문장. 문제 제기·짧은 조언에 적합.',basis:'dating.by.jaeeun의 간결한 본문과 여백에서 착안',sources:['https://www.instagram.com/dating.by.jaeeun/p/Dc6VdMdgUUu/']}
];
export function applyPreset(project,id){const preset=presets.find(x=>x.id===id);if(!preset)throw Error('알 수 없는 디자인 유형');const copy=structuredClone(project);copy.theme='approved';copy.edition='practical';copy.skin=id;copy.accent=preset.accent;return copy;}
