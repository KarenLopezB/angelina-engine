const canvas = document.getElementById('glcanvas');

const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

  const loadShader = (gl, type, source)=>{
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);  
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
  }

  const initShader = (gl, vsSource, fsSource)=>{
      const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
      const shaderProgram = gl.createProgram();

      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
      }

      return shaderProgram;
}

const initBuffers = gl =>{
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  const positions = [
    -1.0,  1.0,
     1.0,  1.0,
    -1.0, -1.0,
     1.0, -1.0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW
    );

    return {
      position: positionBuffer,
    };

}

const drawScene = (gl,programInfo, buffers)=>{

  gl.clearColor(0, 0, 0, 1);  
  gl.clearDepth(1);                 
  gl.enable(gl.DEPTH_TEST);           
  gl.depthFunc(gl.LEQUAL);  
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  /* CAMARA */ 

  const fieldOfView = 45 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100;
  const projectionMatrix = mat4.create();

}

const main = ()=>{
    const gl = canvas.getContext('webgl2');

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const shaderProgram = initShader(gl, vsSource, fsSource);

    const programInfo = {
      program : shaderProgram,
      attribLocations : {
        vertexPosition : gl.getAttribLocation(shaderProgram, 'aVertexPosition')
      },
      uniformLocations : {
        projectionMatrix : gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix : gl.getUniformLocation(shaderProgram, 'uModelViewMatrix' )
      }
    };

    const buffers = initBuffers(gl);

    drawScene(gl, programInfo, buffers);

}

window.onload = main;