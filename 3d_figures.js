//Esmeralda Magdaleno A01023086
var projectionMatrix;

var shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute,
shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

var duration = 5000; // ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change sides from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different side for each vertex.
var vertexShaderSource =
"    attribute vec3 vertexPos;\n" +
"    attribute vec4 vertexColor;\n" +
"    uniform mat4 modelViewMatrix;\n" +
"    uniform mat4 projectionMatrix;\n" +
"    varying vec4 vColor;\n" +
"    void main(void) {\n" +
"		// Return the transformed and projected vertex side\n" +
"        gl_Position = projectionMatrix * modelViewMatrix * \n" +
"            vec4(vertexPos, 1.0);\n" +
"        // Output the vertexColor in vColor\n" +
"        vColor = vertexColor;\n" +
"    }\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
var fragmentShaderSource =
"    precision lowp float;\n" +
"    varying vec4 vColor;\n" +
"    void main(void) {\n" +
"    gl_FragColor = vColor;\n" +
"}\n";

function initWebGL(canvas)
{
  var gl = null;
  var msg = "Your browser does not support WebGL, " +
  "or it is not enabled by default.";
  try
  {
    gl = canvas.getContext("experimental-webgl");
  }
  catch (e)
  {
    msg = "Error creating WebGL Context!: " + e.toString();
  }

  if (!gl)
  {
    alert(msg);
    throw new Error(msg);
  }

  return gl;
}

function initViewport(gl, canvas)
{
  gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
  // Create a project matrix with 45 degree field of view
  projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
  mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}



function createPyramid(gl, translation, rotationAxis){
  // Vertex Data
  var vertexBuffer;
  vertexBuffer = gl.createBuffer();
  var val = 2 * Math.PI/5;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  var verts = [
    Math.cos(1 * val), -1.0,  Math.sin(1 * val),
    0.0,  1.0,  0.0,
    Math.cos(2 * val), -1.0,  Math.sin(2 * val),

    Math.cos(2 * val), -1.0,  Math.sin(2 * val),
    0.0,  1.0,  0.0,
    Math.cos(3 * val), -1.0,  Math.sin(3 * val),

    Math.cos(3 * val), -1.0,  Math.sin(3 * val),
    0.0,  1.0,  0.0,
    Math.cos(4 * val), -1.0,  Math.sin(4 * val),

    Math.cos(4 * val), -1.0, Math.sin(4 * val),
    0.0,  1.0,  0.0,
    Math.cos(5 * val), -1.0, Math.sin(5 * val),

    Math.cos(5 * val), -1.0,  Math.sin(5 * val),
    0.0,  1.0,  0.0,
    Math.cos(1 * val), -1.0,  Math.sin(1 * val),

    Math.cos(1 * val), -1.0,  Math.sin(1 * val),
    0.0,  -1.0,  0.0,
    Math.cos(2 * val), -1.0,  Math.sin(2 * val),

    Math.cos(2 * val), -1.0,  Math.sin(2 * val),
    0.0,  -1.0,  0.0,
    Math.cos(3 * val), -1.0,  Math.sin(3 * val),

    Math.cos(3 * val), -1.0,  Math.sin(3 * val),
    0.0,  -1.0,  0.0,
    Math.cos(4 * val), -1.0,  Math.sin(4 * val),

    Math.cos(4 * val), -1.0, Math.sin(4 * val),
    0.0,  -1.0,  0.0,
    Math.cos(5 * val), -1.0, Math.sin(5 * val),

    Math.cos(5 * val), -1.0,  Math.sin(5 * val),
    0.0,  -1.0,  0.0,
    Math.cos(1 * val), -1.0,  Math.sin(1 * val),

  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

  // Color data
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  var faceColors = [
    [1.0, 0.0, 0.0, 1.0],
    [1.0, 1.0, 0.0, 1.0],
    [1.0, 0.0, 1.0, 1.0],
    [0.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 1.0],

    [0.0, 0.0, 0.0, 1.0],
    [0.0, 0.0, 0.0, 1.0],
    [0.0, 0.0, 0.0, 1.0],
    [0.0, 0.0, 0.0, 1.0],
    [0.0, 0.0, 0.0, 1.0]
  ];

  // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the pyramid's face.
  var vertexColors = [];
  // for (var i in faceColors)
  // {
  //     var color = faceColors[i];
  //     for (var j=0; j < 4; j++)
  //         vertexColors = vertexColors.concat(color);
  // }
  for (const color of faceColors)
  {
    for (var j=0; j < 3; j++)
    vertexColors = vertexColors.concat(color);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

  // Index data (defines the triangles to be drawn).
  var pyramidIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBuffer);
  var pyramidIndices = [
    0,1,2,
    3,4,5,
    6,7,8,
    9,10,11,
    12,13,14,
    15,16,17,
    18,19,20,
    21,22,23
  ];

  // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
  // Uint16Array: Array of 16-bit unsigned integers.
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);

  var pyramid = {
    buffer:vertexBuffer, colorBuffer:colorBuffer, indices:pyramidIndexBuffer,
    vertSize:3, nVerts:verts.length, colorSize:4, nColors: verts.length, nIndices:pyramidIndices.length,
    primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);

    pyramid.update = function()
    {
      var now = Date.now();
      var deltat = now - this.currentTime;
      this.currentTime = now;
      var fract = deltat / duration;
      var angle = Math.PI * 5 * fract;

      // Rotates a mat4 by the given angle
      // mat4 out the receiving matrix
      // mat4 a the matrix to rotate
      // Number rad the angle to rotate the matrix by
      // vec3 axis the axis to rotate around
      mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };

    return pyramid;
  }

  function createDodecahedron(gl, translation, rotationAxis,rotationAxis2){
    // Vertex Data
    var vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var side = 1.5;
    var verts = [

      1/side, side, 0,
      -1/side, side, 0,
      -1, 1, -1,
      0, 1/side, -side,
      1, 1, -1,

      side, 0, 1/side,
      1, 1, 1,
      0, 1/side, side,
      0, -1/side, side,
      1, -1, 1,

      1, 1, 1,
      1/side, side, 0,
      -1/side, side, 0,
      -1, 1, 1,
      0, 1/side, side,

      side, 0, 1/side,
      side, 0, -1/side,
      1, -1, -1,
      1/side, -side, 0,
      1, -1, 1,

      side, 0, 1/side,
      1, 1, 1,
      1/side, side, 0,
      1, 1, -1,
      side, 0, -1/side,

      side, 0, -1/side,
      1, 1, -1,
      0, 1/side, -side,
      0, -1/side, -side,
      1, -1, -1,

      0, -1/side, side,
      0, 1/side, side,
      -1, 1, 1,
      -side, 0, 1/side,
      -1, -1, 1,

      1/side, -side, 0,
      1, -1, 1,
      0, -1/side, side,
      -1, -1, 1,
      -1/side, -side, 0,

      0, -1/side, -side,
      0, 1/side, -side,
      -1, 1, -1,
      -side, 0, -1/side,
      -1, -1, -1,

      -1, 1, 1,
      -1/side, side, 0,
      -1, 1, -1,
      -side, 0, -1/side,
      -side, 0, 1/side,

      -side, 0, 1/side,
      -1, -1, 1,
      -1/side, -side, 0,
      -1, -1, -1,
      -side, 0, -1/side,

      1/side, -side, 0,
      1, -1, -1,
      0, -1/side, -side,
      -1, -1, -1,
      -1/side, -side, 0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var faceColors = [
      [0.0, 1.0, 1.0, 1.0],
      [0.0, 1.0, 0.0, 1.0],
      [0.0, 0.0, 1.0, 1.0],
      [1.0, 0.0, 0.0, 1.0],
      [1.0, 1.0, 0.0, 1.0],
      [1.0, 0.0, 1.0, 1.0],
      [1.0, 0.0, 0.0, 1.0],
      [1.0, 0.0, 1.0, 1.0],
      [0.5, 0.0, 1.0, 1.0],
      [1.0, 1.0, 0.0, 1.0],
      [0.0, 1.0, 0.0, 1.0],
      [0.0, 1.0, 1.0, 1.0]
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    var vertexColors = [];
    // for (var i in faceColors)
    // {
    //     var color = faceColors[i];
    //     for (var j=0; j < 4; j++)
    //         vertexColors = vertexColors.concat(color);
    // }
    for (const color of faceColors)
    {
      for (var j=0; j < 5; j++)
      vertexColors = vertexColors.concat(color);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    var dodecahedronIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dodecahedronIndexBuffer);
    var dodecahedronIndices = [
      0,1,2, 0,2,3, 0,3,4,
      5,6,7, 5,7,8, 5,8,9,
      10,11,12, 10,12,13, 10,13,14,
      15,16,17, 15,17,18, 15,18,19,
      20,21,22, 20,22,23, 20,23,24,
      25,26,27, 25,27,28, 25,28,29,
      30,31,32, 30,32,33, 30,33,34,
      35,36,37, 35,37,38, 35,38,39,
      40,41,42, 40,42,43, 40,43,44,
      45,46,47, 45,47,48, 45,48,49,
      50,51,52, 50,52,53, 50,53,54,
      55,56,57, 55,57,58, 55,58,59
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dodecahedronIndices), gl.STATIC_DRAW);
    var dodecahedron = {
      buffer:vertexBuffer, colorBuffer:colorBuffer, indices:dodecahedronIndexBuffer,
      vertSize:3, nVerts:verts.length, colorSize:4, nColors: verts.length, nIndices:dodecahedronIndices.length,
      primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};
      mat4.translate(dodecahedron.modelViewMatrix, dodecahedron.modelViewMatrix, translation);

      dodecahedron.update = function(){
        var now = Date.now();
        var deltat = now - this.currentTime;
        this.currentTime = now;
        var fract = deltat / duration;
        var angle = Math.PI * 2 * fract;

        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis2);
      };

      return dodecahedron;
    }

    function createOctahedron(gl, translation, rotationAxis){

      var vertexBuffer;
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

      var verts = [

        -1.0,  0.0,  1.0,
        1.0,  0.0,  1.0,
        0.0,  1.0,  0.0,

        1.0,  0.0,  1.0,
        1.0,  0.0, -1.0,
        0.0,  1.0,  0.0,

        1.0,  0.0, -1.0,
        -1.0,  0.0, -1.0,
        0.0,  1.0,  0.0,

        -1.0,  0.0, -1.0,
        -1.0,  0.0,  1.0,
        0.0,  1.0,  0.0,

        -1.0,  0.0,  1.0,
        1.0,  0.0,  1.0,
        0.0, -1.0,  0.0,
        // Face 6
        1.0,  0.0,  1.0,
        1.0,  0.0, -1.0,
        0.0,  -1.0,  0.0,

        1.0,  0.0, -1.0,
        -1.0,  0.0, -1.0,
        0.0,  -1.0,  0.0,

        -1.0,  0.0, -1.0,
        -1.0,  0.0,  1.0,
        0.0,  -1.0,  0.0,
      ];

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

      // Color data
      var colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      var faceColors = [
        [0.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 0.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 0.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [0.5, 0.0, 1.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
      ];

      // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
      var vertexColors = [];

      for (const color of faceColors)
      {
        for (var j=0; j < 3; j++)
        vertexColors = vertexColors.concat(color);
      }

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

      // Index data (defines the triangles to be drawn).
      var octahedronIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, octahedronIndexBuffer);
      var octahedronIndices = [

        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
        12, 13, 14,
        15, 16, 17,
        18, 19, 20,
        21, 22, 23,

      ];

      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octahedronIndices), gl.STATIC_DRAW);

      var octahedron = {
        buffer:vertexBuffer, colorBuffer:colorBuffer, indices:octahedronIndexBuffer,
        vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:24,
        primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

        mat4.translate(octahedron.modelViewMatrix, octahedron.modelViewMatrix, translation);

        var x = translation[1];
        var move = 0.1;

        octahedron.update = function(){
          var now = Date.now();
          var deltat = now - this.currentTime;
          this.currentTime = now;
          var fract = deltat / duration;
          var angle = Math.PI * 2 * fract;

          // Rotates a mat4 by the given angle
          // mat4 out the receiving matrix
          // mat4 a the matrix to rotate
          // Number rad the angle to rotate the matrix by
          // vec3 axis the axis to rotate around

          translation2 = [0, move,0];
          x += move;
          if(x >= 3){
            move= -0.1;
          }
          else if (x <= -3){
            move = 0.1;
          }

          mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
          mat4.translate(this.modelViewMatrix, this.modelViewMatrix, translation2);
        };

        return octahedron;
      }
      ///////
      function createShader(gl, str, type)
      {
        var shader;
        if (type == "fragment") {
          shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type == "vertex") {
          shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
          return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(shader));
          return null;
        }

        return shader;
      }

      function initShader(gl)
      {
        // load and compile the fragment and vertex shader
        var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
        var vertexShader = createShader(gl, vertexShaderSource, "vertex");

        // link them together into a new program
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // get pointers to the shader params
        shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
        gl.enableVertexAttribArray(shaderVertexPositionAttribute);

        shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
        gl.enableVertexAttribArray(shaderVertexColorAttribute);

        shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
        shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert("Could not initialise shaders");
        }
      }

      function draw(gl, objs)
      {
        // clear the background (with black)
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

        // set the shader to use
        gl.useProgram(shaderProgram);

        for(i = 0; i<objs.length; i++)
        {
          obj = objs[i];
          // connect up the shader parameters: vertex position, color and projection/model matrices
          // set up the buffers
          gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
          gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

          gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
          gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

          gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
          gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

          // Draw the object's primitives using indexed buffer information.
          // void gl.drawElements(mode, count, type, offset);
          // mode: A GLenum specifying the type primitive to render.
          // count: A GLsizei specifying the number of elements to be rendered.
          // type: A GLenum specifying the type of the sides in the element array buffer.
          // offset: A GLintptr specifying an offset in the element array buffer.
          gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
        }
      }

      function run(gl, objs)
      {
        // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
        requestAnimationFrame(function() { run(gl, objs); });

        draw(gl, objs);

        for(i = 0; i<objs.length; i++)
        objs[i].update();
      }
