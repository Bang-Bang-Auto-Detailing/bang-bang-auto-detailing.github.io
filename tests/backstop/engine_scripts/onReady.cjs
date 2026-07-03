module.exports = async (page) => {
  await page.evaluate(async () => {
    // Force lazy images to start loading immediately so captures include them.
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.loading = 'eager';
    });
    // Scroll through the full page (triggers any remaining lazy behavior), then return to top.
    await new Promise((resolve) => {
      let y = 0;
      const step = 400;
      const timer = setInterval(() => {
        y += step;
        window.scrollTo(0, y);
        if (y >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
    // Wait for images to finish, but never longer than 5s total.
    await Promise.race([
      Promise.all(
        Array.from(document.images).map((img) =>
          img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; })
        )
      ),
      new Promise((r) => setTimeout(r, 5000)),
    ]);
    // Freeze CSS animations/transitions for stable captures.
    const style = document.createElement('style');
    style.innerHTML = '*, *::before, *::after { animation: none !important; transition: none !important; }';
    document.head.appendChild(style);
  });
  await new Promise((r) => setTimeout(r, 1000));
};
