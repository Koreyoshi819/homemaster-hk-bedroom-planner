export const requirements=[
 {id:'easy_move',label:'易拆装／易搬迁',field:'easy_move'},
 {id:'low_assembly',label:'少安装',field:'low_assembly'},
 {id:'need_storage',label:'储物',field:'has_storage',categories:['bed','nightstand','wardrobe','desk','vanity','bed_end_bench']},
 {id:'home_office',label:'办公使用',field:'office_use',categories:['desk','office_chair']},
 {id:'durable',label:'耐用',field:'durable'},
 {id:'easy_clean',label:'易清洁',field:'easy_clean'},
 {id:'no_drill',label:'无需钻墙固定',field:'no_drill',categories:['bed','nightstand','wardrobe','desk','vanity','mirror']},
 {id:'child_safe',label:'儿童使用适配',field:'child_safe'},
 {id:'pet_friendly',label:'宠物使用适配',field:'pet_friendly'},
 {id:'delivery_access',label:'搬运路径已确认',field:'delivery_access'}
];
export const presets=[
 {id:'tenant',name:'租住／港漂',hint:'可先考虑搬迁与安装；租住不代表必须选低价。',suggest:['easy_move','low_assembly','no_drill']},
 {id:'first_home',name:'首套／新婚',hint:'可先讨论收纳与使用年限；不自动假设卧室面积。',suggest:['need_storage','durable']},
 {id:'family',name:'家庭长期使用',hint:'耐用、清洁和家庭成员需要分别确认。',suggest:['durable','easy_clean']},
 {id:'design',name:'设计／定制探索',hint:'探索设计与材质；预算、功能和空间检查仍保留。',suggest:[]},
 {id:'landlord',name:'出租物业采购',hint:'可考虑维护与耐用；仍按具体商品核价。',suggest:['durable','easy_clean','low_assembly']}
];
export function requirementEvidence(p,id){
 const rule=requirements.find(r=>r.id===id),category=p.browse_category||p.category;
 if(!rule)return {status:'unknown',reason:'未定义需求'};
 if(rule.categories&&!rule.categories.includes(category))return {status:'not_applicable',reason:'不适用于此品类'};
 const verified=p.verified_attributes?.[rule.field];
 if(verified&&typeof verified.value==='boolean'&&verified.source_url&&verified.checked_at)return {status:verified.value?'matched':'not_matched',reason:verified.evidence||'有明确属性来源',source_url:verified.source_url,checked_at:verified.checked_at};
 // Identity, brand, appearance, material names and price are never evidence for these properties.
 return {status:'unknown',reason:'当前资料未提供带来源与日期的属性核实记录'};
}
export function evaluateProfile(p,profile={}){return (profile.requirements||[]).map(r=>({...r,label:requirements.find(d=>d.id===r.id)?.label||r.id,...requirementEvidence(p,r.id)}));}
export function satisfiesHard(p,profile={}){return evaluateProfile(p,profile).every(r=>r.mode!=='required'||['matched','not_applicable'].includes(r.status));}
export function preferenceScore(p,profile={}){return evaluateProfile(p,profile).reduce((s,r)=>s+(r.mode==='preferred'&&r.status==='matched'?(r.id===profile.first_priority?2:1):0),0);}
export function profileSnapshot({presetIds=[],living='',needs=[],priority='',requirements:chosen=[],context=[]}={},roomAreaM2=null,budgetHkd=null){return {schema_version:'1.0',persona_tags:presetIds,housing_status:living||null,room_area_m2:roomAreaM2,area_scope:'bedroom',budget_hkd:budgetHkd,budget_scope:'current_procurement_products_only',context_tags:context,requirements:chosen,first_priority:priority||null,legacy_needs:needs};}
