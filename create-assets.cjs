const fs = require('node:fs');
const path = require('node:path');
const shapes = {
 grip: '<rect x="91" y="29" width="18" height="102" rx="8" fill="#7a4c31"/><path d="M92 48l16 8m-16 5l16 8m-16 5l16 8m-16 5l16 8m-16 5l16 8" stroke="#d8ac64" stroke-width="4"/>',
 upper: '<path d="M72 137 Q144 83 106 24 Q101 14 94 23" fill="none" stroke="#a67642" stroke-width="9" stroke-linecap="round"/>',
 lower: '<path d="M72 23 Q144 77 106 136 Q101 146 94 137" fill="none" stroke="#a67642" stroke-width="9" stroke-linecap="round"/>',
 string: '<path d="M100 20 C38 20 38 138 100 138 C159 138 159 20 100 20 M100 20 L100 138" fill="none" stroke="#b38f59" stroke-width="3"/>',
 shaft: '<path d="M46 128 L153 27" stroke="#a87943" stroke-width="8" stroke-linecap="round"/><path d="M75 102l5 6m25-34l5 6m25-34l5 6" stroke="#77502d" stroke-width="3"/>',
 arrowhead: '<path d="M100 21 L140 101 L108 89 L108 136 L92 136 L92 89 L60 101Z" fill="#7e9590" stroke="#45645e" stroke-width="3"/><path d="M100 24v64l36 11" fill="none" stroke="#b8c8be" stroke-width="3"/>',
 feather: '<path d="M100 130V30" stroke="#a87943" stroke-width="7"/><path d="M96 108L62 83V33L96 60M104 108l34-25V33l-34 27" fill="#627f63" stroke="#45694f" stroke-width="2"/><path d="M65 47l29 25M65 63l29 25m12-16l29-25m-29 41l29-25" stroke="#b4c29a" stroke-width="2"/><path d="M90 131v11m20-11v11" stroke="#a87943" stroke-width="5"/>',
 complete: '<circle cx="100" cy="80" r="67" fill="none" stroke="#dacdb5" stroke-dasharray="3 5"/><path d="M76 13 Q145 80 76 147" fill="none" stroke="#9c683a" stroke-width="7" stroke-linecap="round"/><path d="M76 13v134" stroke="#b29c77" stroke-width="1.5"/><path d="M113 64v32" stroke="#64412e" stroke-width="9"/><path d="M37 113L157 42" stroke="#aa804e" stroke-width="3"/><path d="M158 41l-7 17-9-15Z" fill="#59776b"/><path d="M43 110l-14-2 14-9 11 2m-9 10l-3 14 15-9 2-13" fill="#59776b"/>'
};
for (const [id, shape] of Object.entries(shapes)) fs.writeFileSync(path.join(__dirname,'assets/images',id+'.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160">${shape}</svg>`);
