function imagecrop(img, cropArea, positionArr) {
  // const cropArea = [[0,0], [480,0], [480,800], [0,800]]
  if (!cropArea || cropArea.length <= 2) {
    return null;
  }
  const it = cropArea;
  // 参数预处理
  let minLeft = it[0][0]
  let maxLeft = it[0][0]
  let minTop = it[0][1]
  let maxTop = it[0][1]
  for (let index = 1; index < it.length; index++) {
    const item = it[index]
    if (item[0] < minLeft) {
      minLeft = item[0]
    }
    if (item[0] > maxLeft) {
      maxLeft = item[0]
    }
    if (item[1] < minTop) {
      minTop = item[1]
    }
    if (item[1] > maxTop) {
      maxTop = item[1]
    }
  }
  // 过滤非矩形区域
  if ((maxLeft - minLeft === 0) || (maxTop - minTop === 0)) {
    return null
  }
  // 绘制主图canvas
  const canvas = document.createElement('canvas')
  canvas.style.display = 'none'
  canvas.width = img.width
  canvas.height = img.height
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  // 绘制不规则区域
  ctx.beginPath()
  ctx.moveTo(it[0][0], it[0][1])
  for (let index = 1; index < it.length; index++) {
    ctx.lineTo(it[index][0], it[index][1])
  }
  ctx.clip()
  ctx.drawImage(img, 0, 0, img.width, img.height)
  // 区域外接矩形
  const canvas2 = document.createElement('canvas')
  canvas2.style.display = 'none'
  document.body.appendChild(canvas2)
  const cxt2 = canvas2.getContext('2d')
  // 图像裁剪
  const imgClipData = ctx.getImageData(minLeft, minTop, maxLeft - minLeft, maxTop - minTop)
  canvas2.width = imgClipData.width
  canvas2.height = imgClipData.height
  cxt2.putImageData(imgClipData, 0, 0, 0, 0, imgClipData.width, imgClipData.height)
  const dataURL = canvas2.toDataURL('image/png') // 截取的图片
  // 
  document.body.removeChild(canvas)
  document.body.removeChild(canvas2)
  // 框选的模板区域
  if (positionArr) {
    positionArr.push({
      x: minLeft,
      y: minTop,
      w: maxLeft - minLeft,
      h: maxTop - minTop
    })
  }
  //
  return dataURL
}