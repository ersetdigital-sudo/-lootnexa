export function drawDemoQR(canvas: HTMLCanvasElement, seed: string | number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const N = 25, cell = canvas.width / N;
  let s = typeof seed === "string" ? seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) : seed || 12345;

  function rnd() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >>> 16) / 32768;
  }

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  function finder(x: number, y: number) {
    ctx!.fillStyle = "#0b0b13";
    ctx!.fillRect(x * cell, y * cell, 7 * cell, 7 * cell);
    ctx!.fillStyle = "#fff";
    ctx!.fillRect((x + 1) * cell, (y + 1) * cell, 5 * cell, 5 * cell);
    ctx!.fillStyle = "#0b0b13";
    ctx!.fillRect((x + 2) * cell, (y + 2) * cell, 3 * cell, 3 * cell);
  }

  function inFinder(x: number, y: number) {
    return (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
  }

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (inFinder(x, y)) continue;
      if (rnd() > 0.48) {
        ctx.fillStyle = "#0b0b13";
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  }

  finder(0, 0);
  finder(N - 7, 0);
  finder(0, N - 7);
}
