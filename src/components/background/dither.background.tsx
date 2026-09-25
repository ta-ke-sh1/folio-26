import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

type RGB = [number, number, number];
type Uniform<T> = { value: T };

type DitherUniforms = {
  resolution: Uniform<[number, number]>;
  time: Uniform<number>;
  waveSpeed: Uniform<number>;
  waveFrequency: Uniform<number>;
  waveAmplitude: Uniform<number>;
  waveColor: Uniform<RGB>;
  backgroundColor: Uniform<RGB>;
  mousePos: Uniform<[number, number]>;
  enableMouseInteraction: Uniform<number>;
  mouseRadius: Uniform<number>;
  colorNum: Uniform<number>;
  pixelSize: Uniform<number>;
};

export type DitherProps = {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: RGB;
  backgroundColor?: RGB;
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  className?: string;
};

type DitherSettings = {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: RGB;
  backgroundColor: RGB;
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
};

const DEFAULT_WAVE_COLOR: RGB = [0.5, 0.5, 0.5];
const DEFAULT_BACKGROUND_COLOR: RGB = [0, 0, 0];

const vertexShader = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec3 backgroundColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;
uniform float colorNum;
uniform float pixelSize;
varying vec2 vUv;

vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fadeXY = fade(Pf.xy);
  vec2 nx = mix(vec2(n00, n01), vec2(n10, n11), fadeXY.x);
  return 2.3 * mix(nx.x, nx.y, fadeXY.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 1.0;
  float frequency = waveFrequency;
  for (int octave = 0; octave < 4; octave++) {
    value += amplitude * abs(cnoise(p));
    p *= frequency;
    amplitude *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 shifted = p - time * waveSpeed;
  return fbm(p + fbm(shifted));
}

float bayer8x8(vec2 pixel) {
  float x = mod(pixel.x, 8.0);
  float y = mod(pixel.y, 8.0);
  float threshold = 0.0;

  // Ordered-dither Bayer threshold, computed without a lookup texture.
  for (int bit = 0; bit < 3; bit++) {
    float bitValue = exp2(float(bit));
    float xb = mod(floor(x / bitValue), 2.0);
    float yb = mod(floor(y / bitValue), 2.0);
    float quadrant = 0.0;
    if (xb == 0.0 && yb == 1.0) quadrant = 2.0;
    else if (xb == 1.0 && yb == 0.0) quadrant = 3.0;
    else if (xb == 1.0 && yb == 1.0) quadrant = 1.0;
    threshold += exp2(4.0 - 2.0 * float(bit)) * quadrant;
  }
  return threshold / 64.0;
}

vec3 ditherColor(vec2 pixel, vec3 color) {
  float levels = max(colorNum - 1.0, 1.0);
  color += (bayer8x8(floor(pixel / max(pixelSize, 1.0))) - 0.25) / levels;
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float bias = mix(0.2, 0.0, smoothstep(0.45, 0.8, luminance));
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * levels + 0.5) / levels;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 centered = uv - 0.5;
  centered.x *= resolution.x / resolution.y;
  float value = pattern(centered);

  if (enableMouseInteraction == 1) {
    vec2 mouse = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouse.x *= resolution.x / resolution.y;
    float distanceToMouse = length(centered - mouse);
    float influence = 1.0 - smoothstep(0.0, max(mouseRadius, 0.0001), distanceToMouse);
    value -= 0.5 * influence;
  }

  vec3 color = mix(backgroundColor, waveColor, clamp(value, 0.0, 1.0));
  gl_FragColor = vec4(ditherColor(gl_FragCoord.xy, color), 1.0);
}
`;

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = DEFAULT_WAVE_COLOR,
  backgroundColor = DEFAULT_BACKGROUND_COLOR,
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
  className,
}: DitherProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const programRef = useRef<Program | null>(null);
  const uniformsRef = useRef<DitherUniforms | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const propsRef = useRef<DitherSettings>({
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    waveColor,
    backgroundColor,
    colorNum,
    pixelSize,
    disableAnimation,
    enableMouseInteraction,
    mouseRadius,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const settings = propsRef.current;

    const renderer = new Renderer({
      canvas,
      dpr: 1,
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    const gl = renderer.gl;
    const uniforms: DitherUniforms = {
      resolution: { value: [1, 1] },
      time: { value: 0 },
      waveSpeed: { value: settings.waveSpeed },
      waveFrequency: { value: settings.waveFrequency },
      waveAmplitude: { value: settings.waveAmplitude },
      waveColor: { value: [...settings.waveColor] },
      backgroundColor: { value: [...settings.backgroundColor] },
      mousePos: { value: [0, 0] },
      enableMouseInteraction: { value: settings.enableMouseInteraction ? 1 : 0 },
      mouseRadius: { value: settings.mouseRadius },
      colorNum: { value: settings.colorNum },
      pixelSize: { value: settings.pixelSize },
    };
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms,
    });
    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    rendererRef.current = renderer;
    programRef.current = program;
    meshRef.current = mesh;
    uniformsRef.current = uniforms;

    const draw = () => {
      if (meshRef.current) renderer.render({ scene: meshRef.current });
    };
    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      uniforms.resolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
      uniforms.mousePos.value = [gl.drawingBufferWidth / 2, gl.drawingBufferHeight / 2];
      draw();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const onPointerMove = (event: PointerEvent) => {
      if (!propsRef.current.enableMouseInteraction) return;
      const rect = canvas.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return;
      }
      uniforms.mousePos.value = [event.clientX - rect.left, event.clientY - rect.top];
      if (propsRef.current.disableAnimation) draw();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      program.remove();
      rendererRef.current = null;
      meshRef.current = null;
      programRef.current = null;
      uniformsRef.current = null;
    };
  }, []);

  useEffect(() => {
    propsRef.current = {
      waveSpeed,
      waveFrequency,
      waveAmplitude,
      waveColor,
      backgroundColor,
      colorNum,
      pixelSize,
      disableAnimation,
      enableMouseInteraction,
      mouseRadius,
    };

    const uniforms = uniformsRef.current;
    if (!uniforms) return;
    uniforms.waveSpeed.value = waveSpeed;
    uniforms.waveFrequency.value = waveFrequency;
    uniforms.waveAmplitude.value = waveAmplitude;
    uniforms.waveColor.value = [...waveColor];
    uniforms.backgroundColor.value = [...backgroundColor];
    uniforms.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    uniforms.mouseRadius.value = mouseRadius;
    uniforms.colorNum.value = colorNum;
    uniforms.pixelSize.value = pixelSize;
    if (disableAnimation && rendererRef.current && meshRef.current) {
      rendererRef.current.render({ scene: meshRef.current });
    }
  }, [
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    waveColor,
    backgroundColor,
    colorNum,
    pixelSize,
    disableAnimation,
    enableMouseInteraction,
    mouseRadius,
  ]);

  useEffect(() => {
    if (disableAnimation) return;
    const uniforms = uniformsRef.current;
    const renderer = rendererRef.current;
    const mesh = meshRef.current;
    if (!uniforms || !renderer || !mesh) return;

    let startTime: number | null = null;
    const renderFrame = (now: number) => {
      if (startTime === null) startTime = now;
      uniforms.time.value = (now - startTime) / 1000;
      renderer.render({ scene: mesh });
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };
    animationFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [disableAnimation]);

  return (
    <div
      ref={containerRef}
      className={className ? `dither-container ${className}` : "dither-container"}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
