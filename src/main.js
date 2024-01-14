const CAR_CANVAS = document.getElementById("carCanvas");
CAR_CANVAS.width = 200;

const NETWORK_CANVAS = document.getElementById("networkCanvas");
NETWORK_CANVAS.width = 500;

const CAR_CTX = CAR_CANVAS.getContext("2d");
const NETWORK_CTX = NETWORK_CANVAS.getContext("2d");
const ROAD = new Road(CAR_CANVAS.width / 2, CAR_CANVAS.width * 0.9);
const N = 300;
const CARS = generateCars(N);
let bestCar = CARS[0];

if (localStorage.getItem("bestBrain")) {
      for (let i = 0; i < CARS.length; i++) {
            CARS[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
            if (i !== 0) {
                  NeuralNetwork.mutate(CARS[i].brain, 0.1);
            }
      }
}

const TRAFFIC = [
      new Car(ROAD.getLaneCenter(1), -100, 30, 50, "DUMMY", 1.5, getRandomColor()),
      new Car(ROAD.getLaneCenter(0), -300, 30, 50, "DUMMY", 1.5, getRandomColor()),
      new Car(ROAD.getLaneCenter(2), -300, 30, 50, "DUMMY", 1.5, getRandomColor()),
      new Car(ROAD.getLaneCenter(0), -500, 30, 50, "DUMMY", 1.5, getRandomColor()),
      new Car(ROAD.getLaneCenter(1), -500, 30, 50, "DUMMY", 1.5, getRandomColor()),
      new Car(ROAD.getLaneCenter(1), -700, 30, 50, "DUMMY", 1.5, getRandomColor()),
      new Car(ROAD.getLaneCenter(2), -700, 30, 50, "DUMMY", 1.5, getRandomColor())
];

animate();

function save() {
      localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
};

function discard() {
      localStorage.removeItem("bestBrain");
};

function generateCars(N) {
      const CARS = [];

      for (let i = 0; i < N; i++) {
            CARS.push(new Car(ROAD.getLaneCenter(1), 100, 30, 50, "AI"));
      }

      return CARS;
};

function animate(time) {
      TRAFFIC.forEach(trafficCar => trafficCar.update(ROAD.borders, []));

      CARS.forEach(car => car.update(ROAD.borders, TRAFFIC));

      bestCar = CARS.find(x => x.y === Math.min(...CARS.map(x => x.y)));

      CAR_CANVAS.height = window.innerHeight;
      NETWORK_CANVAS.height = window.innerHeight * 0.6;

      CAR_CTX.save();
      CAR_CTX.translate(0, -bestCar.y + CAR_CANVAS.height * 0.7);

      ROAD.draw(CAR_CTX);

      TRAFFIC.forEach(trafficCar => trafficCar.draw(CAR_CTX, false));

      CAR_CTX.globalAlpha = 0.2;
      CARS.forEach(car => car.draw(CAR_CTX, false));
      CAR_CTX.globalAlpha = 1;
      bestCar.draw(CAR_CTX, true);

      CAR_CTX.restore();

      NETWORK_CTX.lineDashOffset = - time / 50;
      Visualizer.drawNetwork(NETWORK_CTX, bestCar.brain);
      requestAnimationFrame(animate);
};