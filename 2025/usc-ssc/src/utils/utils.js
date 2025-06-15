import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

/**
 * Creates a linearly spaced array of numbers between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} n - Number of points to generate
 * @returns {number[]} Array of linearly spaced numbers from a to b
 */
export function linrange(a, b, n) {
  const step = (b - a) / (n - 1);
  return Array.from({ length: n }, (_, i) => a + i * step);
}

/**
 * Maps x values to coordinate objects using a provided function
 * @param {Function} f - Function to apply to x values to get y coordinates
 * @param {number[]} xValues - Array of x values
 * @returns {Object[]} Array of coordinate objects with x and y properties
 */
export function getCoordinates(f, xValues) {
  return xValues.map(x => ({ x: x, y: f(x) }));
}

/**
 * Creates an SVG path attribute for plotting a function on an SVG element
 * @param {SVGPathElement} path - The SVG path element to set the 'd' attribute on
 * @param {number[]} xList - Array of x values for the plot
 * @param {Function} f - Function to plot
 * @param {Object} viewBox - SVG viewBox object with width and height properties
 * @returns {string} The generated SVG path 'd' attribute string
 */
export function plotDAttribute(path, xList, f, viewBox) {
  // The SVG starts form the top left corner, so we need to flip the y-axis
  const coordinates = getCoordinates((x) => viewBox.height - f(x), xList)
  const rawPath = MotionPathPlugin.arrayToRawPath(coordinates)
  const dAttribute = MotionPathPlugin.rawPathToString(rawPath)

  path.setAttribute("d", dAttribute)

  return dAttribute;
}

/**
 * Animates SVG drawing and fills it with color using GSAP timeline
 * @param {gsap.core.Timeline} timeline - GSAP timeline to add animations to
 * @param {string|Element} target - Target element(s) to animate
 * @param {string} fillColor - Color to fill the SVG after drawing
 * @param {string} [value="100%"] - Percentage of SVG to draw
 * @param {number} [stagger=0.1] - Stagger delay between multiple elements
 * @param {Object} [props={}] - Additional GSAP animation properties
 */
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

/**
 * Aligns an object to a specific point and centers it using GSAP timeline
 * @param {gsap.core.Timeline} timeline - GSAP timeline to add the set commands to
 * @param {Element} fromElement - Reference element for coordinate conversion
 * @param {Element} toElement - Element to be positioned
 * @param {Object} point - Point coordinates {x, y} to align to
 * @param {number} [gapx=0] - Horizontal gap/offset
 * @param {number} [gapy=0] - Vertical gap/offset
 */
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

/**
 * Calculates the distance between two elements
 * @param {string} fromId - CSS selector or ID of the source element
 * @param {string} toId - CSS selector or ID of the target element
 * @param {number[]} [fromOrigin=[0.5, 0.5]] - Origin point on source element [x, y] (0-1 range)
 * @param {number[]} [toOrigin=[0.5, 0.5]] - Origin point on target element [x, y] (0-1 range)
 * @returns {Object} Distance object with x and y properties
 */
export function getDistance(fromId, toId, fromOrigin=[0.5, 0.5], toOrigin=[0.5, 0.5]) {
  const fromElements = gsap.utils.toArray(fromId);
  const toElements = gsap.utils.toArray(toId);

  if (fromElements.length != 1 || toElements.length != 1) {
    console.warn(`Only one element is expected for IDs: ${fromId} and ${toId}`);
    return { x: 0, y: 0 };
  }

  const dist = MotionPathPlugin.getRelativePosition(fromElements[0], toElements[0], fromOrigin, toOrigin);

  return dist
}

/**
 * Positions one element relative to another element
 * @param {string} fromId - CSS selector or ID of the element to move
 * @param {string} toId - CSS selector or ID of the reference element
 * @param {number[]} [fromOrigin=[0.5, 0.5]] - Origin point on source element [x, y] (0-1 range)
 * @param {number[]} [toOrigin=[0.5, 0.5]] - Origin point on target element [x, y] (0-1 range)
 * @param {Object} [gap={x: 0, y: 0}] - Additional gap/offset to apply
 */
export function setAlignElementTo(fromId, toId, fromOrigin=[0.5, 0.5], toOrigin=[0.5, 0.5], gap={x: 0, y: 0}) {
  const fromElements = gsap.utils.toArray(fromId);

  if (fromElements.length != 1) {
    console.warn(`Only one element is expected for ID: ${fromId}`);
    return;
  }

  const dist = getDistance(fromId, toId, fromOrigin, toOrigin);

  gsap.set(fromElements[0], {
    x: "+=" + dist.x + gap.x,
    y: "+=" + dist.y + gap.y,
  })
}

/**
 * Executes a callback when an element is fully loaded, or immediately if already loaded
 * @param {string} elementId - CSS selector for the element to check
 * @param {Function} callback - Function to execute when element is loaded
 */
export function runWhenLoaded(elementId, callback) {
  const element = document.querySelector(elementId);
  if (element && !element.complete) {
    console.warn(`Element ${elementId} not loaded yet, waiting for load event`);
    element.addEventListener("load", callback);
  } else {
    callback();
  }
}

/**
 * Preloads multiple images and returns a promise that resolves when all are loaded
 * @param {string[]} imagePaths - Array of image source paths to preload
 * @returns {Promise<HTMLImageElement[]>} Promise that resolves with array of loaded image elements
 */
export async function preloadImages(imagePaths) {
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })

  return Promise.all(imagePaths.map(loadImage))
}

// ---------------------- Project Specific Functions ----------------------

/**
 * Calculates the double-well potential function for physics simulations
 * @param {number} x - Position coordinate
 * @param {number} [gamma=50] - Parameter controlling the potential shape
 * @returns {number} The potential energy value at position x
 */
export function doubleWellPotentialFun(x, gamma=50) {
  const m = 1; // Mass
  const alpha = 50;
  const beta = Math.pow((gamma * Math.pow(alpha, 2) / m), 1/3);

  return 0.1 * (alpha * Math.pow(x, 4) - beta * Math.pow(x, 2));
}
