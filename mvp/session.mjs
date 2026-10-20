import {footprint,validateLayout} from './engine.mjs';
// Restore product facts from the catalogue and recheck saved geometry against them.
export function restorePlan(saved,catalogue){
 if(!saved||!Array.isArray(saved.items)||!Array.isArray(saved.layout?.objects)||!Number.isFinite(saved.budget)||saved.budget<0)return null;
 const room=saved.room;
 if(!room||!Number.isFinite(room.input_area_m2)||room.input_area_m2<=0||!Number.isFinite(room.w)||!Number.isFinite(room.d)||Math.abs(room.w*room.d/10000-room.input_area_m2)>.02)return null;
 if(new Set(saved.items).size!==saved.items.length)return null;
 const items=saved.items.map(id=>catalogue.find(p=>p.product_id===id));
 if(items.some(p=>!p||!footprint(p))||items.length!==saved.layout.objects.length)return null;
 const objects=saved.layout.objects.map(o=>({...o}));
 if(new Set(objects.map(o=>o.id)).size!==objects.length||new Set(objects.map(o=>o.product_id)).size!==objects.length)return null;
 for(const o of objects){const p=items.find(p=>p.product_id===o.product_id);if(!p||!o.id)return null;const size=footprint(p),r=o.rotation||0;if(![0,90,180,270].includes(r))return null;
 if(Math.abs(o.w-(r%180?size.d:size.w))>.01||Math.abs(o.d-(r%180?size.w:size.d))>.01)return null;
 o.category=p.browse_category||p.category;
 }
 const check=validateLayout(objects,room);if(!check.ok)return null;
 const total=Math.round(items.reduce((s,p)=>s+(Number.isFinite(p.price_hkd)?p.price_hkd:0),0)*100)/100;
 return {items,room,budget:saved.budget,style:saved.style==='复古经典'?'美式现代经典':saved.style,preferences:saved.preferences||{},total,layout:{objects,reserved:check.reserved}};
}
