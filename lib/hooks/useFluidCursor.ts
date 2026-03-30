// @ts-nocheck
const useFluidCursor = () => {
    const canvas = document.getElementById('fluid');
    if (!canvas) return;
    resizeCanvas();

    // Mobile performance degradation: reduce resolution on touch devices
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    let config = {
      SIM_RESOLUTION: isTouchDevice ? 64 : 128,
      DYE_RESOLUTION: isTouchDevice ? 720 : 1440,
      CAPTURE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 3.5,
      VELOCITY_DISSIPATION: 2,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 20,
      CURL: 3,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLOR_UPDATE_SPEED: 10,
      PAUSED: false,
      BACK_COLOR: { r: 0.5, g: 0, b: 0 },
      TRANSPARENT: true,
    };

    function pointerPrototype() {
      this.id = -1;
      this.texcoordX = 0;
      this.texcoordY = 0;
      this.prevTexcoordX = 0;
      this.prevTexcoordY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
      this.down = false;
      this.moved = false;
      this.color = [0, 0, 0];
    }

    const pointers = [];
    pointers.push(new pointerPrototype());

    const result = getWebGLContext(canvas);
    if (!result) return;
    const { gl, ext } = result;

    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    function getWebGLContext(canvas) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };

      let gl = canvas.getContext('webgl2', params);
      const isWebGL2 = !!gl;
      if (!isWebGL2)
        gl =
          canvas.getContext('webgl', params) ||
          canvas.getContext('experimental-webgl', params);

      if (!gl) return null;

      let halfFloat;
      let supportLinearFiltering;
      if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float');
        supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
      } else {
        halfFloat = gl.getExtension('OES_texture_half_float');
        supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      const halfFloatTexType = isWebGL2
        ? gl.HALF_FLOAT
        : halfFloat.HALF_FLOAT_OES;
      let formatRGBA;
      let formatRG;
      let formatR;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(
          gl,
          gl.RGBA16F,
          gl.RGBA,
          halfFloatTexType
        );
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering,
        },
      };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F:
            return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
          case gl.RG16F:
            return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
          default:
            return null;
        }
      }

      return {
        internalFormat,
        format,
      };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        4,
        4,
        0,
        format,
        type,
        null
      );

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );

      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      return status == gl.FRAMEBUFFER_COMPLETE;
    }

    class Material {
      constructor(vertexShader, fragmentShaderSource) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = [];
        this.activeProgram = null;
        this.uniforms = [];
      }

      setKeywords(keywords) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);

        let program = this.programs[hash];
        if (program == null) {
          let fragmentShader = compileShader(
            gl.FRAGMENT_SHADER,
            this.fragmentShaderSource,
            keywords
          );
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
        }

        if (program == this.activeProgram) return;

        this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }

      bind() {
        gl.useProgram(this.activeProgram);
      }
    }

    class Program {
      constructor(vertexShader, fragmentShader) {
        this.uniforms = {};
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program);
      }

      bind() {
        gl.useProgram(this.program);
      }
    }

    function createProgram(vertexShader, fragmentShader) {
      let program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        // WebGL program link failed - silently ignore in production
      }

      return program;
    }

    function getUniforms(program) {
      let uniforms = [];
      let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        let uniformName = gl.getActiveUniform(program, i).name;
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
      }
      return uniforms;
    }

    function compileShader(type, source, keywords) {
      source = addKeywords(source, keywords);

      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // WebGL shader compile failed - silently ignore in production
      }

      return shader;
    }

    function addKeywords(source, keywords) {
      if (keywords == null) return source;
      let keywordsString = '';
      keywords.forEach((keyword) => {
        keywordsString += '#define ' + keyword + '\n';
      });

      return keywordsString + source;
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
         precision highp float;

         attribute vec2 aPosition;
         varying vec2 vUv;
         varying vec2 vL;
         varying vec2 vR;
         varying vec2 vT;
         varying vec2 vB;
         uniform vec2 texelSize;

         void main () {
             vUv = aPosition * 0.5 + 0.5;
             vL = vUv - vec2(texelSize.x, 0.0);
             vR = vUv + vec2(texelSize.x, 0.0);
             vT = vUv + vec2(0.0, texelSize.y);
             vB = vUv - vec2(0.0, texelSize.y);
             gl_Position = vec4(aPosition, 0.0, 1.0);
         }
     `
    );

    const blurVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
         precision highp float;

         attribute vec2 aPosition;
         varying vec2 vUv;
         varying vec2 vL;
         varying vec2 vR;
         uniform vec2 texelSize;

         void main () {
             vUv = aPosition * 0.5 + 0.5;
             float offset = 1.33333333;
             vL = vUv - texelSize * offset;
             vR = vUv + texelSize * offset;
             gl_Position = vec4(aPosition, 0.0, 1.0);
         }
     `
    );

    const blurShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
         precision mediump float;
         precision mediump sampler2D;

         varying vec2 vUv;
         varying vec2 vL;
         varying vec2 vR;
         uniform sampler2D uTexture;

         void main () {
             vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
             sum += texture2D(uTexture, vL) * 0.35294117;
             sum += texture2D(uTexture, vR) * 0.35294117;
             gl_FragColor = sum;
         }
     `
    );

    const copyShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
         precision mediump float;
         precision mediump sampler2D;

         varying highp vec2 vUv;
         uniform sampler2D uTexture;

         void main () {
             gl_FragColor = texture2D(uTexture, vUv);
         }
     `
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
         precision mediump float;
         precision mediump sampler2D;

         varying highp vec2 vUv;
         uniform sampler2D uTexture;
         uniform float value;

         void main () {
             gl_FragColor = value * texture2D(uTexture, vUv);
         }
     `
    );

    const colorShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
         precision mediump float;

         uniform vec4 color;

         void main () {
             gl_FragColor = color;
         }
     `
    );

    const displayShaderSource = `
         precision highp float;
         precision highp sampler2D;

         varying vec2 vUv;
         varying vec2 vL;
         varying vec2 vR;
         varying vec2 vT;
         varying vec2 vB;
         uniform sampler2D uTexture;
         uniform sampler2D uDithering;
         uniform vec2 ditherScale;
         uniform vec2 texelSize;

         vec3 linearToGamma (vec3 color) {
             color = max(color, vec3(0));
             return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
         }

         void main () {
             vec3 c = texture2D(uTexture, vUv).rgb;

         #ifdef SHADING
             vec3 lc = texture2D(uTexture, vL).rgb;
             vec3 rc = texture2D(uTexture, vR).rgb;
             vec3 tc = texture2D(uTexture, vT).rgb;
             vec3 bc = texture2D(uTexture, vB).rgb;

             float dx = length(rc) - length(lc);
             float dy = length(tc) - length(bc);

             vec3 n = normalize(vec3(dx, dy, length(texelSize)));
             vec3 l = vec3(0.0, 0.0, 1.0);

             float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
             c *= diffuse;
         #endif

             float a = max(c.r, max(c.g, c.b));
             gl_FragColor = vec4(c, a);
         }
     `;

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
         precision highp float;
         precision highp sampler2D;

         varying vec2 vUv;
         uniform sampler2D uTarget;
         uniform float aspectRatio;
         uniform vec3 color;
         uniform vec2 point;
         uniform float radius;

         void main () {
             vec2 p = vUv - point.xy;
             p.x *= aspectRatio;
             vec3 splat = exp(-dot(p, p) / radius) * color;
             vec3 base = texture2D(uTarget, vUv).xyz;
             gl_FragColor = vec4(base + splat, 1.0);
         }
     `
    );

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
         precision highp float;
         precision highp sampler2D;

         varying vec2 vUv;
         uniform sampler2D uVelocity;
         uniform sampler2D uSource;
         uniform vec2 texelSize;
         uniform vec2 dyeTexelSize;
         uniform float dt;
         uniform float dissipation;

         vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
             vec2 st = uv / tsize - 0.5;

             vec2 iuv = floor(st);
             vec2 fuv = fract(st);

             vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
             vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
             vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
             vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

             return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
         }

         void main () {
         #ifdef MANUAL_FILTERING
             vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
             vec4 result = bilerp(uSource, coord, dyeTexelSize);
         #else
             vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
             vec4 result = texture2D(uSource, coord);
         #endif
             float decay = 1.0 + dissipation * dt;
             gl_FragColor = result / decay;
         }`,
      ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
         precision mediump float;
         precision mediump sampler2D;

         varying highp vec2 vUv;
         varying highp vec2 vL;
         varying highp vec2 vR;
         varying highp vec2 vT;
         varying highp vec2 vB;
         uniform sampler2D uVelocity;

         void main () {
             float L = texture2D(uVelocity, vL).x;
             float R = texture2D(uVelocity, vR).x;
             float T = texture2D(uVelocity, vT).y;
             float B = texture2D(uVelocity, vB).y;

             vec2 C = texture2D(uVelocity, vUv).xy;
             if (vL.x < 0.0) { L = -C.x; }
             if (vR.x > 1.0) { R = -C.x; }
             if (vT.y > 1.0) { T = -C.y; }
             if (vB.y < 0.0) { B = -C.y; }

             float div = 0.5 * (R - L + T - B);
             gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
         }
     `
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
         precision mediump float;
         precision mediump sampler2D;

         varying highp vec2 vUv;
         varying highp vec2 vL;
         varying highp vec2 vR;
         varying highp vec2 vT;
         varying highp vec2 vB;
         uniform sampler2D uVelocity;

         void main () {
             float L = texture2D(uVelocity, vL).y;
             float R = texture2D(uVelocity, vR).y;
             float T = texture2D(uVelocity, vT).x;
             float B = texture2D(uVelocity, vB).x;
             float vorticity = R - L - T + B;
             gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
         }
     `
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
         precision highp float;
         precision highp sampler2D;

         varying vec2 vUv;
         varying vec2 vL;
         varying vec2 vR;
         varying vec2 vT;
         varying vec2 vB;
         uniform sampler2D uVelocity;
         uniform sampler2D uCurl;
         uniform float curl;
         uniform float dt;

         void main () {
             float L = texture2D(uCurl, vL).x;
             float R = texture2D(uCurl, vR).x;
             float T = texture2D(uCurl, vT).x;
             float B = texture2D(uCurl, vB).x;
             float C = texture2D(uCurl, vUv).x;

             vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
             force /= length(force) + 0.0001;
             force *= curl * C;
             force.y *= -1.0;

             vec2 velocity = texture2D(uVelocity, vUv).xy;
             velocity += force * dt;
             velocity = min(max(velocity, -1000.0), 1000.0);
             gl_FragColor = vec4(velocity, 0.0, 1.0);
         }
     `
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
         precision mediump float;
         precision mediump sampler2D;

         varying highp vec2 vUv;
         varying highp vec2 vL;
         varying highp vec2 vR;
         varying highp vec2 vT;
         varying highp vec2 vB;
         uniform sampler2D uPressure;
         uniform sampler2D uDivergence;

         void main () {
             float L = texture2D(uPressure, vL).x;
             float R = texture2D(uPressure, vR).x;
             float T = texture2D(uPressure, vT).x;
             float B = texture2D(uPressure, vB).x;
             float C = texture2D(uPressure, vUv).x;
             float divergence = texture2D(uDivergence, vUv).x;
             float pressure = (L + R + B + T - divergence) * 0.25;
             gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
         }
     `
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
         precision mediump float;
         precision mediump sampler2D;

         varying highp vec2 vUv;
         varying highp vec2 vL;
         varying highp vec2 vR;
         varying highp vec2 vT;
         varying highp vec2 vB;
         uniform sampler2D uPressure;
         uniform sampler2D uVelocity;

         void main () {
             float L = texture2D(uPressure, vL).x;
             float R = texture2D(uPressure, vR).x;
             float T = texture2D(uPressure, vT).x;
             float B = texture2D(uPressure, vB).x;
             vec2 velocity = texture2D(uVelocity, vUv).xy;
             velocity.xy -= vec2(R - L, T - B);
             gl_FragColor = vec4(velocity, 0.0, 1.0);
         }
     `
    );

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      return (target, clear = false) => {
        if (target == null) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        if (clear) {
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    let dye;
    let velocity;
    let divergence;
    let curl;
    let pressure;

    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new Program(
      baseVertexShader,
      gradientSubtractShader
    );

    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    function initFramebuffers() {
      let simRes = getResolution(config.SIM_RESOLUTION);
      let dyeRes = getResolution(config.DYE_RESOLUTION);

      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

      gl.disable(gl.BLEND);

      if (dye == null)
        dye = createDoubleFBO(
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      else
        dye = resizeDoubleFBO(
          dye,
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );

      if (velocity == null)
        velocity = createDoubleFBO(
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      else
        velocity = resizeDoubleFBO(
          velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );

      divergence = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      curl = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
    }

    function createFBO(w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0);
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      );

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      let texelSizeX = 1.0 / w;
      let texelSizeY = 1.0 / h;

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);

      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function resizeFBO(target, w, h, internalFormat, format, type, param) {
      let newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      return newFBO;
    }

    function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
      if (target.width == w && target.height == h) return target;
      target.read = resizeFBO(
        target.read,
        w,
        h,
        internalFormat,
        format,
        type,
        param
      );
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;
      return target;
    }

    function createTextureAsync(url) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGB,
        1,
        1,
        0,
        gl.RGB,
        gl.UNSIGNED_BYTE,
        new Uint8Array([255, 255, 255])
      );

      let obj = {
        texture,
        width: 1,
        height: 1,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };

      let image = new Image();
      image.onload = () => {
        obj.width = image.width;
        obj.height = image.height;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      };
      image.src = url;

      return obj;
    }

    function updateKeywords() {
      let displayKeywords = [];
      if (config.SHADING) displayKeywords.push('SHADING');
      displayMaterial.setKeywords(displayKeywords);
    }

    updateKeywords();
    initFramebuffers();

    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;

    function update() {
      const dt = calcDeltaTime();
      if (resizeCanvas()) initFramebuffers();
      updateColors(dt);
      applyInputs();
      step(dt);
      render(null);
      requestAnimationFrame(update);
    }

    function calcDeltaTime() {
      let now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    }

    function resizeCanvas() {
      let width = scaleByPixelRatio(canvas.clientWidth);
      let height = scaleByPixelRatio(canvas.clientHeight);
      if (canvas.width != width || canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    function updateColors(dt) {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointers.forEach((p) => {
          p.color = generateColor();
        });
      }
    }

    function applyInputs() {
      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false;
          splatPointer(p);
        }
      });
    }

    function step(dt) {
      gl.disable(gl.BLEND);

      curlProgram.bind();
      gl.uniform2f(
        curlProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      gl.uniform2f(
        vorticityProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(
        divergenceProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(
        pressureProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradienSubtractProgram.bind();
      gl.uniform2f(
        gradienSubtractProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(
        gradienSubtractProgram.uniforms.uPressure,
        pressure.read.attach(0)
      );
      gl.uniform1i(
        gradienSubtractProgram.uniforms.uVelocity,
        velocity.read.attach(1)
      );
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(
        advectionProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      if (!ext.supportLinearFiltering)
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      let velocityId = velocity.read.attach(0);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.VELOCITY_DISSIPATION
      );
      blit(velocity.write);
      velocity.swap();

      if (!ext.supportLinearFiltering)
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          dye.texelSizeX,
          dye.texelSizeY
        );
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.DENSITY_DISSIPATION
      );
      blit(dye.write);
      dye.swap();
    }

    function render(target) {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      drawDisplay(target);
    }

    function drawDisplay(target) {
      let width = target == null ? gl.drawingBufferWidth : target.width;
      let height = target == null ? gl.drawingBufferHeight : target.height;

      displayMaterial.bind();
      if (config.SHADING)
        gl.uniform2f(
          displayMaterial.uniforms.texelSize,
          1.0 / width,
          1.0 / height
        );
      gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      blit(target);
    }

    function splatPointer(pointer) {
      let dx = pointer.deltaX * config.SPLAT_FORCE;
      let dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function clickSplat(pointer) {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      let dx = 10 * (Math.random() - 0.5);
      let dy = 30 * (Math.random() - 0.5);
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }

    function splat(x, y, dx, dy, color) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(
        splatProgram.uniforms.aspectRatio,
        canvas.width / canvas.height
      );
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(
        splatProgram.uniforms.radius,
        correctRadius(config.SPLAT_RADIUS / 100.0)
      );
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function correctRadius(radius) {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    if (isTouchDevice) {
      // Mobile: replay recorded trajectory in a continuous loop
      update();

      const trajectory = [{"t":0,"x":0.7274,"y":0.3222},{"t":101,"x":0.7348,"y":0.3232},{"t":217,"x":0.7743,"y":0.3222},{"t":484,"x":0.8138,"y":0.3506},{"t":601,"x":0.8419,"y":0.4883},{"t":717,"x":0.7749,"y":0.5157},{"t":817,"x":0.6651,"y":0.4944},{"t":1067,"x":0.5646,"y":0.4863},{"t":1167,"x":0.3784,"y":0.5147},{"t":1267,"x":0.3001,"y":0.5826},{"t":1367,"x":0.2659,"y":0.7001},{"t":1467,"x":0.2746,"y":0.7852},{"t":1567,"x":0.3081,"y":0.8257},{"t":1667,"x":0.3664,"y":0.848},{"t":1767,"x":0.4648,"y":0.848},{"t":1884,"x":0.5593,"y":0.8409},{"t":2000,"x":0.6376,"y":0.7771},{"t":2100,"x":0.6698,"y":0.6778},{"t":2200,"x":0.6758,"y":0.5897},{"t":2300,"x":0.6571,"y":0.539},{"t":2400,"x":0.6042,"y":0.5117},{"t":2500,"x":0.5365,"y":0.5096},{"t":2600,"x":0.4454,"y":0.4995},{"t":2700,"x":0.353,"y":0.46},{"t":2800,"x":0.3175,"y":0.3921},{"t":2916,"x":0.3168,"y":0.2746},{"t":3017,"x":0.3543,"y":0.2057},{"t":3117,"x":0.4253,"y":0.1702},{"t":3234,"x":0.5452,"y":0.1702},{"t":3367,"x":0.6189,"y":0.2523},{"t":3484,"x":0.6216,"y":0.3566},{"t":3600,"x":0.5097,"y":0.385},{"t":3700,"x":0.3999,"y":0.4286},{"t":3800,"x":0.3188,"y":0.538},{"t":3900,"x":0.2927,"y":0.7011},{"t":4000,"x":0.3135,"y":0.7619},{"t":4100,"x":0.3811,"y":0.8156},{"t":4200,"x":0.491,"y":0.8399},{"t":4300,"x":0.5867,"y":0.8328},{"t":4400,"x":0.6644,"y":0.7953},{"t":4500,"x":0.714,"y":0.7619},{"t":4750,"x":0.714,"y":0.7599},{"t":4850,"x":0.6792,"y":0.8176},{"t":4950,"x":0.5666,"y":0.8845},{"t":5050,"x":0.4046,"y":0.8774},{"t":5150,"x":0.1346,"y":0.7366},{"t":5250,"x":0.1373,"y":0.5319},{"t":5350,"x":0.2177,"y":0.4559},{"t":5450,"x":0.357,"y":0.4377},{"t":5551,"x":0.5425,"y":0.3789},{"t":5667,"x":0.6577,"y":0.2614},{"t":5816,"x":0.6484,"y":0.1408},{"t":5916,"x":0.5378,"y":0.1114},{"t":6016,"x":0.43,"y":0.1084},{"t":6117,"x":0.3463,"y":0.151},{"t":6233,"x":0.3302,"y":0.2857},{"t":6333,"x":0.4133,"y":0.4063},{"t":6450,"x":0.5774,"y":0.4853},{"t":6550,"x":0.653,"y":0.4995},{"t":6650,"x":0.6885,"y":0.5289},{"t":6766,"x":0.7194,"y":0.6535},{"t":6867,"x":0.712,"y":0.769},{"t":6967,"x":0.6772,"y":0.849},{"t":7067,"x":0.6135,"y":0.8926},{"t":7167,"x":0.4722,"y":0.8926},{"t":7267,"x":0.355,"y":0.8582},{"t":7367,"x":0.2934,"y":0.7335},{"t":7483,"x":0.3463,"y":0.6282},{"t":7583,"x":0.4561,"y":0.5289},{"t":7683,"x":0.5626,"y":0.4235},{"t":7783,"x":0.6376,"y":0.2877},{"t":7883,"x":0.6571,"y":0.1753},{"t":7983,"x":0.6463,"y":0.1135},{"t":8083,"x":0.6316,"y":0.0983},{"t":8200,"x":0.5459,"y":0.078},{"t":8300,"x":0.4494,"y":0.0669},{"t":8403,"x":0.3778,"y":0.1094},{"t":8517,"x":0.3369,"y":0.2553},{"t":8617,"x":0.3952,"y":0.3972},{"t":8733,"x":0.5747,"y":0.5167},{"t":8850,"x":0.6738,"y":0.6109},{"t":8950,"x":0.6845,"y":0.7589},{"t":9050,"x":0.6209,"y":0.8734},{"t":9150,"x":0.5378,"y":0.9149},{"t":9250,"x":0.4159,"y":0.9058},{"t":9350,"x":0.3208,"y":0.8298},{"t":9450,"x":0.3001,"y":0.7416},{"t":9550,"x":0.357,"y":0.6089},{"t":9651,"x":0.4334,"y":0.5299},{"t":9767,"x":0.578,"y":0.4124},{"t":9883,"x":0.6845,"y":0.2492},{"t":9984,"x":0.6792,"y":0.1824},{"t":10084,"x":0.6222,"y":0.1378},{"t":10200,"x":0.5003,"y":0.0963},{"t":10300,"x":0.4193,"y":0.0821},{"t":10401,"x":0.3865,"y":0.0973},{"t":10517,"x":0.3429,"y":0.1945},{"t":10617,"x":0.3322,"y":0.2665},{"t":10717,"x":0.3289,"y":0.2786},{"t":10900,"x":0.3289,"y":0.2877},{"t":11000,"x":0.3838,"y":0.3779},{"t":11100,"x":0.5332,"y":0.4488},{"t":11200,"x":0.6504,"y":0.4934},{"t":11300,"x":0.6932,"y":0.6059},{"t":11400,"x":0.6798,"y":0.769},{"t":11500,"x":0.6484,"y":0.8349},{"t":11601,"x":0.5854,"y":0.8734},{"t":11717,"x":0.4829,"y":0.8693},{"t":11817,"x":0.4012,"y":0.8308},{"t":11933,"x":0.3583,"y":0.7477},{"t":12033,"x":0.3657,"y":0.6241},{"t":12134,"x":0.4441,"y":0.5481},{"t":12234,"x":0.5754,"y":0.5086},{"t":12351,"x":0.6691,"y":0.5066},{"t":12583,"x":0.6859,"y":0.4863},{"t":12684,"x":0.7207,"y":0.3627},{"t":12784,"x":0.7314,"y":0.2573},{"t":12900,"x":0.704,"y":0.1905},{"t":13000,"x":0.6236,"y":0.1297},{"t":13100,"x":0.5231,"y":0.0932},{"t":13217,"x":0.3838,"y":0.0729},{"t":13317,"x":0.361,"y":0.0709},{"t":13417,"x":0.3376,"y":0.0729},{"t":13517,"x":0.3068,"y":0.1023},{"t":13617,"x":0.28,"y":0.1986},{"t":13717,"x":0.2833,"y":0.3485},{"t":13817,"x":0.3985,"y":0.4428},{"t":13917,"x":0.649,"y":0.5198},{"t":14017,"x":0.7354,"y":0.5866},{"t":14117,"x":0.7515,"y":0.7042},{"t":14217,"x":0.7013,"y":0.8217},{"t":14317,"x":0.6095,"y":0.8744},{"t":14417,"x":0.4581,"y":0.8501},{"t":14517,"x":0.2532,"y":0.7173},{"t":14617,"x":0.2539,"y":0.6109},{"t":14717,"x":0.3684,"y":0.54},{"t":14817,"x":0.4889,"y":0.5137},{"t":14917,"x":0.6062,"y":0.4934},{"t":15017,"x":0.6517,"y":0.4833},{"t":15433,"x":0.6584,"y":0.5218},{"t":15533,"x":0.6624,"y":0.6798},{"t":15634,"x":0.6403,"y":0.8116},{"t":15750,"x":0.5713,"y":0.8896},{"t":15850,"x":0.4568,"y":0.8896},{"t":15950,"x":0.3603,"y":0.8045},{"t":16050,"x":0.3798,"y":0.616},{"t":16150,"x":0.4642,"y":0.5512},{"t":16250,"x":0.6216,"y":0.462},{"t":16350,"x":0.7328,"y":0.3121},{"t":16450,"x":0.7455,"y":0.2128},{"t":16550,"x":0.6631,"y":0.1378},{"t":16650,"x":0.5291,"y":0.0831},{"t":16750,"x":0.4648,"y":0.0628},{"t":16850,"x":0.438,"y":0.0588},{"t":17013,"x":0.4367,"y":0.0578},{"t":17117,"x":0.4066,"y":0.0628},{"t":17217,"x":0.3557,"y":0.1104},{"t":17317,"x":0.3228,"y":0.227},{"t":17417,"x":0.3396,"y":0.3465},{"t":17517,"x":0.5606,"y":0.46},{"t":17617,"x":0.6939,"y":0.4995},{"t":17717,"x":0.7234,"y":0.5127},{"t":17833,"x":0.7261,"y":0.537},{"t":17950,"x":0.7147,"y":0.7011},{"t":18050,"x":0.6651,"y":0.8085},{"t":18150,"x":0.5928,"y":0.8693},{"t":18250,"x":0.4916,"y":0.8784},{"t":18351,"x":0.3577,"y":0.8419},{"t":18467,"x":0.2981,"y":0.7427},{"t":18567,"x":0.3094,"y":0.5795},{"t":18667,"x":0.353,"y":0.4802},{"t":18820,"x":0.347,"y":0.4488},{"t":19005,"x":0.3463,"y":0.4468},{"t":19117,"x":0.3429,"y":0.3495},{"t":19217,"x":0.3697,"y":0.2128},{"t":19317,"x":0.4756,"y":0.1641},{"t":19417,"x":0.6008,"y":0.1631},{"t":19517,"x":0.6932,"y":0.2239},{"t":19617,"x":0.7348,"y":0.3029},{"t":19717,"x":0.7307,"y":0.3891},{"t":19817,"x":0.6021,"y":0.462},{"t":19933,"x":0.3376,"y":0.5258},{"t":20034,"x":0.2579,"y":0.6707},{"t":20150,"x":0.2954,"y":0.8237},{"t":20250,"x":0.418,"y":0.8551},{"t":20350,"x":0.5492,"y":0.8602},{"t":20450,"x":0.6336,"y":0.8602},{"t":20550,"x":0.6477,"y":0.8622},{"t":20650,"x":0.6496,"y":0.849},{"t":20750,"x":0.6553,"y":0.8106},{"t":20850,"x":0.6641,"y":0.7509},{"t":20950,"x":0.6752,"y":0.6756},{"t":21050,"x":0.6875,"y":0.5922},{"t":21150,"x":0.6999,"y":0.5088},{"t":21250,"x":0.711,"y":0.4335},{"t":21350,"x":0.7198,"y":0.3738},{"t":21450,"x":0.7254,"y":0.3354},{"t":21550,"x":0.7274,"y":0.3222}];

      const totalDuration = trajectory[trajectory.length - 1].t;
      let startTime = Date.now();
      let prevX = trajectory[0].x;
      let prevY = trajectory[0].y;

      // Interpolate position from trajectory at given time
      function getPosition(t) {
        const loopT = t % totalDuration;
        // Find surrounding keyframes
        let i = 0;
        while (i < trajectory.length - 1 && trajectory[i + 1].t <= loopT) i++;
        if (i >= trajectory.length - 1) return trajectory[trajectory.length - 1];
        const a = trajectory[i];
        const b = trajectory[i + 1];
        const frac = (loopT - a.t) / (b.t - a.t);
        return {
          x: a.x + (b.x - a.x) * frac,
          y: a.y + (b.y - a.y) * frac,
        };
      }

      setInterval(() => {
        const elapsed = (Date.now() - startTime) * 0.75;
        const pos = getPosition(elapsed);
        const dx = (pos.x - prevX) * config.SPLAT_FORCE;
        const dy = -(pos.y - prevY) * config.SPLAT_FORCE;

        if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
          const color = generateColor();
          splat(pos.x, pos.y, dx, dy, color);
        }

        prevX = pos.x;
        prevY = pos.y;
      }, 16);
    } else {
      // Desktop: mouse-driven fluid
      window.addEventListener('mousedown', (e) => {
        let pointer = pointers[0];
        let posX = scaleByPixelRatio(e.clientX);
        let posY = scaleByPixelRatio(e.clientY);
        updatePointerDownData(pointer, -1, posX, posY);
        clickSplat(pointer);
      });

      document.body.addEventListener('mousemove', function handleFirstMouseMove(e) {
        let pointer = pointers[0];
        let posX = scaleByPixelRatio(e.clientX);
        let posY = scaleByPixelRatio(e.clientY);
        let color = generateColor();

        update();
        updatePointerMoveData(pointer, posX, posY, color);

        document.body.removeEventListener('mousemove', handleFirstMouseMove);
      });

      window.addEventListener('mousemove', (e) => {
        let pointer = pointers[0];
        let posX = scaleByPixelRatio(e.clientX);
        let posY = scaleByPixelRatio(e.clientY);
        let color = pointer.color;

        updatePointerMoveData(pointer, posX, posY, color);
      });
    }

    function updatePointerDownData(pointer, id, posX, posY) {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
    }

    function updatePointerMoveData(pointer, posX, posY, color) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved =
        Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = color;
    }

    function updatePointerUpData(pointer) {
      pointer.down = false;
    }

    function correctDeltaX(delta) {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }

    function correctDeltaY(delta) {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }

    function generateColor() {
      let c = HSVtoRGB(Math.random(), 1.0, 1.0);
      c.r *= 0.15;
      c.g *= 0.15;
      c.b *= 0.15;
      return c;
    }

    function HSVtoRGB(h, s, v) {
      let r, g, b, i, f, p, q, t;
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0:
          (r = v), (g = t), (b = p);
          break;
        case 1:
          (r = q), (g = v), (b = p);
          break;
        case 2:
          (r = p), (g = v), (b = t);
          break;
        case 3:
          (r = p), (g = q), (b = v);
          break;
        case 4:
          (r = t), (g = p), (b = v);
          break;
        case 5:
          (r = v), (g = p), (b = q);
          break;
      }

      return {
        r,
        g,
        b,
      };
    }

    function wrap(value, min, max) {
      const range = max - min;
      if (range == 0) return min;
      return ((value - min) % range) + min;
    }

    function getResolution(resolution) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;

      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);

      if (gl.drawingBufferWidth > gl.drawingBufferHeight)
        return { width: max, height: min };
      else return { width: min, height: max };
    }

    function scaleByPixelRatio(input) {
      const pixelRatio = window.devicePixelRatio || 1;
      return Math.floor(input * pixelRatio);
    }

    function hashCode(s) {
      if (s.length == 0) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }
  };

  export default useFluidCursor;
