import React, { useEffect, useRef, useState } from 'react';
import {
  AsciiEngine,
  AsciiQuality,
  DEFAULT_ASCII_SOURCE,
} from '../visual/ascii-engine';

export type QualityTier = 'auto' | 'high' | 'low';

export interface AsciiEngineProps {
  className?: string;
  source?: string;
  density?: number;
  speed?: number;
  rain?: boolean;
  assemble?: boolean;
  quality?: AsciiQuality;
  paused?: boolean;
  replayOnUnpause?: boolean;
  replayTrigger?: number;
  interactiveBoost?: number;
  onEngineReady?: (engine: AsciiEngine) => void;
}

export const AsciiHackerArt: React.FC<AsciiEngineProps> = ({
  className = '',
  source = DEFAULT_ASCII_SOURCE,
  density = 0.85,
  speed = 0.6,
  rain = true,
  assemble = true,
  quality = 'auto',
  paused = false,
  replayOnUnpause = true,
  replayTrigger = 0,
  interactiveBoost = 0,
  onEngineReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<AsciiEngine | null>(null);
  const wasPausedRef = useRef<boolean>(paused);
  const [fallbackMode, setFallbackMode] = useState(false);

  // Instantiate AsciiEngine on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let engine: AsciiEngine;
    try {
      engine = new AsciiEngine(canvas, {
        source,
        density,
        speed,
        rain,
        assemble,
        quality,
      });
      engineRef.current = engine;

      engine.ready
        .then((readyEngine) => {
          if (paused) readyEngine.pause();
          onEngineReady?.(readyEngine);
        })
        .catch(() => {
          setFallbackMode(true);
        });
    } catch {
      setFallbackMode(true);
      return;
    }

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [source]);

  // Synchronize reactive options
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.set({ density, speed, rain, assemble, quality });
  }, [density, speed, rain, assemble, quality]);

  // Synchronize play/pause state and trigger fresh assembly when unpausing from boot loader
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) {
      wasPausedRef.current = paused;
      return;
    }
    if (paused) {
      engine.pause();
    } else {
      engine.resize();
      if (wasPausedRef.current && replayOnUnpause) {
        engine.replay();
        engine.pulseActivity(0.95);
      }
      engine.resume();
    }
    wasPausedRef.current = paused;
  }, [paused, replayOnUnpause]);

  // Explicit replay trigger when boot transition reveals the page
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || replayTrigger <= 0) return;
    engine.resize();
    engine.replay();
    engine.resume();
    engine.pulseActivity(1);
  }, [replayTrigger]);

  // Trigger subtle organic activity pulse when user interacts with forms/controls
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || interactiveBoost <= 0) return;
    engine.pulseActivity(interactiveBoost);
  }, [interactiveBoost]);

  return (
    <div className={`nt-art ${className}`}>
      {!fallbackMode ? (
        <canvas
          ref={canvasRef}
          className="nt-ascii"
          aria-hidden="true"
        />
      ) : (
        <img
          src={source}
          alt="Ilustración monocromática de un hacker encapuchado"
          className="nt-ascii"
        />
      )}
    </div>
  );
};
