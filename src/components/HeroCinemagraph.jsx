import React, { useEffect, useRef, useState } from 'react';

/**
 * HeroCinemagraph — Transforme la photo du header en un tableau vivant haute fidélité.
 * 
 * - Anime l'eau du Bassin d’Arcachon : houle douce vers la plage, risées du vent à la surface,
 *   scintillements du soleil (caustiques) sur l'eau turquoise.
 * - Brise légère dans les pins à l'horizon.
 * - Boucle 100% invisible et infinie (équations périodiques continues sans coupure).
 * - Fallback instantané sur <img> (zéro écran noir, LCP optimal).
 * - Détection automatique de visibilité (pause si hors champ ou onglet masqué pour 0% CPU).
 * - Respecte 'prefers-reduced-motion'.
 */
export default function HeroCinemagraph({
  src,
  alt = "Bassin d’Arcachon, Dune du Pilat et pinasses en bois",
  videoSrc = null,
  containerRef = null,
}) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [glReady, setGlReady] = useState(false);
  const [useVideo, setUseVideo] = useState(Boolean(videoSrc));

  // Si une vidéo directe MP4/WebM est fournie dans les réglages
  useEffect(() => {
    setUseVideo(Boolean(videoSrc));
  }, [videoSrc]);

  useEffect(() => {
    if (useVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [useVideo, videoSrc]);

  useEffect(() => {
    if (useVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect du souhait d'accessibilité de l'utilisateur
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const gl =
      canvas.getContext('webgl', { alpha: false, antialias: true, depth: false }) ||
      canvas.getContext('experimental-webgl');

    if (!gl) return;

    let isRunning = true;
    let animId = null;
    let startTime = performance.now();

    // Shaders
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        v_uv.y = 1.0 - v_uv.y;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform vec2 u_uv_scale;
      uniform vec2 u_uv_offset;
      uniform float u_time;
      varying vec2 v_uv;

      void main() {
        vec2 imgUV = v_uv * u_uv_scale + u_uv_offset;
        
        // Échantillonnage de référence
        vec4 base = texture2D(u_texture, clamp(imgUV, 0.0, 1.0));
        
        // Zone verticale de l'eau (Bassin : entre l'horizon 0.30 et la plage 0.84)
        float vWater = smoothstep(0.29, 0.36, imgUV.y) * smoothstep(0.88, 0.74, imgUV.y);
        
        // Couleur turquoise spécifique de l'eau (dominance vert/bleu sur rouge)
        float tealDiff = (base.g * 0.5 + base.b * 0.5) - base.r;
        float isWater = smoothstep(0.01, 0.12, tealDiff);
        
        // Ne pas déformer les toits rouges et cabanes en bois
        float isCabane = smoothstep(0.02, 0.12, base.r - base.b) * smoothstep(0.3, 0.55, imgUV.y) * (1.0 - isWater);
        
        // Masque final de l'eau
        float waterMask = vWater * isWater * (1.0 - isCabane);
        
        // Perspective : ondes plus serrées à l'horizon, plus amples près de la plage
        float persp = mix(0.35, 1.0, smoothstep(0.32, 0.78, imgUV.y));
        
        // 1. Houle douce et apaisante vers le rivage
        float k1 = (imgUV.y * 22.0 - imgUV.x * 5.0 - u_time * 1.25);
        float swell1 = sin(k1);
        
        // 2. Ondulation secondaire croisée
        float k2 = (imgUV.y * 36.0 + imgUV.x * 10.0 - u_time * 1.7);
        float swell2 = sin(k2);
        
        // 3. Risées et rides du vent à la surface du bassin
        float wind1 = sin(imgUV.x * 85.0 + imgUV.y * 40.0 - u_time * 3.0);
        float wind2 = cos(imgUV.x * 60.0 - imgUV.y * 75.0 + u_time * 2.4);
        float wind = (wind1 + wind2) * 0.5;
        
        // Déplacement doux des coordonnées texture
        vec2 disp = vec2(
          (swell1 * 0.0020 + wind * 0.0011),
          (swell1 * 0.0036 + swell2 * 0.0020 + wind * 0.0014)
        ) * persp * waterMask;
        
        // 4. Légère brise dans les pins en arrière-plan
        float treeZone = smoothstep(0.24, 0.28, imgUV.y) * smoothstep(0.35, 0.30, imgUV.y);
        float isTreeSide = step(0.65, imgUV.x) + (1.0 - step(0.32, imgUV.x));
        float treeWind = sin(imgUV.x * 25.0 + u_time * 0.85) * 0.0006 * treeZone * min(1.0, isTreeSide);
        disp.x += treeWind;
        
        // Échantillonnage avec déplacement
        vec2 sampleUV = clamp(imgUV + disp, 0.0, 1.0);
        vec4 color = texture2D(u_texture, sampleUV);
        
        // 5. Scintillements du soleil sur les crêtes de l'eau (caustiques naturelles)
        float crest = max(0.0, swell1 * 0.65 + swell2 * 0.35);
        float microPeak = max(0.0, wind);
        float glint = pow(crest * 0.7 + microPeak * 0.3, 3.8) * 0.24 * waterMask;
        color.rgb += vec3(glint * 1.0, glint * 0.96, glint * 0.84);
        
        // 6. Respiration très douce du clapotis au bord du sable
        float shoreZone = smoothstep(0.72, 0.77, imgUV.y) * smoothstep(0.85, 0.79, imgUV.y) * isWater;
        float shoreLap = sin(u_time * 1.1) * 0.5 + 0.5;
        color.rgb += vec3(0.04, 0.07, 0.08) * shoreZone * shoreLap;
        
        gl_FragColor = color;
      }
    `;

    function compileShader(source, type) {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Quad plein écran
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uUvScale = gl.getUniformLocation(program, 'u_uv_scale');
    const uUvOffset = gl.getUniformLocation(program, 'u_uv_offset');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uTexture = gl.getUniformLocation(program, 'u_texture');

    // Texture
    const texture = gl.createTexture();
    const image = new Image();
    image.crossOrigin = 'anonymous';

    let naturalW = 1376;
    let naturalH = 768;

    image.onload = () => {
      if (!isRunning) return;
      naturalW = image.naturalWidth || 1376;
      naturalH = image.naturalHeight || 768;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      setGlReady(true);
      resize();
      render();
    };
    image.src = src;

    function resize() {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);

      if (w === 0 || h === 0) return;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }

      // Calcul cover avec ancre à 40% vertical
      const c_ar = w / h;
      const i_ar = naturalW / naturalH;

      let sx = 1.0;
      let sy = 1.0;
      let ox = 0.0;
      let oy = 0.0;

      if (c_ar > i_ar) {
        const visibleH = i_ar / c_ar;
        sx = 1.0;
        sy = visibleH;
        ox = 0.0;
        oy = 0.4 * (1.0 - visibleH);
      } else {
        const visibleW = c_ar / i_ar;
        sx = visibleW;
        sy = 1.0;
        ox = 0.5 * (1.0 - visibleW);
        oy = 0.0;
      }

      gl.useProgram(program);
      gl.uniform2f(uUvScale, sx, sy);
      gl.uniform2f(uUvOffset, ox, oy);
      gl.uniform1i(uTexture, 0);
    }

    function render() {
      if (!isRunning) return;
      const now = (performance.now() - startTime) * 0.001;

      gl.useProgram(program);
      gl.uniform1f(uTime, now);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    }

    // Gestion de la visibilité pour préserver la batterie / GPU
    const handleVisibility = () => {
      if (document.hidden) {
        if (animId) cancelAnimationFrame(animId);
        animId = null;
      } else if (!animId && isRunning && glReady) {
        render();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let observer = null;
    if ('IntersectionObserver' in window && canvas.parentElement) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (!animId && isRunning && glReady) render();
        } else {
          if (animId) cancelAnimationFrame(animId);
          animId = null;
        }
      }, { threshold: 0.05 });
      observer.observe(canvas.parentElement);
    }

    window.addEventListener('resize', resize);

    return () => {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
      try {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(posBuffer);
        gl.deleteTexture(texture);
      } catch (_) {}
    };
  }, [src, useVideo]);

  return (
    <div className="hero-media-wrap" ref={containerRef}>
      {/* 1. Image de fond de référence (LCP instantané + sous-couche permanente pour zéro flash) */}
      <img
        src={src}
        alt={alt}
        fetchPriority="high"
        className={`hero-static-img ${glReady || useVideo ? 'ready' : ''}`}
      />

      {/* 2. Vidéo directe MP4 si activée */}
      {useVideo && videoSrc ? (
        <video
          ref={videoRef}
          className="hero-video"
          src={videoSrc}
          poster={src}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setUseVideo(false)}
          aria-label={alt}
        />
      ) : (
        /* 3. Canvas WebGL cinemagraph haute définition en boucle fluide invisible */
        <canvas
          ref={canvasRef}
          className={`hero-canvas ${glReady ? 'active' : ''}`}
          aria-label={`${alt} — vidéo en boucle avec vagues et brise`}
          role="img"
        />
      )}
    </div>
  );
}
