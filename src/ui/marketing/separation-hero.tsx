"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Gen 1:4 "separation of light and darkness" WebGL hero (Light & Darkness).
 * Ported from the prototype `TTSeparationField` shader to the `three` npm module.
 *
 * Accessibility / governance:
 *  - `prefers-reduced-motion` → renders a single static frame (no loop).
 *  - no-WebGL → the CSS gradient fallback on the parent stays visible (canvas absent).
 *  - This shader glow is a LOGGED design-rule exception (see TT-DESIGN-SYSTEM §12).
 */
const FRAG = `
precision highp float;
uniform float u_time; uniform vec2 u_res; uniform vec2 u_mouse; uniform float u_scroll;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  float t=u_time*0.05;
  float edge=0.5 + (u_mouse.x-0.5)*0.5 + sin(uv.y*3.0+t*2.0)*0.06 + fbm(vec2(uv.y*2.0,t))*0.12 - 0.06 + u_scroll*0.25;
  float band=0.045+fbm(vec2(uv.y*4.0,t))*0.03;
  float m=smoothstep(edge-band,edge+band,uv.x);
  vec3 dark=vec3(0.024,0.13,0.15);
  vec3 darkGlow=vec3(0.0,0.30,0.36);
  vec3 cream=vec3(0.925,0.878,0.776);
  vec3 ochre=vec3(0.79,0.54,0.23);
  float n=fbm(uv*vec2(u_res.x/u_res.y,1.0)*3.0+t);
  vec3 d=mix(dark,darkGlow,smoothstep(0.3,0.8,n)*0.6);
  vec3 l=mix(cream,ochre,smoothstep(0.55,0.85,n)*0.35);
  vec3 col=mix(d,l,m);
  float seam=smoothstep(band,0.0,abs(uv.x-edge));
  col+=vec3(0.55,0.85,0.9)*seam*0.45;
  gl_FragColor=vec4(col,1.0);
}`;

export function SeparationHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    } catch {
      return; // no WebGL → CSS gradient fallback on parent remains visible
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));

    const scene = new THREE.Scene();
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      u_time: { value: 0 },
      u_res: { value: new THREE.Vector2(1, 1) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_scroll: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: "void main(){gl_Position=vec4(position,1.0);}",
      fragmentShader: FRAG,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.u_res.value.set(
        w * renderer.getPixelRatio(),
        h * renderer.getPixelRatio(),
      );
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const target = { x: 0.5, y: 0.5 };
    const onPointer = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      uniforms.u_scroll.value = Math.min(
        window.scrollY / window.innerHeight,
        1,
      );
    };
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("scroll", onScroll, { passive: true });

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      uniforms.u_time.value += 0.016;
      uniforms.u_mouse.value.x += (target.x - uniforms.u_mouse.value.x) * 0.04;
      uniforms.u_mouse.value.y += (target.y - uniforms.u_mouse.value.y) * 0.04;
      renderer.render(scene, cam);
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else loop();
    };

    if (reduced) {
      uniforms.u_time.value = 4.0;
      renderer.render(scene, cam);
    } else {
      loop();
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
