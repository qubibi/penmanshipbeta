let rend_fill;
let rend_line;
let rend_linepaper;
// let noiseGenerator;
let anima;
let ddra;
let motionpen;
let g_pen;
let g_sode;
let g_tume;
let g_oyayubi;
let g_hitoyubi;
let paperdraw;

let cc = 0;
let cc_inout = -0.5;
let cc_loopkaisu = 1;





const canvas = document.querySelector("#glCanvas");
const gl = canvas.getContext("webgl2", {
	antialias: false,	powerPreference: 'high-performance', alpha: true
});
if (!gl) console.error("WebGL2 not available");
const canvaspaper= document.querySelector("#glpaper");
const glpaper = canvaspaper.getContext("webgl2", {
	antialias: false,	powerPreference: 'high-performance', preserveDrawingBuffer: true
});
if (!glpaper) console.error("WebGL2 not available");


const scripts = [
    'libq/benri.js',
    'code/prerandom.js',
    'libq/qvert.js',
    'libcore/shaperoot.js',
    // 'libcore/NoiseGenerator.js',
    'libcore/shd/shd_line.js',
    'libcore/shd/shd_fill.js',
    'libcore/fillRenderer.js',
    'libcore/lineRenderer.js',
    'libcore/animationManager.js',
    'code/draw.js',
    'code/paperDraw.js',
    'code/motionpen.js',
    'code/g_tume.js',
    'code/g_pen.js',
    'code/g_sode.js',
    'code/g_oyayubi.js',
    'code/g_hitoyubi.js',
    'libcore/shd/shd_move.js',
    'libcore/moveShader.js',
    'code/hajimari.js'
];
let loadedScripts = 0;
const totalScripts = scripts.length;
scripts.forEach(script => {
    const scriptElement = document.createElement('script');
    scriptElement.src = `./${script}`;
    scriptElement.async = false;


    // スクリプトが読み込まれた後の処理を追加
    scriptElement.onload = () => {
        loadedScripts++;
        if (loadedScripts === totalScripts) {
            new Hajimari();
            setTimeout(() => {
                document.querySelector('#redoverlay').style.display = 'none';
            }, 600);
        }
    };
    

    document.head.appendChild(scriptElement);

    
}); 


