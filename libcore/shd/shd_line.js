const shd_line = {
    vertex: `#version 300 es
        in vec2 aPosition;
        uniform vec2 uResolution;

        void main() {
            vec2 clipSpace = (aPosition / (uResolution * 0.5)) * vec2(1, -1);
            gl_Position = vec4(clipSpace, 0, 1);
        }`,

    fragment: `#version 300 es
        precision highp float;
        uniform vec4 uColor;
        out vec4 fragColor;
        
        void main() {
            fragColor = uColor;
        }`
};