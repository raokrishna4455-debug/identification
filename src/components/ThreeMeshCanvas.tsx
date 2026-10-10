import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeMeshCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 19);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    const emeraldLight = new THREE.PointLight(0x059669, 4.0, 35);
    emeraldLight.position.set(6, 4, 7);
    scene.add(emeraldLight);

    const cyanLight = new THREE.PointLight(0x0284c7, 3.5, 35);
    cyanLight.position.set(-6, -3, 6);
    scene.add(cyanLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central 3D Cryptographic Holographic Shield / Octahedron Core in Emerald & Mint
    const coreGeo = new THREE.OctahedronGeometry(3.6, 2);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xecfdf5,
      emissive: 0x059669,
      emissiveIntensity: 0.35,
      specular: 0x38bdf8,
      shininess: 120,
      flatShading: true,
      transparent: true,
      opacity: 0.92
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Outer Wireframe Lattice around Shield in Emerald
    const cageGeo = new THREE.IcosahedronGeometry(4.6, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    rootGroup.add(cageMesh);

    // Inner pulsing checkmark / verified emblem (3D Torus ring halo)
    const haloGeo = new THREE.TorusGeometry(2.2, 0.12, 16, 64);
    const haloMat = new THREE.MeshPhongMaterial({
      color: 0x059669,
      emissive: 0x10b981,
      emissiveIntensity: 0.6,
      shininess: 100
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2;
    rootGroup.add(haloMesh);

    // 2. Floating Holographic Glass Barcode Plate (Right side)
    const barcodeGroup = new THREE.Group();
    barcodeGroup.position.set(5.8, 1.2, 1.5);
    rootGroup.add(barcodeGroup);

    // Glass slab backing (Crystal light acrylic glass)
    const slabGeo = new THREE.BoxGeometry(4.0, 2.4, 0.12);
    const slabMat = new THREE.MeshPhongMaterial({
      color: 0xf0fdf4,
      specular: 0x0284c7,
      shininess: 150,
      transparent: true,
      opacity: 0.85
    });
    const slabMesh = new THREE.Mesh(slabGeo, slabMat);
    barcodeGroup.add(slabMesh);

    // Barcode lines mesh inside plate with vivid emerald and cyan bars
    const barSpacing = [-1.5, -1.2, -0.9, -0.65, -0.35, -0.05, 0.25, 0.55, 0.85, 1.15, 1.45];
    barSpacing.forEach((xPos, idx) => {
      const barW = idx % 3 === 0 ? 0.13 : idx % 2 === 0 ? 0.08 : 0.045;
      const barH = 1.4;
      const barG = new THREE.BoxGeometry(barW, barH, 0.05);
      const barM = new THREE.MeshPhongMaterial({
        color: idx % 2 === 0 ? 0x059669 : 0x0284c7,
        shininess: 80
      });
      const barMesh = new THREE.Mesh(barG, barM);
      barMesh.position.set(xPos, 0, 0.09);
      barcodeGroup.add(barMesh);
    });

    // Dynamic scanning laser beam line across barcode
    const laserGeo = new THREE.BoxGeometry(3.8, 0.06, 0.14);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.95
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    laserMesh.position.set(0, 0, 0.15);
    barcodeGroup.add(laserMesh);

    // 3. Orbiting Blockchain Blocks
    const nodeCount = 8;
    const nodes: { mesh: THREE.Mesh; baseAngle: number; speed: number }[] = [];
    const ringRadius = 7.0;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const nodeGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
      const nodeMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x059669,
        emissive: i % 2 === 0 ? 0xecfdf5 : 0xf0f9ff,
        emissiveIntensity: 0.8,
        shininess: 100
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(
        Math.cos(angle) * ringRadius,
        Math.sin(angle * 1.5) * 1.8,
        Math.sin(angle) * ringRadius
      );
      rootGroup.add(nodeMesh);
      nodes.push({ mesh: nodeMesh, baseAngle: angle, speed: 0.007 + i * 0.001 });
    }

    // 4. Subtle Ambient Floating Data Particles
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePos[p] = (Math.random() - 0.5) * 32;
      particlePos[p + 1] = (Math.random() - 0.5) * 20;
      particlePos[p + 2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x059669,
      size: 0.16,
      transparent: true,
      opacity: 0.55
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // Mouse parallax interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseX = (clientX / rect.width) * 2 - 1;
      mouseY = -(clientY / rect.height) * 2 + 1;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Mouse parallax interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      rootGroup.rotation.y = targetX * 0.45 + elapsedTime * 0.18;
      rootGroup.rotation.x = -targetY * 0.35 + Math.sin(elapsedTime * 0.5) * 0.06;

      // Floating core & cage oscillation
      coreMesh.rotation.y = elapsedTime * 0.4;
      coreMesh.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2;
      cageMesh.rotation.y = -elapsedTime * 0.25;
      cageMesh.rotation.z = elapsedTime * 0.18;
      haloMesh.rotation.z = elapsedTime * 0.6;
      haloMesh.position.y = Math.sin(elapsedTime * 2.0) * 0.2;

      // Barcode floating & laser scan movement
      barcodeGroup.position.y = 1.2 + Math.sin(elapsedTime * 1.5) * 0.3;
      barcodeGroup.rotation.y = -0.25 + Math.sin(elapsedTime * 0.9) * 0.15;
      laserMesh.position.y = Math.sin(elapsedTime * 3.2) * 0.8;

      // Orbiting block nodes
      nodes.forEach((item, idx) => {
        const curAngle = item.baseAngle + elapsedTime * 0.5;
        item.mesh.position.x = Math.cos(curAngle) * ringRadius;
        item.mesh.position.z = Math.sin(curAngle) * ringRadius;
        item.mesh.position.y = Math.sin(curAngle * 2.0 + idx) * 2.2;
        item.mesh.rotation.x += 0.02;
        item.mesh.rotation.y += 0.025;
      });

      // Particle drift
      particleField.rotation.y = elapsedTime * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      slabGeo.dispose();
      slabMat.dispose();
      laserGeo.dispose();
      laserMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[440px] cursor-grab active:cursor-grabbing select-none"
      title="Interactive 3D Cryptographic Mesh - Hover or move mouse to rotate"
    />
  );
};
