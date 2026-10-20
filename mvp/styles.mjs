export const styles=[
 {value:'北欧简约',name:'北欧风',en:'Scandinavian',description:'浅木色、白色与简洁实用的线条。',tags:['北欧'],board:1,x:5.6,y:14.8},
 {value:'日式自然',name:'日式／侘寂风',en:'Japanese / Wabi-sabi',description:'自然材质、低矮轮廓与柔和色调。日式与侘寂仍可进一步细分。',tags:['日式','自然','原木'],board:1,x:95.5,y:14.8},
 {value:'现代简约',name:'现代简约',en:'Modern',description:'线条清晰、配色克制，重视功能。',tags:['现代','简约'],board:1,x:5.6,y:84.3},
 {value:'现代轻奢',name:'轻奢风',en:'Contemporary Luxury',description:'精致材质、金属细节与重点装饰。',tags:['轻奢','金属'],board:1,x:95.5,y:84.3},
 {value:'工业风',name:'工业风',en:'Industrial',description:'金属、深色木材与鲜明的结构线条。',tags:['工业'],board:2,x:5,y:0},
 {value:'美式现代经典',name:'美式／现代经典',en:'American / Transitional',description:'温暖木色、经典轮廓与舒适的空间层次。',tags:['美式','经典','复古'],board:2,x:97,y:0}
];
export function styleScore(product,style){if(['混搭','不确定',''].includes(style))return 0;const chosen=styles.find(s=>s.value===style)||(style==='复古经典'?styles[5]:null);const tags=product.style_tags||[];return tags.filter(t=>(chosen?.tags||[style]).some(k=>t.includes(k))).length;}
