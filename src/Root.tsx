import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import script from '../data/script.json';
import type {Script} from './types';

export const FPS = 30;
export const HOOK_SEC = 3.5;
export const CTA_SEC = 4;

const data = script as unknown as Script;

export const hookSecOf = (s: Script) => s.hookSec ?? HOOK_SEC;
export const ctaSecOf = (s: Script) => s.ctaSec ?? CTA_SEC;
export const totalFrames = (s: Script) =>
  Math.round((hookSecOf(s) + s.scenes.reduce((a, b) => a + b.t, 0) + ctaSecOf(s)) * FPS);

export const Root: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={totalFrames(data)}
    defaultProps={{script: data}}
    calculateMetadata={({props}) => ({durationInFrames: totalFrames(props.script as Script)})}
  />
);
