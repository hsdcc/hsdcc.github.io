const apply3dEffect = (element, strength = 20) => {
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    const lerp = (start, end, t) => {
        return start * (1 - t) + end * t;
    };

    element.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { offsetWidth: width, offsetHeight: height } = element;
        const { left, top } = element.getBoundingClientRect();

        const mouseX = clientX - left;
        const mouseY = clientY - top;

        target.x = (mouseY / height - 0.5) * -strength;
        target.y = (mouseX / width - 0.5) * strength;
    });

    element.addEventListener('mouseleave', () => {
        target.x = 0;
        target.y = 0;
    });

    const animate = () => {
        current.x = lerp(current.x, target.x, 0.1);
        current.y = lerp(current.y, target.y, 0.1);

        const roundedX = Math.round(current.x * 100) / 100;
        const roundedY = Math.round(current.y * 100) / 100;

        const scale = 1.05;

        element.style.transform = `perspective(1000px) rotateX(${roundedX}deg) rotateY(${roundedY}deg) scale3d(${scale}, ${scale}, ${scale})`;

        requestAnimationFrame(animate);
    };

    animate();
};

const glassContainer = document.querySelector('.glass-container');
const logo = document.querySelector('.logo');

apply3dEffect(glassContainer, 30);
apply3dEffect(logo, 45);
