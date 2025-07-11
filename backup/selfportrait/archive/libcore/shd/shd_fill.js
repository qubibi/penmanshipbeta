const shd_fill = {
    vertex: `#version 300 es
        in vec2 aPosition;
        uniform vec2 uResolution;

        void main() {
            gl_Position = vec4((aPosition / (uResolution * 0.5)) * vec2(1, -1), 0, 1);
        }`,

    fragment: `#version 300 es
        precision highp float;
        uniform vec4 uColor;
        uniform int uPatternType;
        uniform vec2 uPatternRange;
        out vec4 fragColor;

        // 改良版疑似ランダム関数
        float random(vec2 coord, float seed) {
            // 大きな素数を使用してパターンを分散
            vec2 scale = vec2(12.9898, 78.233) * (seed + 1.0);
            float dots = dot(coord, scale);
            return fract(sin(dots) * 43758.5453123);
        }

        // 複数のランダム値を組み合わせる
        float noise(vec2 coord, float seed) {
            // 基本のランダム値
            float r1 = random(coord, seed);
            // 少しずらした座標でのランダム値
            float r2 = random(coord + 0.5789, seed + 0.123);
            // 2つの値を組み合わせて新しいパターンを作成
            return (r1 + r2) * 0.5;
        }

        bool checkPattern(vec2 coord) {
            if (uPatternType == 0) return true;
            
            float density = uPatternRange.x;
            float randomness = uPatternRange.y;
            vec2 m = mod(coord, 2.0);

            if (uPatternType == 1) return (m.x < 1.0) != (m.y < 1.0);    // 市松
            if (uPatternType == 2) return m.x < 1.0 && m.y < 1.0;        // ドット
            if (uPatternType == 3) return m.y < 1.0;                     // 横線
            if (uPatternType == 4) return m.x < 1.0;                     // 縦線
            if (uPatternType == 5) return mod(coord.x + coord.y, 2.0) < 1.0; // 斜め線
            if (uPatternType == 6) {                                     // クロスハッチング
                float d1 = mod(coord.x + coord.y, 2.0);
                float d2 = mod(coord.x - coord.y, 2.0);
                return d1 < 1.0 || d2 < 1.0;
            }
            if (uPatternType == 7) {
                // スケールを大きくしてパターンの繰り返しを目立たなくする
                vec2 scaledCoord = coord * 0.7;
                // 複数のノイズを合成
                float n = noise(scaledCoord, randomness);
                return n < density;
            }
            
            return true;
        }

        void main() {
            fragColor = checkPattern(gl_FragCoord.xy) ? uColor : vec4(0.0);
        }`
};