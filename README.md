# react-creative-cursor

<a href="https://www.npmjs.com/package/react-creative-cursor"><img src="https://img.shields.io/npm/v/react-creative-cursor.svg" alt="Version"></a>

> A creative and customizable React cursor component. (Include Gelly Animation)

<a href="https://react-creative-cursor-demo.vercel.app/">Demo</a>

## Installation

```
npm i react-creative-cursor
```

## Example

```ts
import { Cursor } from 'react-creative-cursor';
import 'react-creative-cursor/dist/styles.css';

const App = () => {
  return (
    <>
      <Cursor isGelly={true} />
    </>
  );
};
```

## Options

| Props                | Value Type                    | Default Value |
| -------------------- | ----------------------------- | ------------- |
| isGelly              | boolean                       | false         |
| animationDuration    | number                        | 1.25          |
| animationEase        | `string \| gsap.EaseFunction` | Expo.easeOut  |
| gellyAnimationAmount | number                        | 50            |
| cursorSize           | number                        | 48            |
