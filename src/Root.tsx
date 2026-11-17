import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import script from '../data/script.json';
import type {Script} from './types';

export const FPS = 30;
export const HOOK_SEC = 3.5;
export const CTA_SEC = 4;

const data = script as unknown as Script;

export const totalFrames = (s: Script) =>
  Math.round((HOOK_SEC + s.scenes.reduce((a, b) => a + b.t, 0) + CTA_SEC) * FPS);

export const Root: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={totalFrames(data)}
    defaultProps={{script: data}}
  />
);
