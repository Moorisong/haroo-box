import { Ball } from './Ball';
import { Obstacle } from './types';

export class PhysicsRenderer {
    static draw(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        worldHeight: number,
        cameraY: number,
        frameCount: number,
        mode: number,
        obstacles: Obstacle[],
        balls: Ball[]
    ) {
        ctx.save();
        const time = frameCount * 0.03;

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, `hsl(${(time * 10) % 360}, 50%, 15%)`);
        gradient.addColorStop(1, `hsl(${(time * 10 + 60) % 360}, 40%, 8%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 80) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
        const go = (frameCount * 1.5) % 80;
        for (let i = 0; i < height; i += 80) { ctx.beginPath(); ctx.moveTo(0, (i + go) % height); ctx.lineTo(width, (i + go) % height); ctx.stroke(); }

        ctx.translate(0, -cameraY);

        const progress = cameraY / (worldHeight - height);
        ctx.fillStyle = 'rgba(0,255,255,0.3)';
        ctx.fillRect(5, cameraY + 50, 8, (height - 100) * progress);
        ctx.strokeStyle = '#0ff';
        ctx.strokeRect(5, cameraY + 50, 8, height - 100);

        ctx.fillStyle = mode === 1 ? '#0ff' : '#f0f';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`MODE ${mode}`, 20, cameraY + 30);

        for (const obs of obstacles) {
            const checkY = obs.type === 'line' ? Math.min(obs.y1, obs.y2) : obs.y;
            if (checkY > cameraY + height + 300 || checkY < cameraY - 300) continue;

            ctx.shadowBlur = 8;

            if (obs.type === 'line') {
                ctx.shadowColor = '#0ff'; ctx.strokeStyle = '#0ff'; ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(obs.x1, obs.y1); ctx.lineTo(obs.x2, obs.y2); ctx.stroke();
            }
            else if (obs.type === 'circle') {
                ctx.shadowColor = '#0ff'; ctx.fillStyle = '#000'; ctx.strokeStyle = '#0ff'; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            }
            else if (obs.type === 'rotator') {
                ctx.save(); ctx.translate(obs.x, obs.y); ctx.rotate(obs.angle);
                ctx.shadowColor = '#f0f'; ctx.strokeStyle = '#f0f'; ctx.lineWidth = 5;
                ctx.beginPath(); ctx.moveTo(-obs.length / 2, 0); ctx.lineTo(obs.length / 2, 0); ctx.stroke();
                ctx.restore();
                ctx.beginPath(); ctx.arc(obs.x, obs.y, 10, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
            }
            else if (obs.type === 'launcher') {
                const flash = (Math.floor(frameCount / 5) % 2 === 0);
                ctx.shadowColor = flash ? '#ff0' : '#fa0'; ctx.strokeStyle = flash ? '#ff0' : '#fa0'; ctx.fillStyle = '#220'; ctx.lineWidth = 3;
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height); ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('JUMP!', obs.x + obs.width / 2, obs.y + 17);
            }
            else if (obs.type === 'trap') {
                ctx.shadowColor = '#f00'; ctx.fillStyle = '#200'; ctx.strokeStyle = '#f00'; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(obs.x - 8, obs.y - 8); ctx.lineTo(obs.x + 8, obs.y + 8); ctx.moveTo(obs.x + 8, obs.y - 8); ctx.lineTo(obs.x - 8, obs.y + 8); ctx.stroke();
            }
            else if (obs.type === 'hole') {
                const pulse = Math.sin(frameCount * 0.1) * 3;
                ctx.shadowColor = '#a0f'; ctx.fillStyle = '#101'; ctx.strokeStyle = '#a0f'; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(obs.x, obs.y, obs.radius + pulse, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.save(); ctx.translate(obs.x, obs.y); ctx.rotate(frameCount * 0.05);
                ctx.strokeStyle = 'rgba(160, 0, 255, 0.5)'; ctx.lineWidth = 2;
                ctx.beginPath();
                for (let a = 0; a < Math.PI * 4; a += 0.2) {
                    const r = a * 2;
                    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
                }
                ctx.stroke();
                ctx.restore();
            }
            else if (obs.type === 'gear') {
                ctx.save(); ctx.translate(obs.x, obs.y); ctx.rotate(obs.angle);
                ctx.shadowColor = '#fa0'; ctx.strokeStyle = '#fa0'; ctx.fillStyle = '#320'; ctx.lineWidth = 3;
                ctx.beginPath();
                for (let i = 0; i < obs.teeth; i++) {
                    const a1 = (i / obs.teeth) * Math.PI * 2;
                    const a2 = ((i + 0.3) / obs.teeth) * Math.PI * 2;
                    const a3 = ((i + 0.5) / obs.teeth) * Math.PI * 2;
                    const a4 = ((i + 0.8) / obs.teeth) * Math.PI * 2;
                    ctx.lineTo(Math.cos(a1) * obs.radius, Math.sin(a1) * obs.radius);
                    ctx.lineTo(Math.cos(a2) * (obs.radius + 15), Math.sin(a2) * (obs.radius + 15));
                    ctx.lineTo(Math.cos(a3) * (obs.radius + 15), Math.sin(a3) * (obs.radius + 15));
                    ctx.lineTo(Math.cos(a4) * obs.radius, Math.sin(a4) * obs.radius);
                }
                ctx.closePath(); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fillStyle = '#654'; ctx.fill(); ctx.stroke();
                ctx.restore();
            }
            else if (obs.type === 'bumper') {
                const pulse = Math.sin(frameCount * 0.15 + obs.x) * 2;
                ctx.shadowColor = '#0f0'; ctx.strokeStyle = '#0f0'; ctx.lineWidth = 3;
                const grad = ctx.createRadialGradient(obs.x, obs.y, 0, obs.x, obs.y, obs.radius + pulse);
                grad.addColorStop(0, '#0a0');
                grad.addColorStop(1, '#040');
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(obs.x, obs.y, obs.radius + pulse, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            }
            else if (obs.type === 'spring') {
                const compression = obs.compressed * 5;
                ctx.shadowColor = '#ff0'; ctx.strokeStyle = '#ff0'; ctx.lineWidth = 3;
                ctx.fillStyle = '#440';
                ctx.fillRect(obs.x, obs.y + compression, obs.width, obs.height - compression);
                ctx.strokeRect(obs.x, obs.y + compression, obs.width, obs.height - compression);
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const sx = obs.x + 10 + i * (obs.width - 20) / 4;
                    ctx.moveTo(sx, obs.y + compression);
                    ctx.lineTo(sx, obs.y - 8 + compression);
                }
                ctx.stroke();
            }
            else if (obs.type === 'vibrator') {
                const offsetX = Math.sin(frameCount * 0.1 + obs.phase) * obs.amplitude;
                ctx.shadowColor = '#f0a'; ctx.strokeStyle = '#f0a'; ctx.lineWidth = 3;
                ctx.fillStyle = '#301';
                ctx.fillRect(obs.x + offsetX, obs.y, obs.width, obs.height);
                ctx.strokeRect(obs.x + offsetX, obs.y, obs.width, obs.height);
                ctx.beginPath();
                ctx.moveTo(obs.x + offsetX - 15, obs.y + obs.height / 2);
                ctx.lineTo(obs.x + offsetX - 5, obs.y);
                ctx.lineTo(obs.x + offsetX - 5, obs.y + obs.height);
                ctx.lineTo(obs.x + offsetX - 15, obs.y + obs.height / 2);
                ctx.moveTo(obs.x + offsetX + obs.width + 15, obs.y + obs.height / 2);
                ctx.lineTo(obs.x + offsetX + obs.width + 5, obs.y);
                ctx.lineTo(obs.x + offsetX + obs.width + 5, obs.y + obs.height);
                ctx.stroke();
            }
            else if (obs.type === 'wind') {
                ctx.save();
                ctx.globalAlpha = 0.15;
                ctx.fillStyle = '#6cf';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.globalAlpha = 0.6;
                ctx.strokeStyle = '#6cf';
                ctx.lineWidth = 1;
                for (let i = 0; i < 8; i++) {
                    const px = obs.x + (i % 4 + 0.5) * (obs.width / 4);
                    const baseY = obs.y + obs.height - (frameCount * 3 + i * 50) % obs.height;
                    ctx.beginPath();
                    ctx.moveTo(px - 5, baseY + 15);
                    ctx.lineTo(px, baseY);
                    ctx.lineTo(px + 5, baseY + 15);
                    ctx.stroke();
                }
                ctx.restore();
            }
            else if (obs.type === 'boostZone') {
                ctx.save();
                ctx.globalAlpha = 0.2;
                const pulse = Math.sin(frameCount * 0.08) * 0.1 + 0.3;
                ctx.fillStyle = `rgba(255, 100, 0, ${pulse})`;
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.globalAlpha = 0.8;
                ctx.strokeStyle = '#f60';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                ctx.setLineDash([]);
                ctx.fillStyle = '#ff0';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('⚡ BOOST', obs.x + obs.width / 2, obs.y + obs.height / 2 + 5);
                ctx.restore();
            }
            else if (obs.type === 'spinZone') {
                ctx.save();
                ctx.globalAlpha = 0.15;
                ctx.fillStyle = '#a0f';
                ctx.beginPath();
                ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 0.6;
                ctx.strokeStyle = '#a0f';
                ctx.lineWidth = 2;
                ctx.setLineDash([8, 4]);
                ctx.beginPath();
                ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                
                ctx.save();
                ctx.translate(obs.x, obs.y);
                ctx.rotate(frameCount * obs.spinSpeed * obs.spinDirection);
                ctx.strokeStyle = '#f0f';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    ctx.moveTo(Math.cos(angle) * obs.radius * 0.7, Math.sin(angle) * obs.radius * 0.7);
                    ctx.lineTo(Math.cos(angle) * obs.radius * 0.9, Math.sin(angle) * obs.radius * 0.9);
                }
                ctx.stroke();
                ctx.restore();
                ctx.restore();
            }
            else if (obs.type === 'portal') {
                const pulse = Math.sin(frameCount * 0.1) * 3;
                ctx.shadowColor = '#0ff';
                ctx.fillStyle = `rgba(0, 200, 255, ${0.2 + pulse * 0.05})`;
                ctx.strokeStyle = '#0ff';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(obs.x, obs.y, obs.radius + pulse, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                ctx.save();
                ctx.translate(obs.x, obs.y);
                ctx.rotate(-frameCount * 0.05);
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let a = 0; a < Math.PI * 3; a += 0.15) {
                    const r = obs.radius * 0.3 + Math.sin(a * 3) * 10;
                    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
                }
                ctx.stroke();
                ctx.restore();
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(obs.id.toString(), obs.x, obs.y + 5);
            }
        }

        ctx.shadowBlur = 0;

        ctx.fillStyle = '#0f0'; ctx.fillRect(0, worldHeight - 25, width, 25);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        for (let i = 0; i < width; i += 30) {
            ctx.fillStyle = (Math.floor(i / 30) % 2 === 0) ? '#000' : '#fff';
            ctx.fillRect(i, worldHeight - 25, 30, 25);
        }
        ctx.fillStyle = '#0f0'; ctx.font = 'bold 36px sans-serif'; ctx.textAlign = 'center';
        ctx.shadowColor = '#0f0'; ctx.shadowBlur = 15;
        ctx.fillText('🏁 FINISH 🏁', width / 2, worldHeight - 45);
        ctx.shadowBlur = 0;

        balls.forEach(b => b.draw(ctx));
        ctx.restore();
    }
}
