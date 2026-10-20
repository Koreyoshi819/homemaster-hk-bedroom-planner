export const requirements=[
 {id:'easy_move',label:'Easy to disassemble / move',field:'easy_move'},
 {id:'low_assembly',label:'Low assembly',field:'low_assembly'},
 {id:'need_storage',label:'Storage',field:'has_storage',categories:['bed','nightstand','wardrobe','desk','vanity','bed_end_bench']},
 {id:'home_office',label:'Home office use',field:'office_use',categories:['desk','office_chair']},
 {id:'durable',label:'Durability',field:'durable'},
 {id:'easy_clean',label:'Easy to clean',field:'easy_clean'},
 {id:'no_drill',label:'No wall drilling',field:'no_drill',categories:['bed','nightstand','wardrobe','desk','vanity','mirror']},
 {id:'child_safe',label:'Child suitability',field:'child_safe'},
 {id:'pet_friendly',label:'Pet suitability',field:'pet_friendly'},
 {id:'delivery_access',label:'Delivery access confirmed',field:'delivery_access'}
];
export const presets=[
 {id:'tenant',name:'Tenant / mobile resident',hint:'Consider moving and assembly needs; renting does not imply a low-price requirement.',suggest:['easy_move','low_assembly','no_drill']},
 {id:'first_home',name:'First home / newly married',hint:'Consider storage and expected use; room size is never inferred.',suggest:['need_storage','durable']},
 {id:'family',name:'Long-term family use',hint:'Confirm durability, cleaning and household needs separately.',suggest:['durable','easy_clean']},
 {id:'design',name:'Design / custom exploration',hint:'Explore design and materials while retaining budget, function and space checks.',suggest:[]},
 {id:'landlord',name:'Rental property furnishing',hint:'Consider maintenance and durability; prices remain product-specific.',suggest:['durable','easy_clean','low_assembly']}
];
export function requirementEvidence(p,id){
 const rule=requirements.find(r=>r.id===id),category=p.browse_category||p.category;
 if(!rule)return {status:'unknown',reason:'Undefined requirement'};
 if(rule.categories&&!rule.categories.includes(category))return {status:'not_applicable',reason:'Not applicable to this category'};
 const verified=p.verified_attributes?.[rule.field];
 if(verified&&typeof verified.value==='boolean'&&verified.source_url&&verified.checked_at)return {status:verified.value?'matched':'not_matched',reason:verified.evidence||'Supported by attribute evidence',source_url:verified.source_url,checked_at:verified.checked_at};
 // Identity, brand, appearance, material names and price are never evidence for these properties.
 return {status:'unknown',reason:'No dated, sourced verification is recorded for this attribute'};
}
export function evaluateProfile(p,profile={}){return (profile.requirements||[]).map(r=>({...r,label:requirements.find(d=>d.id===r.id)?.label||r.id,...requirementEvidence(p,r.id)}));}
export function satisfiesHard(p,profile={}){return evaluateProfile(p,profile).every(r=>r.mode!=='required'||['matched','not_applicable'].includes(r.status));}
export function preferenceScore(p,profile={}){return evaluateProfile(p,profile).reduce((s,r)=>s+(r.mode==='preferred'&&r.status==='matched'?(r.id===profile.first_priority?2:1):0),0);}
export function profileSnapshot({presetIds=[],living='',needs=[],priority='',requirements:chosen=[],context=[]}={},roomAreaM2=null,budgetHkd=null){return {schema_version:'1.0',persona_tags:presetIds,housing_status:living||null,room_area_m2:roomAreaM2,area_scope:'bedroom',budget_hkd:budgetHkd,budget_scope:'current_procurement_products_only',context_tags:context,requirements:chosen,first_priority:priority||null,legacy_needs:needs};}
