# react-creative-cursor

<a href="https://www.npmjs.com/package/react-creative-cursor"><img src="https://img.shields.io/npm/v/react-creative-cursor.svg" alt="Version"></a>

> A creative and customizable React cursor follower component. Inspired by **cuberto.com** and **14islands.com**.

## Options

- Magnetic cursor
- Sticky cursor
- Gelly animation
- Change background color and background image on specific elements
- Can add text
- Can change cursor size smoothly
- Exclusion effect on specific elements

<a href="https://react-creative-cursor-demo.vercel.app/">Demo</a>

## Installation

```
npm i react-creative-cursor
```

## Basic Example

```tsx
import { Cursor } from 'react-creative-cursor';
import 'react-creative-cursor/dist/styles.css';

const index = () => {
  return (
    <>
      <Cursor isGelly={true} />
    </>
  );
};
```

**It's essential to add the Cursor component to each route if you want to use all options properly. otherwise, if you want to use cursor follower, feel free and import in app or layout component**.

## Magnetic Cursor

```tsx
import { Cursor } from 'react-creative-cursor';
import 'react-creative-cursor/dist/styles.css';

const index = () => {
  return (
    <>
      <Cursor isGelly={true} />
      <div data-cursor-magnetic>
        <h1>Magnetic Cursor<h1>
      </div>
    </>
  );
};
```

## Sticky Cursor

```tsx
import { Cursor } from 'react-creative-cursor';
import 'react-creative-cursor/dist/styles.css';

const index = () => {
  return (
    <>
      <Cursor isGelly={true} />
      <div data-cursor-stick="#stick-title">
        <h1 id="stick-title" style={{textAlign: center}}>Sticky Cursor<h1>
      </div>
    </>
  );
};
```

It's better for the element which the pointer sticks to be a **block** and **text-center** element.

## Change Color

```tsx
import { Cursor } from 'react-creative-cursor';
import 'react-creative-cursor/dist/styles.css';

const index = () => {
  return (
    <>
      <Cursor isGelly={true} />
      <div data-cursor-color="#61dbfb">
        <h1 id="stick-title">Colorized Cursor<h1>
      </div>
    </>
  );
};
```

## Change Size

```tsx
import { Cursor } from 'react-creative-cursor';
import 'react-creative-cursor/dist/styles.css';

const index = () => {
  return (
    <>
      <Cursor isGelly={true} />
      <div data-cursor-size="80px">
        <h1 id="stick-title">Sized Cursor<h1>
      </div>
    </>
  );
};
```

## Change Background Image

```tsx
import { Cursor } from 'react-creative-cursor';
import 'react-creative-cursor/dist/styles.css';

const index = () => {
  return (
    <>
      <Cursor isGelly={true} />
      <div data-cursor-background-image="https://reactjs.org/logo-og.png" data-cursor-size="200px">
        <h1 id="stick-title">React.js<h1>
      </div>
    </>
  );
};
```

## Exclusion Mode

```tsx
import { Cursor } from 'react-creative-cursor';
import 'react-creative-cursor/dist/styles.css';

const index = () => {
  return (
    <>
      <Cursor isGelly={true} />
      <div data-cursor-exclusion style={{backgroundColor: '#fff'}}>
        <h1 id="stick-title">React.js<h1>
      </div>
    </>
  );
};
```

## Add Text

```tsx
import { Cursor } from 'react-creative-cursor';
import 'react-creative-cursor/dist/styles.css';

const index = () => {
  return (
    <>
      <Cursor isGelly={true} />
      <div data-cursor-background-text="React" data-cursor-size="100px">
        <h1 id="stick-title">React.js<h1>
      </div>
    </>
  );
};
```

## Props

| Props                            | Value Type                                 | Default Value  |
| -------------------------------- | ------------------------------------------ | -------------- |
| isGelly                          | `boolean`                                  | false          |
| animationDuration                | `number`                                   | 1.25           |
| animationEase                    | `string \| gsap.EaseFunction \| undefined` | Expo.easeOut   |
| gellyAnimationAmount             | `number`                                   | 50             |
| stickAnimationAmount             | `number`                                   | 0.09           |
| stickAnimationDuration           | `number`                                   | 0.7            |
| stickAnimationEase               | `string \| gsap.EaseFunction \| undefined` | Power4.easeOut |
| magneticAnimationAmount          | `number`                                   | 0.2            |
| magneticAnimationDuration        | `number`                                   | 0.7            |
| magneticAnimationEase            | `string \| gsap.EaseFunction \| undefined` | Power4.easeOut |
| colorAnimationEase               | `string \| gsap.EaseFunction \| undefined` | Power4.easeOut |
| colorAnimationDuration           | `number`                                   | 0.2            |
| backgroundImageAnimationEase     | `string \| gsap.EaseFunction \| undefined` | undefined      |
| backgroundImageAnimationDuration | `number`                                   | 0              |
| sizeAnimationEase                | `string \| gsap.EaseFunction \| undefined` | Expo.easeOut   |
| sizeAnimationDuration            | `number`                                   | 0.5            |
| textAnimationEase                | `string \| gsap.EaseFunction \| undefined` | Expo.easeOut   |
| textAnimationDuration            | `number`                                   | 1              |
| cursorSize                       | `number`                                   | 48             |
| cursorBackgrounColor             | `string`                                   | '#000'         |
| exclusionBackgroundColor         | `string`                                   | '#fff'         |
| cursorInnerColor                 | `string`                                   | '#fff'         |
