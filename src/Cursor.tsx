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
  defaultAnimationDuration?: number;
  defaultAnimationEase?: string | gsap.EaseFunction;
  stickAnimationAmount?: number;
  stickAnimationDuration?: number;
  stickAnimationEase?: string | gsap.EaseFunction;
  magneticAnimationAmount?: number;
  magneticAnimationDuration?: number;
  magneticAnimationEase?: string | gsap.EaseFunction;
  sizeAnimationDuration?: 0.7;
  sizeAnimationEase?: string | gsap.EaseFunction;
  gellyAnimationAmount?: number;
  cursorSize?: number;
}

export const Cursor: FC<CursorProps> = ({
  isGelly = false,
  defaultAnimationDuration = 1.25,
  defaultAnimationEase = Expo.easeOut,
  stickAnimationAmount = 0.15,
  stickAnimationDuration = 0.5,
  stickAnimationEase = Expo.easeOut,
  magneticAnimationAmount = 0.2,
  magneticAnimationDuration = 0.7,
  magneticAnimationEase = Expo.easeOut,
  sizeAnimationDuration = 0.7,
  sizeAnimationEase = Expo.easeOut,
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
    const stickElements = document.querySelectorAll<HTMLElement>(
      '[data-cursor-stick]'
    );
    const magneticElements = document.querySelectorAll<HTMLElement>(
      '[data-cursor-magnetic]'
    );
    const colorElements = document.querySelectorAll<HTMLElement>(
      '[data-cursor-color]'
    );
    const textElements = document.querySelectorAll<HTMLElement>(
      '[data-cursor-text]'
    );
    const exclusionElements = document.querySelectorAll<HTMLElement>(
      '[data-cursor-exclusion]'
    );
    const sizeElements = document.querySelectorAll<HTMLElement>(
      '[data-cursor-size]'
    );

    if (sizeElements.length && isGelly) {
      console.error(
        'Gelly cursor is not compatible with setting size to cursor. Please disable isGelly or remove [data-cursor-exclusion] elements.'
      );
      return;
    }

    let stickStatus = false;

    const setFromEvent = (e: MouseEvent) => {
      const areatarget = e.target as HTMLElement;
      let target: Element | null;
      let bound: DOMRect | undefined;

      let x = e.clientX;
      let y = e.clientY;
      let duration = defaultAnimationDuration;
      let ease = defaultAnimationEase;

      if (stickStatus) {
        target = areatarget.querySelector(
          areatarget.dataset['cursorStick'] as string
        );
        bound = target?.getBoundingClientRect();
        if (target && bound) {
          y =
            bound.top +
            target.clientHeight / 2 -
            (bound.top + target.clientHeight / 2 - e.clientY) *
              stickAnimationAmount;
          x =
            bound.left +
            target.clientWidth / 2 -
            (bound.left + target.clientWidth / 2 - e.clientX) *
              stickAnimationAmount;
          duration = stickAnimationDuration;
          ease = stickAnimationEase;
        }
      }

      gsap.to(pos, {
        x: x,
        y: y,
        duration,
        ease,
        overwrite: true,
        onUpdate: () => {
          if (pos.x && pos.y) {
            vel.x = x - pos.x;
            vel.y = y - pos.y;
          }
        },
      });

      loop();
    };

    // overall mouse move listener
    window.addEventListener('mousemove', e => {
      setFromEvent(e);
    });

    // sticks event listener
    stickElements.forEach(el => {
      el.addEventListener('mouseenter', () => (stickStatus = true));
    });
    stickElements.forEach(el => {
      el.addEventListener('mouseleave', () => (stickStatus = false));
    });

    // magnetics event listener
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', e => {
        const areatarget = e.target as HTMLElement;
        gsap.to(areatarget, {
          x:
            (e.clientX -
              (areatarget.offsetLeft - window.pageXOffset) -
              areatarget.clientWidth / 2) *
            magneticAnimationAmount,
          y:
            (e.clientY -
              (areatarget.offsetTop - window.pageYOffset) -
              areatarget.clientHeight / 2) *
            magneticAnimationAmount,
          duration: magneticAnimationDuration,
          ease: magneticAnimationEase,
          overwrite: true,
        });
      });
    });
    magneticElements.forEach(el => {
      el.addEventListener('mouseleave', e => {
        const areatarget = e.target as HTMLElement;
        gsap.to(areatarget, {
          x: 0,
          y: 0,
          duration: magneticAnimationDuration,
          ease: magneticAnimationEase,
          overwrite: true,
        });
      });
    });

    // colors event listener
    colorElements.forEach(el => {
      el.addEventListener('mouseenter', (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && cursor.current) {
          cursor.current.style.backgroundColor = `${e.target.dataset['cursorColor']}`;
        }
      });
    });
    colorElements.forEach(el => {
      el.addEventListener('mouseleave', (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && cursor.current) {
          cursor.current.style.backgroundColor = '';
        }
      });
    });

    // text event listener
    textElements.forEach(el => {
      el.addEventListener('mouseenter', (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && cursorInner.current) {
          cursorInner.current.textContent = `${e.target.dataset['cursorText']}`;
          gsap.to(`#${cursorInner.current.id}`, {
            scale: 1,
            rotate: 0,
            duration: sizeAnimationDuration,
            ease: sizeAnimationEase,
          });
        }
      });
    });
    textElements.forEach(el => {
      el.addEventListener('mouseleave', (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && cursorInner.current) {
          cursorInner.current.textContent = '';
          gsap.to(`#${cursorInner.current.id}`, {
            scale: 0,
            rotate: '10deg',
            duration: sizeAnimationDuration,
            ease: sizeAnimationEase,
          });
        }
      });
    });

    // sizes event listener
    sizeElements.forEach(el => {
      el.addEventListener('mouseenter', (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && cursor.current) {
          gsap.to(`#${cursor.current.id}`, {
            width: `${e.target.dataset['cursorSize']}`,
            height: `${e.target.dataset['cursorSize']}`,
            duration: sizeAnimationDuration,
            ease: sizeAnimationEase,
            overwrite: true,
          });
        }
      });
    });
    sizeElements.forEach(el => {
      el.addEventListener('mouseleave', (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && cursor.current) {
          gsap.to(`#${cursor.current.id}`, {
            width: `${cursorSize}`,
            height: `${cursorSize}`,
            duration: sizeAnimationDuration,
            ease: sizeAnimationEase,
            overwrite: true,
          });
        }
      });
    });

    //exclusions event listener
    exclusionElements.forEach(el => {
      el.addEventListener('mouseenter', (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && cursor.current) {
          cursor.current.classList.add('exclusion');
        }
      });
    });
    exclusionElements.forEach(el => {
      el.addEventListener('mouseleave', (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && cursor.current) {
          cursor.current.classList.remove('exclusion');
        }
      });
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
