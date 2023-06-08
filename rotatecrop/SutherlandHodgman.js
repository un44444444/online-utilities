function Point(x,y) {
    this.x = x;
    this.y = y;
}
function edge(start,end) {
    this.start = start;
    this.end = end ;
}


function Sutherland_Hodgman(polygon, clipEdges) {
    var result = new Array(),
    cur = new Array(),
    flag,
    S = polygon[polygon.length-1];
    for (var i in polygon) {
        result.push(polygon[i]);
    }
    for (var i in clipEdges) {
        S = result[result.length - 1];
        /*flag = false表示在内侧，flag = true表示在外侧*/
        if (isInside(S, clipEdges[i]))
            flag = false;
        else
            flag = true;
        for (var j in result) {
            /*证明其在当前vector的内侧*/
            if (isInside(result[j], clipEdges[i])) {
                 /*如果前一个点在vector的外侧，那么将他们的交点加入到结果集中*/
                if (flag) {
                    flag = false;
                    cur.push(Intersection(S, result[j], clipEdges[i].start, clipEdges[i].end));
                }
                cur.push(result[j]);
            }
            else {
                /*前一个点在外侧吗？，如果是求交点，加入结果集*/
                if (!flag) {
                    flag = true;
                    cur.push(Intersection(S, result[j], clipEdges[i].start, clipEdges[i].end));
                }
            }
            /*更新首次比较的节点*/
            S = result[j];
        }
        
        result = [];
        for (var i in cur) {
            result.push(cur[i]);
        }
        cur = [];
    }
    return result;
}
/*判断一个点是否在边的内侧，边的顺序是按逆时针算的，所以可以分辨出内外*/
function isInside(point , vector) {
    return Multi(point, vector.start, vector.end)>=0 ? true : false;
}
/*求叉积*/
function Multi(p0,p1,p2) {
    return (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
}
/*求交点，利用正弦定理*/
function Intersection(start0 , end0 , start1 , end1) {
    var pX = (Multi(start0, end1, start1)*end0.x - Multi(end0, end1, start1)*start0.x)/
				(Multi(start0, end1, start1) - Multi(end0, end1, start1));
    var pY = (Multi(start0, end1, start1) * end0.y - Multi(end0, end1, start1) * start0.y) /
                        (Multi(start0, end1, start1) - Multi(end0, end1, start1));
    var curPoint = new Point(pX, pY);
    return curPoint;
}
