/**
 * [transpoint]
 * @param  {[type]} originPoint [Point(x,y)]
 * @param  {[type]} centerPoint   [Point(x,y)]
 * @param  {[type]} angle   [description]
 * @param  {[type]} direction   [1,2,3,4]
 * @return {[type]}         [Point(x,y)]
 */
function transpoint(originPoint, centerPoint, angle, direction) {
	let width = centerPoint.x - originPoint.x;
	if (width < 0) width = -width;
	let height = centerPoint.y - originPoint.y;
	if (height < 0) height = -height;
	const r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
	const a = Math.round(Math.atan(height / width) * 180 / Math.PI);
	const tlbra = 180 - angle - a;
	const trbla = a - angle;
	if (direction === 1) {
		const topLeft = {
			x: centerPoint.x + r * Math.cos(tlbra * Math.PI / 180),
			y: centerPoint.y - r * Math.sin(tlbra * Math.PI / 180)
		};
		return topLeft;
	}
	else if (direction === 2) {
		const topRight = {
			x: centerPoint.x + r * Math.cos(trbla * Math.PI / 180),
			y: centerPoint.y - r * Math.sin(trbla * Math.PI / 180)
		};
		return topRight;
	}
	else if (direction === 3) {
		const bottomRight = {
			x: centerPoint.x - r * Math.cos(tlbra * Math.PI / 180),
			y: centerPoint.y + r * Math.sin(tlbra * Math.PI / 180)
		};
		return bottomRight;
	}
	else if (direction === 4) {
		const bottomLeft = {
			x: centerPoint.x - r * Math.cos(trbla * Math.PI / 180),
			y: centerPoint.y + r * Math.sin(trbla * Math.PI / 180)
		};
		return bottomLeft;
	}
}
