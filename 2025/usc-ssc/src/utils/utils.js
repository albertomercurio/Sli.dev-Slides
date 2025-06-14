export function linrange(a, b, n) {
  const step = (b - a) / (n - 1);
  return Array.from({ length: n }, (_, i) => a + i * step);
}

export function getCoordinates(f, xValues) {
  return xValues.map(x => ({ x: x, y: f(x) }));
}

export function drawSVG(timeline, target, fillColor, value="100%", stagger=0.1, props={}) {
  timeline.to(target, {
    drawSVG: value,
    stagger: stagger,
    ...props,
  })

  timeline.to(target, {
    fill: fillColor,
  })
}
