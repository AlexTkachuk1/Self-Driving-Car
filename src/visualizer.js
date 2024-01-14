class Visualizer {
      static drawNetwork(ctx, network) {
            const MARGIN = 50;
            const LEFT = MARGIN;
            const TOP = MARGIN;
            const WIDTH = ctx.canvas.width - MARGIN * 2;
            const HEIGHT = ctx.canvas.height - MARGIN * 2;

            const LEVEL_HEIGHT = HEIGHT / network.levels.length;

            for (let i = network.levels.length - 1; i >= 0; i--) {
                  const LEVEL_TOP = TOP +
                        lerp(
                              HEIGHT - LEVEL_HEIGHT,
                              0,
                              network.levels.length == 1
                                    ? 0.5
                                    : i / (network.levels.length - 1)
                        );

                  ctx.setLineDash([7, 3]);
                  Visualizer.drawLevel(ctx, network.levels[i],
                        LEFT, LEVEL_TOP,
                        WIDTH, LEVEL_HEIGHT,
                        i == network.levels.length - 1
                              ? ['🠉', '🠈', '🠊', '🠋']
                              : []
                  );
            }
      };

      static drawLevel(ctx, level, left, top, width, height, outputLabels) {
            const RIGHT = left + width;
            const BOTTOM = top + height;

            const { inputs, outputs, weights, biases } = level;

            for (let i = 0; i < inputs.length; i++) {
                  for (let j = 0; j < outputs.length; j++) {
                        ctx.beginPath();
                        ctx.moveTo(
                              Visualizer.#getNodeX(inputs, i, left, RIGHT),
                              BOTTOM
                        );
                        ctx.lineTo(
                              Visualizer.#getNodeX(outputs, j, left, RIGHT),
                              top
                        );
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = getRGBA(weights[i][j]);
                        ctx.stroke();
                  }
            }

            const NODE_RADIUS = 18;
            for (let i = 0; i < inputs.length; i++) {
                  const X = Visualizer.#getNodeX(inputs, i, left, RIGHT);
                  ctx.beginPath();
                  ctx.arc(X, BOTTOM, NODE_RADIUS, 0, Math.PI * 2);
                  ctx.fillStyle = "black";
                  ctx.fill();
                  ctx.beginPath();
                  ctx.arc(X, BOTTOM, NODE_RADIUS * 0.6, 0, Math.PI * 2);
                  ctx.fillStyle = getRGBA(inputs[i]);
                  ctx.fill();
            }

            for (let i = 0; i < outputs.length; i++) {
                  const X = Visualizer.#getNodeX(outputs, i, left, RIGHT);
                  ctx.beginPath();
                  ctx.arc(X, top, NODE_RADIUS, 0, Math.PI * 2);
                  ctx.fillStyle = "black";
                  ctx.fill();
                  ctx.beginPath();
                  ctx.arc(X, top, NODE_RADIUS * 0.6, 0, Math.PI * 2);
                  ctx.fillStyle = getRGBA(outputs[i]);
                  ctx.fill();

                  ctx.beginPath();
                  ctx.lineWidth = 2;
                  ctx.arc(X, top, NODE_RADIUS * 0.8, 0, Math.PI * 2);
                  ctx.strokeStyle = getRGBA(biases[i]);
                  ctx.setLineDash([3, 3]);
                  ctx.stroke();
                  ctx.setLineDash([]);

                  if (outputLabels[i]) {
                        ctx.beginPath();
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = "black";
                        ctx.strokeStyle = "white";
                        ctx.font = (NODE_RADIUS * 1.5) + "px Arial";
                        ctx.fillText(outputLabels[i], X, top + NODE_RADIUS * 0.1);
                        ctx.lineWidth = 0.5;
                        ctx.strokeText(outputLabels[i], X, top + NODE_RADIUS * 0.1);
                  }
            }
      };

      static #getNodeX(nodes, index, left, right) {
            return lerp(
                  left,
                  right,
                  nodes.length == 1
                        ? 0.5
                        : index / (nodes.length - 1)
            );
      };
}

function getRGBA(value) {
      const ALPHA = Math.abs(value);
      const R = value < 0 ? 0 : 255;
      const G = R;
      const B = value > 0 ? 0 : 255;
      return "rgba(" + R + "," + G + "," + B + "," + ALPHA + ")";
};