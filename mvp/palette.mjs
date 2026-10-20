// Diagram category colours only, never product colour claims.
export const diagramPalette={
 bed:{fill:'#D9C6A7',edge:'#9B805C',label:'床架'},
 nightstand:{fill:'#C68F7A',edge:'#7A4A3B',label:'床头柜'},
 wardrobe:{fill:'#B8C7B5',edge:'#697F65',label:'衣柜'},
 desk:{fill:'#C6D3E0',edge:'#71869E',label:'书桌'},
 vanity:{fill:'#E2C5C9',edge:'#A57C83',label:'梳妆台'},
 vanity_stool:{fill:'#CDBFD4',edge:'#8D7897',label:'妆凳'},
 office_chair:{fill:'#9EB5C2',edge:'#58768A',label:'办公椅'},
 bed_end_bench:{fill:'#B9BED3',edge:'#7A819F',label:'床尾凳'},
 sofa:{fill:'#C9CEAE',edge:'#858C60',label:'懒人沙发'},
 lamp:{fill:'#E7D7A5',edge:'#A58F4E',label:'落地灯'},
 mirror:{fill:'#CFDAD7',edge:'#829893',label:'全身镜'},
 rug:{fill:'#C2DEDC',edge:'#739D9B',label:'地毯'}
};
export function diagramColour(p){return diagramPalette[p.browse_category||p.category]||{fill:'#D4CEC5',edge:'#8E8578',label:'家具'};}
