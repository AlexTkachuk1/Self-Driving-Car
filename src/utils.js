const lerp = (left, right, part) => left + ((right - left) * part);

const getIntersection = (A, B, C, D) => {
      const T_TOP = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
      const U_TOP = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
      const BOTTOM = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

      if (BOTTOM !== 0) {
            const T = T_TOP / BOTTOM;
            const U = U_TOP / BOTTOM;

            if (T >= 0 && T <= 1 && U >= 0 && U <= 1) {
                  return {
                        x: lerp(A.x, B.x, T),
                        y: lerp(A.y, B.y, T),
                        offset: T
                  };
            }

            return null;
      }
};

const polysIntersect = (poly1, poly2) => {
      for (let i = 0; i < poly1.length; i++) {
            for (let j = 0; j < poly2.length; j++) {
                  const TOUCH = getIntersection(
                        poly1[i],
                        poly1[(i + 1) % poly1.length],
                        poly2[j],
                        poly2[(j + 1) % poly2.length]
                  );

                  if (TOUCH) {
                        return true;
                  }
            }
      }


      return false;
};

const getRandomColor = () => {
      const HUE = 290 + Math.random() * 260;
      return "hsl(" + HUE + ", 100%, 60%)";
}