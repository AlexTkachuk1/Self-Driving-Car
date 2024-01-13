class Sensor {
      constructor(car) {
            this.car = car;
            this.rayCount = 5;
            this.rayLenght = 150;
            this.raySpread = Math.PI / 2;

            this.rays = [];
            this.readings = [];
      }

      update(roadBorders, traffic) {
            this.#castRays();
            this.readings = [];

            for (let i = 0; i < this.rays.length; i++) {
                  this.readings.push(
                        this.#getReadings(this.rays[i], roadBorders, traffic)
                  );
                  
            }
      }

      draw(ctx) {
            for (let i = 0; i < this.rayCount; i++) {
                  let end = this.rays[i][1];

                  if (this.readings[i]) {
                        end = this.readings[i];
                  }

                  ctx.beginPath();
                  ctx.lineWidth = 2;
                  ctx.strokeStyle = "yellow";
                  ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
                  ctx.lineTo(end.x, end.y);
                  ctx.stroke();

                  ctx.beginPath();
                  ctx.lineWidth = 2;
                  ctx.strokeStyle = "black";
                  ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
                  ctx.lineTo(end.x, end.y);
                  ctx.stroke();
            }
      }

      #getReadings(ray, roadBorders, traffic) {
            let touches = [];

            for (let i = 0; i < roadBorders.length; i++) {
                  const TOUCH = getIntersection(
                        ray[0],
                        ray[1],
                        roadBorders[i][0],
                        roadBorders[i][1]
                  );

                  TOUCH && touches.push(TOUCH);
            }

            for (let i = 0; i < traffic.length; i++) {
                  const POLY = traffic[i].polygon;

                  for (let j = 0; j < POLY.length; j++) {
                        const TOUCH = getIntersection(
                              ray[0],
                              ray[1],
                              POLY[j],
                              POLY[(j + 1) % POLY.length]
                        );

                        TOUCH && touches.push(TOUCH);     
                  }
                  
            }

            if (touches.length === 0) return null;
            else {
                  const offsets = touches.map(x => x.offset);
                  const minOffset = Math.min(...offsets);
                  return touches.find(x => x.offset === minOffset);
            }
      }

      #castRays() {
            this.rays = [];

            for (let i = 0; i < this.rayCount; i++) {
                  const RAY_ANGLE = lerp(
                        this.raySpread / 2,
                        -this.raySpread / 2,
                        this.rayCount === 1 ? 0.5 : i/(this.rayCount - 1)) + this.car.angle;

                  const START_POINT = { x: this.car.x, y: this.car.y };
                  const END_POINT = {
                        x: this.car.x - Math.sin(RAY_ANGLE) * this.rayLenght,
                        y: this.car.y - Math.cos(RAY_ANGLE) * this.rayLenght
                  };

                  this.rays.push([START_POINT, END_POINT]);
            }
      }
}