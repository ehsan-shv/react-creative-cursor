import React, { FC, useCallback, useLayoutEffect, useRef } from 'react';
import './cursor.scss';

import { gsap, Expo } from 'gsap';

interface Pos {
  x?: number;
  y?: number;
}

interface Vel {
  x?: number;
  y?: number;
}

type Diff = number | undefined;

function getScale(diffX: Diff, diffY: Diff) {
  if (diffX && diffY) {
    const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    return Math.min(distance / 735, 0.35);
  }
  return;
}

function getAngle(diffX: Diff, diffY: Diff) {
  if (diffX && diffY) {
    return (Math.atan2(diffY, diffX) * 180) / Math.PI;
  }
  return;
}

const EMPTY = {};
function useInstance(value = {}) {
  const ref = useRef(EMPTY);
  if (ref.current === EMPTY) {
    ref.current = typeof value === 'function' ? value() : value;
  }
  return ref.current;
}

function useTicker(callback: () => void, paused?: boolean) {
  useLayoutEffect(() => {
    if (!paused && callback) {
      gsap.ticker.add(callback);
    }
    return () => {
      gsap.ticker.remove(callback);
    };
  }, [callback, paused]);
}

interface CursorProps {
  isGelly?: boolean;
  animationDuration?: number;
  animationEase?: string | gsap.EaseFunction;
  gellyAnimationAmount?: number;
  cursorSize?: number;
}

export const Cursor: FC<CursorProps> = ({
  isGelly = false,
  animationDuration = 1.25,
  animationEase = Expo.easeOut,
  gellyAnimationAmount = 50,
  cursorSize = 48,
}) => {
  const cursor = useRef<HTMLDivElement | null>(null);
  const cursorInner = useRef<HTMLDivElement | null>(null);

  const pos: Pos = useInstance(() => ({ x: 0, y: 0 }));
  const vel: Vel = useInstance(() => ({ x: 0, y: 0 }));
  const set: any = useInstance();

  useLayoutEffect(() => {
    set.x = gsap.quickSetter(cursor.current, 'x', 'px');
    set.y = gsap.quickSetter(cursor.current, 'y', 'px');

    if (isGelly) {
      set.r = gsap.quickSetter(cursor.current, 'rotate', 'deg');
      set.sx = gsap.quickSetter(cursor.current, 'scaleX');
      set.sy = gsap.quickSetter(cursor.current, 'scaleY');
      set.width = gsap.quickSetter(cursor.current, 'width', 'px');
      set.rt = gsap.quickSetter(cursorInner.current, 'rotate', 'deg');
    }
  });

  const loop = useCallback(() => {
    const rotation = getAngle(vel.x, vel.y);
    const scale = getScale(vel.x, vel.y);

    set.x(pos.x);
    set.y(pos.y);

    if (isGelly && scale && rotation) {
      set.width(cursorSize + scale * gellyAnimationAmount);
      set.r(rotation);
      set.sx(1 + scale);
      set.sy(1 - scale);
      set.rt(-rotation);
    }
  }, [
    cursorSize,
    gellyAnimationAmount,
    isGelly,
    pos.x,
    pos.y,
    set,
    vel.x,
    vel.y,
  ]);

  useLayoutEffect(() => {
    const setFromEvent = (e: MouseEvent) => {
      let x = e.clientX;
      let y = e.clientY;
      let duration = animationDuration;
      let ease = animationEase;

      gsap.set(pos, {});

      const xTo = gsap.quickTo(pos, 'x', {
        duration,
        ease,
        overwrite: true,
        onUpdate: () => {
          if (pos.x) {
            vel.x = x - pos.x;
          }
        },
      });

      const yTo = gsap.quickTo(pos, 'y', {
        duration,
        ease,
        overwrite: true,
        onUpdate: () => {
          if (pos.y) {
            vel.y = y - pos.y;
          }
        },
      });

      xTo(x);
      yTo(y);

      loop();
    };

    // overall mouse move listener
    window.addEventListener('mousemove', e => {
      setFromEvent(e);
    });

    return () => {
      window.removeEventListener('mousemove', setFromEvent);
    };
  });

  useTicker(loop);

  return (
    <div
      ref={cursor}
      id={'c-cursorId'}
      className="c-cursor"
      style={{ width: cursorSize, height: cursorSize }}
    >
      <div
        ref={cursorInner}
        id={'c-cursorInnerId'}
        className="c-cursor__inner"
      />
    </div>
  );
};
