# Car Driving ResNet
Browser game where a vehicle is driven through the camera using the [ResNet model](https://arxiv.org/pdf/1512.03385.pdf) (Deep Residual Network) to estimate the position of the hands.

The application is written on top of [this codepen](https://codepen.io/Toky/pen/GGrNNr).

<div align="center">
  <img src="https://raw.githubusercontent.com/MCarlomagno/assets/master/CarDriveResNetExample.gif" alt="Face recognition auth"/>
</div>

## Setup

Install dependencies and prepare the build directory:

```sh
yarn
```

To watch files for changes, and launch a dev server:

```sh
yarn watch
```

## Technologies
### HTML + CSS + Javascript
This application is written in vanilla js with HTML and CSS without any framework, using yarn as dependency manager.

A few resources about HTML+CSS+JS: https://www.w3schools.com/
How to use Yarn: https://classic.yarnpkg.com/en/docs/managing-dependencies/

### Tensorflow.js
TensorFlow.js is a library for machine learning in JavaScript.

A few resourses to [get started with Tensorflow.js](https://www.tensorflow.org/js/tutorials).

### ResNet CNN Model
Residual Networks, or ResNets, learn residual functions with reference to the layer inputs, instead of learning unreferenced functions. Instead of hoping each few stacked layers directly fit a desired underlying mapping, residual nets let these layers fit a residual mapping. They stack residual blocks ontop of each other to form network: e.g. a ResNet-50 has fifty layers using these blocks.

<div align="center">
  <img src="https://paperswithcode.com/media/methods/0_sGlmENAXIZhSqyFZ_NMWa18K.png" alt="Face recognition auth"/>
</div>

More info in [this paper](https://arxiv.org/pdf/1512.03385.pdf).

## How it works
Using the PoseNet library of tensorflow.js we can obtain the positions of the different parts of the body during the streaming of the video in real time.

In this project, the position of the wrists is estimated, and then the angle formed by the segment between them is calculated to infer if the "steering wheel" moved to the left or right.

Finally we use the result to alter the movement of the vehicle on the road.

## Demo
https://mcarlomagno.github.io/CarDrivingResNetController/

## Licence
https://opensource.org/licenses/BSD-3-Clause
