const CANVAS = document.getElementById("myCanvas");
CANVAS.width = 200;

const CTX = CANVAS.getContext("2d");
const ROAD = new Road(CANVAS.width / 2, CANVAS.width * 0.9);
const CAR = new Car(ROAD.getLaneCenter(1), 100, 30, 50, "KEYS");
const TRAFFIC = [
      new Car(ROAD.getLaneCenter(1), -100, 30, 50, "DUMMY", 1.5)
];

animate();

function animate() {
      for (let i = 0; i < TRAFFIC.length; i++)
            TRAFFIC[i].update(ROAD.borders, []);

      CAR.update(ROAD.borders, TRAFFIC);
      CANVAS.height = window.innerHeight;

      CTX.save();
      CTX.translate(0, -CAR.y + CANVAS.height * 0.7);

      ROAD.draw(CTX);

      for (let i = 0; i < TRAFFIC.length; i++)
            TRAFFIC[i].draw(CTX, "red");

      CAR.draw(CTX, "blue");

      CTX.restore();
      requestAnimationFrame(animate);
};