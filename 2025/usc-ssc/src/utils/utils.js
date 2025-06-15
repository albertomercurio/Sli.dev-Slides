import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

export function linrange(a, b, n) {
  const step = (b - a) / (n - 1);
  return Array.from({ length: n }, (_, i) => a + i * step);
}

export function getCoordinates(f, xValues) {
  return xValues.map(x => ({ x: x, y: f(x) }));
}

export function plotDAttribute(path, xList, f, viewBox) {
  // The SVG starts form the top left corner, so we need to flip the y-axis
  const coordinates = getCoordinates((x) => viewBox.height - f(x), xList)
  const rawPath = MotionPathPlugin.arrayToRawPath(coordinates)
  const dAttribute = MotionPathPlugin.rawPathToString(rawPath)

  path.setAttribute("d", dAttribute)

  return dAttribute;
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

export function alignObjectsCenterSet(timeline, fromElement, toElement, point, gapx=0, gapy=0) {
  const p = MotionPathPlugin.convertCoordinates(fromElement, toElement, point)

  timeline.set(toElement, {
    x: p.x + gapx,
    y: p.y + gapy,
  })

  timeline.set(toElement, {
    xPercent: -50,
    yPercent: -50,
  });
}

export function doubleWellPotentialFun(x, gamma=50) {
  const m = 1; // Mass
  const alpha = 50;
  const beta = Math.pow((gamma * Math.pow(alpha, 2) / m), 1/3);

  return 0.1 * (alpha * Math.pow(x, 4) - beta * Math.pow(x, 2));
}
