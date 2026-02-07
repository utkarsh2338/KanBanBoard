'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    angle: number;
    speed: number;
    radius: number;
    centerX: number;
    centerY: number;
    size: number;
    opacity: number;
    color: string;
}

export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create particles
        const createParticles = () => {
            const particles: Particle[] = [];
            const particleCount = 150;
            const colors = [
                'rgba(255, 107, 107, ',
                'rgba(255, 168, 107, ',
                'rgba(255, 234, 167, ',
                'rgba(78, 205, 196, ',
                'rgba(69, 183, 209, ',
                'rgba(199, 121, 208, ',
            ];

            for (let i = 0; i < particleCount; i++) {
                const centerX = Math.random() * canvas.width;
                const centerY = Math.random() * canvas.height;
                particles.push({
                    x: centerX,
                    y: centerY,
                    angle: Math.random() * Math.PI * 2,
                    speed: 0.002 + Math.random() * 0.003,
                    radius: 30 + Math.random() * 120,
                    centerX,
                    centerY,
                    size: 3 + Math.random() * 5,
                    opacity: 0.3 + Math.random() * 0.4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
            return particles;
        };

        particlesRef.current = createParticles();

        // Draw triangle
        const drawTriangle = (
            ctx: CanvasRenderingContext2D,
            x: number,
            y: number,
            size: number,
            color: string,
            opacity: number
        ) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.random() * Math.PI * 2);

            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(-size * 0.866, size * 0.5);
            ctx.lineTo(size * 0.866, size * 0.5);
            ctx.closePath();

            ctx.fillStyle = color + opacity + ')';
            ctx.fill();

            ctx.strokeStyle = color + (opacity * 0.5) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.restore();
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle) => {
                // Update angle for circular motion
                particle.angle += particle.speed;

                // Calculate new position based on circular motion
                particle.x = particle.centerX + Math.cos(particle.angle) * particle.radius;
                particle.y = particle.centerY + Math.sin(particle.angle) * particle.radius;

                // Slowly drift the center point
                particle.centerX += Math.sin(particle.angle * 0.5) * 0.1;
                particle.centerY += Math.cos(particle.angle * 0.5) * 0.1;

                // Wrap around screen edges
                if (particle.centerX < -100) particle.centerX = canvas.width + 100;
                if (particle.centerX > canvas.width + 100) particle.centerX = -100;
                if (particle.centerY < -100) particle.centerY = canvas.height + 100;
                if (particle.centerY > canvas.height + 100) particle.centerY = -100;

                // Draw the triangle
                drawTriangle(ctx, particle.x, particle.y, particle.size, particle.color, particle.opacity);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
