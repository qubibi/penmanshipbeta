pr_enangleRange = qb.rndmint(1, 13);
pr_enradius = qb.rndmint(200, 350);
pr_timelimit = qb.rndmint(1500, 3000);
pr_upkkrtadd = qb.rndm(-0.001, 0.0042);
pr_downkkrtadd = qb.rndm(0.00, 0.0032);
pr_centertype = qb.rndmint(0, 1);

function fxhashreset() {
	// $fx.rand.reset()
}
function fxhashfxpreview() {
	// $fx.preview();	
}
function fxhash_iscapturemode() {
	// return $fx.isPreview
	return false;
}