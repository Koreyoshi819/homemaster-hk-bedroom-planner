// Diagram category colours only, never product colour claims.
export const diagramPalette={
 bed:{fill:'#D9C6A7',edge:'#9B805C',label:'Bed'},
 nightstand:{fill:'#C68F7A',edge:'#7A4A3B',label:'Bedside table'},
 wardrobe:{fill:'#B8C7B5',edge:'#697F65',label:'Wardrobe'},
 desk:{fill:'#C6D3E0',edge:'#71869E',label:'Desk'},
 vanity:{fill:'#E2C5C9',edge:'#A57C83',label:'Dressing table'},
 vanity_stool:{fill:'#CDBFD4',edge:'#8D7897',label:'Vanity stool'},
 office_chair:{fill:'#9EB5C2',edge:'#58768A',label:'Office chair'},
 bed_end_bench:{fill:'#B9BED3',edge:'#7A819F',label:'Bed-end bench'},
 sofa:{fill:'#C9CEAE',edge:'#858C60',label:'Lounge chair'},
 lamp:{fill:'#E7D7A5',edge:'#A58F4E',label:'Floor lamp'},
 mirror:{fill:'#CFDAD7',edge:'#829893',label:'Full-length mirror'},
 rug:{fill:'#C2DEDC',edge:'#739D9B',label:'Rug'}
};
export function diagramColour(p){return diagramPalette[p.browse_category||p.category]||{fill:'#D4CEC5',edge:'#8E8578',label:'Furniture'};}
