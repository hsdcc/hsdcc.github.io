const container = document.querySelector('.glass-container');

let mouse = {
    x: 0,
    y: 0
};

let target = {
    x: 0,
    y: 0
};

let current = {
    x: 0,
    y: 0
};

const lerp = (start, end, t) => {
    return start * (1 - t) + end * t;
};

container.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { offsetWidth: width, offsetHeight: height } = container;
    const { left, top } = container.getBoundingClientRect();

    const mouseX = clientX - left;
    const mouseY = clientY - top;

    target.x = (mouseY / height - 0.5) * -20; // -10 to 10 deg
    target.y = (mouseX / width - 0.5) * 20;  // -10 to 10 deg
});

container.addEventListener('mouseleave', () => {
    target.x = 0;
    target.y = 0;
});

const animate = () => {
    current.x = lerp(current.x, target.x, 0.1);
    current.y = lerp(current.y, target.y, 0.1);

    // Round values to prevent jittering on some displays
    const roundedX = Math.round(current.x * 100) / 100;
    const roundedY = Math.round(current.y * 100) / 100;

    const scale = 1.05;

    container.style.transform = `perspective(1000px) rotateX(${roundedX}deg) rotateY(${roundedY}deg) scale3d(${scale}, ${scale}, ${scale})`;

    requestAnimationFrame(animate);
};

animate();


