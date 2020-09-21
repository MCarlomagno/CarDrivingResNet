/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const color = 'aqua';
const lineWidth = 2;

export const tryResNetButtonName = 'tryResNetButton';
export const tryResNetButtonText = '[New] Try ResNet50';
const tryResNetButtonTextCss = 'width:100%;text-decoration:underline;';
const tryResNetButtonBackgroundCss = 'background:#e61d5f;';
const keypointsToDraw = ['leftWrist', 'rightWrist'];

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isMobile() {
  return isAndroid() || isiOS();
}

function setDatGuiPropertyCss(propertyText, liCssString, spanCssString = '') {
  var spans = document.getElementsByClassName('property-name');
  for (var i = 0; i < spans.length; i++) {
    var text = spans[i].textContent || spans[i].innerText;
    if (text == propertyText) {
      spans[i].parentNode.parentNode.style = liCssString;
      if (spanCssString !== '') {
        spans[i].style = spanCssString;
      }
    }
  }
}

function toTuple({y, x}) {
  return [y, x];
}

export function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * Draws a circle on a canvas
 */
export function drawCircle([y, x], rad, color, ctx) {
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, 2 * Math.PI);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}


/**
 * Filers the wrists from all the keypoints detected
 * @param {array} keypoints 
 * @param {float} minConfidence 
 */
export function getWrists(keypoints, minConfidence) {
  let wrists = [];
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];
    if (!keypointsToDraw.includes(keypoint.part) || keypoint.score < minConfidence) {
      continue;
    }
    wrists.push(keypoint);
  }
  return wrists;
}

/**
 * Draws steering wheel into a canvas
 */
export function drawSteeringWheel(wrists, ctx, scale = 1) {

  if(wrists.length >= 2) {

    const rightWrist = wrists[0];
    const leftWrist = wrists[1];

    const rx = rightWrist.position.x;
    const ry = rightWrist.position.y;
    const lx = leftWrist.position.x;
    const ly = leftWrist.position.y;
    
    const centerY = (ry + ly) / 2;
    const centerX = (rx + lx) / 2;
    
    drawPoint(ctx, ry * scale, rx * scale, 3, color);
    drawPoint(ctx, ly * scale, lx * scale, 3, color);

    /// steering wheel
    // segment between hands
    drawSegment(
      toTuple(wrists[0].position), toTuple(wrists[1].position), color,
      scale, ctx);
    
    const distanceX = rx-lx;
    const distanceY = ry-ly;
    const len = Math.hypot(distanceX, distanceY)
    const rad = len / 2;
    
    drawCircle([centerY, centerX], rad / 3, color, ctx);
    drawCircle([centerY, centerX], rad, color, ctx);
  }

}

/**
 * Computes the angle between the wrists
 * @param {array} wrists
 */
export function angleBetween(wrists) {

  if(wrists.length < 2) {
    return 0.0;
  }

  const rightWrist = wrists[0];
  const leftWrist = wrists[1];

  const rx = rightWrist.position.x;
  const ry = rightWrist.position.y;
  const lx = leftWrist.position.x;
  const ly = leftWrist.position.y;

  var dy = ly - ry;
  var dx = lx - rx;

  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= -180 / Math.PI; // rads to degs, range (-180, 180]

  return theta;
}

/**
 * Converts an arary of pixel data into an ImageData object
 */
export async function renderToCanvas(a, ctx) {
  const [height, width] = a.shape;
  const imageData = new ImageData(width, height);

  const data = await a.data();

  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    const k = i * 3;

    imageData.data[j + 0] = data[k + 0];
    imageData.data[j + 1] = data[k + 1];
    imageData.data[j + 2] = data[k + 2];
    imageData.data[j + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Draw an image on a canvas
 */
export function renderImageToCanvas(image, size, canvas) {
  canvas.width = size[0];
  canvas.height = size[1];
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0);
}

