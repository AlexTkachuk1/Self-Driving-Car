class Car {
      constructor(x, y, width, height, controlType, maxSpeed = 2, color="blue") {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = 0;
            this.acceleration = 0.2;
            this.maxSpeed = maxSpeed;
            this.friction = 0.05;
            this.angle = 0;
            this.damaged = false;

            this.useBrane = controlType === "AI";

            if (controlType !== "DUMMY") {
                  this.sensor = new Sensor(this);
                  this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
            }

            this.controls = new Controls(controlType);

            this.img = new Image();
            this.img.src = "../car.png"

            this.mask = document.createElement("canvas");
            this.mask.width = width;
            this.mask.height = height;

            const MASK_CTX = this.mask.getContext("2d");
            this.img.onload = () => {
                  MASK_CTX.fillStyle = color;
                  MASK_CTX.rect(0, 0, this.width, this.height);
                  MASK_CTX.fill();

                  MASK_CTX.globalCompositeOperation = "destination-atop";
                  MASK_CTX.drawImage(this.img, 0, 0, this.width, this.height);
            }
      }

      update(roadBorders, traffic) {
            if (this.damaged) return;

            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
            if (this.sensor) {
                  this.sensor.update(roadBorders, traffic);
                  const OFFSETS = this.sensor.readings.map(x => x == null ? 0 : 1 - x.offset);
                  const OUTPUTS = NeuralNetwork.feedForward(OFFSETS, this.brain);

                  if (this.useBrane) {
                        this.controls.forward = OUTPUTS[0];
                        this.controls.left = OUTPUTS[1];
                        this.controls.right = OUTPUTS[2];
                        this.controls.reverse = OUTPUTS[3];
                  }
            };
      };

      #assessDamage(roadBorders, traffic) {
            for (let i = 0; i < roadBorders.length; i++) {
                  if (polysIntersect(this.polygon, roadBorders[i])) return true;
            }

            for (let i = 0; i < traffic.length; i++) {
                  if (polysIntersect(this.polygon, traffic[i].polygon)) return true;
            }

            return false;
      };

      #createPolygon() {
            const POINTS = [];
            const RAD = Math.hypot(this.width, this.height) / 2;
            const ALPHA = Math.atan2(this.width, this.height);

            POINTS.push({
                  x: this.x - Math.sin(this.angle - ALPHA) * RAD,
                  y: this.y - Math.cos(this.angle - ALPHA) * RAD,
            });

            POINTS.push({
                  x: this.x - Math.sin(this.angle + ALPHA) * RAD,
                  y: this.y - Math.cos(this.angle + ALPHA) * RAD,
            });

            POINTS.push({
                  x: this.x - Math.sin(Math.PI + this.angle - ALPHA) * RAD,
                  y: this.y - Math.cos(Math.PI + this.angle - ALPHA) * RAD,
            });

            POINTS.push({
                  x: this.x - Math.sin(Math.PI + this.angle + ALPHA) * RAD,
                  y: this.y - Math.cos(Math.PI + this.angle + ALPHA) * RAD,
            });

            return POINTS;
      };

      #move() {
            if (this.controls.forward) {
                  this.speed += this.acceleration;
            }
            else if (this.controls.reverse) {
                  this.speed -= this.acceleration;
            }

            if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
            if (this.speed < - this.maxSpeed / 2) this.speed = -this.maxSpeed / 2;
            this.#applyFriction(this.speed, this.friction);

            if (this.speed !== 0) {
                  const FLIP = this.speed > 0 ? 1 : -1;
                  if (this.controls.left) {
                        this.angle += 0.01 * FLIP;
                  }
                  else if (this.controls.right) {
                        this.angle -= 0.01 * FLIP;
                  }
            }


            this.x -= Math.sin(this.angle) * this.speed;
            this.y -= Math.cos(this.angle) * this.speed;
      };

      #applyFriction(speed, friction) {
            if (Math.abs(speed) < friction) this.speed = 0;
            else {
                  this.speed = this.speed > friction
                        ? this.speed - this.friction
                        : this.speed + this.friction;
            }
      };

      draw(ctx, drawSensor = false) {
            this.sensor && drawSensor && this.sensor.draw(ctx);

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(-this.angle);
            if (!this.damaged) {
                  ctx.drawImage(this.mask,
                        -this.width / 2,
                        -this.height / 2,
                        this.width,
                        this.height);
                  ctx.globalCompositeOperation = "multiply";
            }
            ctx.drawImage(this.img,
                  -this.width / 2,
                  -this.height / 2,
                  this.width,
                  this.height);
            ctx.restore();
      };
}