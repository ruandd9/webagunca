document.addEventListener('DOMContentLoaded', function() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50;
  const colors = ['#4F46E5', '#7C3AED', '#3B82F6', '#8B5CF6', '#6366F1'];

  // Configuração do efeito 3D
  const perspective = 1000;
  particlesContainer.style.perspective = `${perspective}px`;
  particlesContainer.style.transformStyle = 'preserve-3d';

  // Função para criar partícula
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Propriedades aleatórias
    const size = Math.random() * 6 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const z = Math.random() * 500 - 250; // Profundidade 3D
    
    // Estilo da partícula
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${posX}%;
      top: ${posY}%;
      background: ${color};
      box-shadow: 0 0 ${size * 2}px ${color};
      animation: float ${duration}s ease-in-out ${delay}s infinite;
      transform: translateZ(${z}px);
      opacity: ${Math.random() * 0.5 + 0.5};
      border-radius: 50%;
      position: absolute;
      pointer-events: none;
    `;

    // Adiciona keyframes dinâmicos para cada partícula
    const keyframes = `
      @keyframes float {
        0% {
          transform: translateZ(${z}px) translateY(0) rotate(0deg);
          opacity: ${Math.random() * 0.5 + 0.5};
        }
        25% {
          transform: translateZ(${z + 50}px) translateY(-20px) rotate(90deg);
          opacity: ${Math.random() * 0.5 + 0.5};
        }
        50% {
          transform: translateZ(${z}px) translateY(0) rotate(180deg);
          opacity: ${Math.random() * 0.5 + 0.5};
        }
        75% {
          transform: translateZ(${z - 50}px) translateY(20px) rotate(270deg);
          opacity: ${Math.random() * 0.5 + 0.5};
        }
        100% {
          transform: translateZ(${z}px) translateY(0) rotate(360deg);
          opacity: ${Math.random() * 0.5 + 0.5};
        }
      }
    `;

    // Adiciona os keyframes ao documento
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);

    return particle;
  }

  // Cria as partículas
  for (let i = 0; i < particleCount; i++) {
    particlesContainer.appendChild(createParticle());
  }

  // Efeito de parallax no mouse
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      const speed = parseFloat(particle.style.width) * 0.5;
      const x = (mouseX - 0.5) * speed;
      const y = (mouseY - 0.5) * speed;
      
      particle.style.transform = `translateZ(${parseFloat(particle.style.transform.split('(')[1])}px) translate(${x}px, ${y}px)`;
    });
  });

  // Efeito de interação com scroll
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
      const speed = parseFloat(particle.style.width) * 0.2;
      const y = scrolled * speed;
      
      particle.style.transform = `translateZ(${parseFloat(particle.style.transform.split('(')[1])}px) translateY(${y}px)`;
    });
  });

  // Atualiza as partículas periodicamente
  setInterval(() => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      if (Math.random() > 0.95) {
        particle.style.opacity = Math.random() * 0.5 + 0.5;
        particle.style.transform = `translateZ(${Math.random() * 500 - 250}px)`;
      }
    });
  }, 2000);
}); 