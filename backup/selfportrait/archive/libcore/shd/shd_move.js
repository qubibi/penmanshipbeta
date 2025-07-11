const shd_move = {
    vertex: `#version 300 es
        in vec2 aPosition;
        out vec2 vTexCoord;
        uniform vec2 uOffset;
        uniform vec2 uResolution;

        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
            vTexCoord = (aPosition + 1.0) * 0.5;
            vTexCoord += uOffset / uResolution;
        }`,

    fragment: `#version 300 es
        precision highp float;
        uniform sampler2D uTexture;
        in vec2 vTexCoord;
        out vec4 fragColor;
        
        void main() {
            if(vTexCoord.x < 0.0 || vTexCoord.x > 1.0 || 
               vTexCoord.y < 0.0 || vTexCoord.y > 1.0) {
                fragColor = vec4(0.0);
                return;
            }
            fragColor = texture(uTexture, vTexCoord);
        }`
}; 