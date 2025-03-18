pr_enangleRange = qb.rndmint(1, 13);
pr_enradius = qb.rndmint(200, 350);
pr_timelimit = qb.rndmint(1500, 3000);
pr_upkkrtadd = qb.rndm(-0.001, 0.0042);
pr_downkkrtadd = qb.rndm(0.00, 0.0032);
pr_centertype = qb.rndmint(0, 1);

// ランダムなRGB値を生成する関数
function generateRandomColor() {
    return {
        r: qb.rndm(0, 1),
        g: qb.rndm(0, 1),
        b: qb.rndm(0, 1),
        a: 1.0
    };
}

// 各色にランダムな値を設定
const FINGER_FILL_COLOR = {     r: 0.925, g: 0.583, b: 0.782, a: 1.0 }
const TUME_FILL_COLOR =   {    r: 0.749, g: 0.183, b: 0.435, a: 1.0}
const SODE_FILL_COLOR = {    r: 0.309, g: 0.201, b: 0.239, a: 1.0}
const PAPER_COLOR = {    r: 0.336, g: 0.625, b: 0.934, a: 1.0}
// const FINGER_FILL_COLOR = generateRandomColor();
// const TUME_FILL_COLOR = generateRandomColor();
// const SODE_FILL_COLOR = generateRandomColor();
// const PAPER_COLOR = generateRandomColor();

// コンソールログに色情報を出力
// console.log('=== ランダム生成された色情報 ===');
// console.log('const FINGER_FILL_COLOR = {');
// console.log(`    r: ${FINGER_FILL_COLOR.r.toFixed(3)}, g: ${FINGER_FILL_COLOR.g.toFixed(3)}, b: ${FINGER_FILL_COLOR.b.toFixed(3)}, a: 1.0`);
// console.log('};');
// console.log('');

// console.log('const TUME_FILL_COLOR = {');
// console.log(`    r: ${TUME_FILL_COLOR.r.toFixed(3)}, g: ${TUME_FILL_COLOR.g.toFixed(3)}, b: ${TUME_FILL_COLOR.b.toFixed(3)}, a: 1.0`);
// console.log('};');
// console.log('');

// console.log('const SODE_FILL_COLOR = {');
// console.log(`    r: ${SODE_FILL_COLOR.r.toFixed(3)}, g: ${SODE_FILL_COLOR.g.toFixed(3)}, b: ${SODE_FILL_COLOR.b.toFixed(3)}, a: 1.0`);
// console.log('};');
// console.log('');

// console.log('const PAPER_COLOR = {');
// console.log(`    r: ${PAPER_COLOR.r.toFixed(3)}, g: ${PAPER_COLOR.g.toFixed(3)}, b: ${PAPER_COLOR.b.toFixed(3)}, a: 1.0`);
// console.log('};');

// console.log('=== 16進数表記 ===');
// console.log(`FINGER_FILL_COLOR: ${rgbaToHex(FINGER_FILL_COLOR.r, FINGER_FILL_COLOR.g, FINGER_FILL_COLOR.b)}`);
// console.log(`TUME_FILL_COLOR: ${rgbaToHex(TUME_FILL_COLOR.r, TUME_FILL_COLOR.g, TUME_FILL_COLOR.b)}`);
// console.log(`SODE_FILL_COLOR: ${rgbaToHex(SODE_FILL_COLOR.r, SODE_FILL_COLOR.g, SODE_FILL_COLOR.b)}`);
// console.log(`PAPER_COLOR: ${rgbaToHex(PAPER_COLOR.r, PAPER_COLOR.g, PAPER_COLOR.b)}`);

// rgbaをhexに変換する関数
function rgbaToHex(r, g, b) {
    const toHex = (value) => {
        const hex = Math.round(value * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// style.cssの.canvas-paperのbackground-colorを設定する関数
function applyPaperColor() {
    const canvasPaper = document.querySelector('.canvas-paper');
    if (canvasPaper) {
        const colorHex = rgbaToHex(PAPER_COLOR.r, PAPER_COLOR.g, PAPER_COLOR.b);
        canvasPaper.style.backgroundColor = colorHex;
    } else {
        // 要素がまだ存在しない場合は、少し待ってから再試行
        setTimeout(applyPaperColor, 100);
    }
}

// スクリプトが読み込まれたときに実行
applyPaperColor();

// DOMContentLoadedイベントでも実行（念のため）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPaperColor);
} else {
    applyPaperColor();
}

function fxhashreset() {
	$fx.rand.reset()
}
function fxhashfxpreview() {
	$fx.preview();	
}
function fxhash_iscapturemode() {
	return $fx.isPreview
	// return false;
}