export const styles=[
 {value:'北欧简约',name:'Scandinavian',en:'Scandinavian',description:'Light wood, white tones and clean, practical lines.',tags:['北欧'],board:1,x:5.6,y:14.8},
 {value:'日式自然',name:'Japanese / Wabi-sabi',en:'Japanese / Wabi-sabi',description:'Natural materials, low profiles and a quiet palette.',tags:['日式','自然','原木'],board:1,x:95.5,y:14.8},
 {value:'现代简约',name:'Modern Minimal',en:'Modern',description:'Clear lines, restrained colours and functional choices.',tags:['现代','简约'],board:1,x:5.6,y:84.3},
 {value:'现代轻奢',name:'Contemporary Luxury',en:'Contemporary Luxury',description:'Refined materials, metal details and focused accents.',tags:['轻奢','金属'],board:1,x:95.5,y:84.3},
 {value:'工业风',name:'Industrial',en:'Industrial',description:'Metal, dark timber and clearly expressed structure.',tags:['工业'],board:2,x:5,y:0},
 {value:'美式现代经典',name:'American / Transitional',en:'American / Transitional',description:'Warm wood, classic silhouettes and comfortable layering.',tags:['美式','经典','复古'],board:2,x:97,y:0}
];
export function styleScore(product,style){if(['混搭','不确定',''].includes(style))return 0;const chosen=styles.find(s=>s.value===style)||(style==='复古经典'?styles[5]:null);const tags=product.style_tags||[];return tags.filter(t=>(chosen?.tags||[style]).some(k=>t.includes(k))).length;}
