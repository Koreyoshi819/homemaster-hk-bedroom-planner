import {satisfiesHard,preferenceScore} from './profile.mjs';
import {styleScore} from './styles.mjs';
export const categories=['bed','nightstand','desk'];
export function eligible(p){return categories.includes(p.category)&&p.channel==='IKEA'&&p.image&&p.url&&Number.isFinite(p.price_hkd)&&p.price_hkd>0&&['width','depth','height'].every(k=>Number.isFinite(p.dimensions_cm?.[k])&&p.dimensions_cm[k]>0)&&!(/缺货|售罄|冲突/.test(p.stock||''))&&(p.category!=='bed'||p.source_id==='ikea_malm');}
export function place(items, room){
 const [bed,night,desk]=items; if(!bed||!night||!desk)return null;
 const dim=p=>p.dimensions_cm;
 const b={id:'object-bed',product_id:bed.product_id,x:60,y:0,w:dim(bed).width,d:dim(bed).depth};
 const n={id:'object-nightstand',product_id:night.product_id,x:60+b.w,y:0,w:dim(night).width,d:dim(night).depth};
 const t={id:'object-desk',product_id:desk.product_id,x:room.w-dim(desk).width,y:room.d-dim(desk).depth,w:dim(desk).width,d:dim(desk).depth};
 const objects=[b,n,t]; const check=validateLayout(objects,room);
 return check.ok?{objects,reserved:check.reserved}:null;
}
export function recommend(catalogue,room,budget,style,profile={}){
 if(!Number.isFinite(budget)||budget<0||!Number.isFinite(room.w)||!Number.isFinite(room.d)||room.w<1||room.d<1)return null;
 const pool=categories.map(c=>catalogue.filter(p=>eligible(p)&&p.category===c&&satisfiesHard(p,profile))); let best=null;
 for(const b of pool[0])for(const n of pool[1])for(const d of pool[2]){
 const items=[b,n,d], total=Math.round(items.reduce((s,p)=>s+p.price_hkd,0)*100)/100, layout=place(items,room);
 if(!layout||total>budget)continue;
 const score=items.reduce((s,p)=>s+styleScore(p,style)+preferenceScore(p,profile),0);
 if(!best||score>best.score||score===best.score&&total<best.total)best={items,total,layout,score};
 }return best;
}

export function validateLayout(objects,room){
 if(!room||![room.w,room.d].every(v=>Number.isFinite(v)&&v>0)||!Array.isArray(objects))return {ok:false,reason:'房间尺寸无效'};
 const overlap=(a,b)=>a.x<b.x+b.w-.01&&a.x+a.w>b.x+.01&&a.y<b.y+b.d-.01&&a.y+a.d>b.y+.01;
 if(objects.some(a=>![a.x,a.y,a.w,a.d].every(Number.isFinite)||a.w<=0||a.d<=0||a.x<0||a.y<0||a.x+a.w>room.w+.01||a.y+a.d>room.d+.01))return {ok:false,reason:'家具超出房间边界'};
 if(objects.some((a,i)=>objects.slice(i+1).some(b=>a.category!=='rug'&&b.category!=='rug'&&overlap(a,b))))return {ok:false,reason:'家具之间发生重叠'};
 const desks=objects.filter(a=>a.id==='object-desk'||a.category==='desk'||a.category==='vanity');
 const clearances=desks.map(desk=>{const r=desk.rotation||0,c=desk.category==='vanity'?60:75;return r===0?{x:desk.x,y:desk.y-c,w:desk.w,d:c}:r===90?{x:desk.x+desk.w,y:desk.y,w:c,d:desk.d}:r===180?{x:desk.x,y:desk.y+desk.d,w:desk.w,d:c}:{x:desk.x-c,y:desk.y,w:c,d:desk.d};});
 const reserved=[{x:0,y:room.d-90,w:90,d:90},{x:0,y:room.d-180,w:60,d:90},...clearances];
 if(clearances.some(c=>c.x<0||c.y<0||c.x+c.w>room.w+.01||c.y+c.d>room.d+.01))return {ok:false,reason:'桌前需要留出使用空间'};
 if(objects.some(a=>a.category!=='rug'&&reserved.some((b,i)=>!(i>=2&&a.category==='office_chair')&&overlap(a,b))))return {ok:false,reason:'占用了门口、通道或桌前预留区'};
 return {ok:true,reserved};
}
export function substitute(layout,product,room,targetProductId){
 if(!footprint(product))return null;
 const target=layout.objects.find(o=>targetProductId?o.product_id===targetProductId:o.id==='object-'+product.category);if(!target)return null;
 if(target.category && target.category!==(product.browse_category||product.category))return null;
 const objects=layout.objects.map(a=>{
 if(a.id!==target.id)return {...a};
 const size=footprint(product);if(!size)return a;const rotated=(a.rotation||0)%180!==0,w=rotated?size.d:size.w,d=rotated?size.w:size.d;
 // Keep a wall anchor when resizing a wall-aligned item.
 const x=Math.abs(a.x+a.w-room.w)<.1?room.w-w:a.x,y=Math.abs(a.y+a.d-room.d)<.1?room.d-d:a.y;
 return {...a,category:product.browse_category||product.category,product_id:product.product_id,x,y,w,d};});
 const check=validateLayout(objects,room);return check.ok?{objects,reserved:check.reserved}:null;
}

export function footprint(p){
 const installed=p.raw?.installed_footprint_cm;
 const w=installed?.width??p.dimensions_cm?.width,d=installed?.depth??p.dimensions_cm?.depth;
 return Number.isFinite(w)&&Number.isFinite(d)&&w>0&&d>0?{w,d}:null;
}
export function addToLayout(layout,p,room){
 if(!validateLayout(layout.objects,room).ok)return null;
 const size=footprint(p);if(!size)return null;
 const id='object-'+p.product_id;
 for(const rotation of [0,90]){const w=rotation?size.d:size.w,d=rotation?size.w:size.d;
 const points=[{x:(room.w-w)/2,y:(room.d-d)/2}];for(let y=0;y<=room.d-d;y+=10)for(let x=0;x<=room.w-w;x+=10)points.push({x,y});
 for(const pos of points){const a={id,product_id:p.product_id,category:p.browse_category||p.category,...pos,w,d,rotation};const objects=[...layout.objects,a],check=validateLayout(objects,room);if(check.ok)return {objects,reserved:check.reserved};}}
 return null;
}
