import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Float, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '../contexts/LanguageContext';

// Precise SVG Path Data for Saudi Arabia (Abstraction)
const GENERATE_KSA_SHAPE = () => {
  const shape = new THREE.Shape();
  
  // Starting at Gulf of Aqaba (Top Left)
  shape.moveTo(-3.8, 3.2);
  
  // Northern Borders (Jordan, Iraq)
  shape.lineTo(-2.0, 3.8); // Turaif
  shape.lineTo(-0.5, 3.6); // Arar
  shape.lineTo(1.5, 2.8);  // Kuwait Border
  
  // Eastern Coast (The Gulf)
  shape.lineTo(2.2, 2.0);  // Khafji
  shape.lineTo(2.5, 1.0);  // Jubail/Dammam
  shape.lineTo(2.6, 0.2);  // Qatar Border
  shape.lineTo(3.8, -0.5); // UAE Border
  
  // Empty Quarter (South East)
  shape.lineTo(4.5, -2.0); // Oman Border North
  shape.lineTo(3.5, -3.5); // Oman Border South
  
  // Southern Border (Yemen)
  shape.lineTo(1.5, -3.8); // Eastern Yemen Border
  shape.lineTo(-0.5, -4.2); // Central Yemen
  shape.lineTo(-1.8, -4.0); // Najran
  
  // Red Sea Coast (West) - Moving North
  shape.lineTo(-2.2, -3.0); // Jizan
  shape.lineTo(-2.5, -1.5); // Abha/Baha
  shape.lineTo(-2.9, -0.5); // Jeddah
  shape.lineTo(-3.2, 1.0);  // Yanbu
  shape.lineTo(-3.6, 2.5);  // Neom/Tabuk
  
  // Close shape
  shape.lineTo(-3.8, 3.2); 

  return shape;
};

// City Markers calibrated to the new shape
const CITIES = [
  { name: 'RIYADH', arName: 'الرياض', x: 0.5, y: -0.2, label: 'Central Hub', angle: 0 },
  { name: 'JEDDAH', arName: 'جدة', x: -2.9, y: -0.5, label: 'Naval Port', angle: 180 },
  { name: 'DAMMAM', arName: 'الدمام', x: 2.5, y: 1.0, label: 'Energy Hub', angle: 30 },
  { name: 'NEOM', arName: 'نيوم', x: -3.5, y: 2.8, label: 'Future Node', angle: 150 },
];

interface SaudiMapMeshProps {
  language: string;
}

const SaudiMapMesh: React.FC<SaudiMapMeshProps> = ({ language }) => {
  const geometry = useMemo(() => {
    const shape = GENERATE_KSA_SHAPE();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.25,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2,
    });
  }, []);

  return (
    <group>
      <Center>
        <group>
          {/* Main Holographic Mesh */}
          <mesh>
            <primitive object={geometry} />
            <meshBasicMaterial color="#FF4500" wireframe={true} transparent opacity={0.35} />
          </mesh>

          {/* Solid Core (Blocks background stars/grid) */}
          <mesh position={[0, 0, 0.01]}>
             <primitive object={geometry} />
             <meshBasicMaterial color="#000000" transparent opacity={0.95} polygonOffset polygonOffsetFactor={1} />
          </mesh>
          
          {/* Glowing Outline Effect */}
          <mesh position={[0, 0, -0.1]} scale={[1.03, 1.03, 1]}>
             <primitive object={geometry} />
             <meshBasicMaterial color="#FF4500" transparent opacity={0.1} side={THREE.BackSide} />
          </mesh>

          {/* Cities */}
          {CITIES.map((city, idx) => (
            <CityMarker key={idx} city={city} language={language} />
          ))}
        </group>
      </Center>
    </group>
  );
};

const CityMarker: React.FC<{ city: any; language: string }> = ({ city, language }) => {
  const labelHeight = 4.5 + (Math.abs(city.y) * 1.5);
  const labelXOffset = city.x > 0 ? 5.5 : -5.5;

  return (
    <group position={[city.x, city.y, 0.3]}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#FF4500" toneMapped={false} />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
         <ringGeometry args={[0.18, 0.2, 32]} />
         <meshBasicMaterial color="#FF4500" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, labelHeight / 2, 0]}>
         <boxGeometry args={[0.01, labelHeight, 0.01]} />
         <meshBasicMaterial color="#FF4500" transparent opacity={0.7} />
      </mesh>

      <mesh position={[labelXOffset / 2, labelHeight, 0]}>
         <boxGeometry args={[Math.abs(labelXOffset), 0.01, 0.01]} />
         <meshBasicMaterial color="#FF4500" transparent opacity={0.7} />
      </mesh>

      <Html position={[labelXOffset, labelHeight, 0]} center distanceFactor={15} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div className="bg-black/95 border border-jarvis-orange/50 backdrop-blur-xl p-3 min-w-[140px] shadow-[0_0_20px_rgba(255,69,0,0.2)] opacity-100">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-jarvis-orange font-bold text-[10px] font-mono tracking-wider whitespace-nowrap uppercase">
               {language === 'ar' ? city.arName : city.name}: {language === 'ar' ? 'متصل' : 'ONLINE'}
             </span>
          </div>
          <div className="text-[9px] text-green-500 font-mono uppercase whitespace-nowrap">
             {city.label}
          </div>
        </div>
      </Html>
    </group>
  );
};

const MapControls = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <OrbitControls 
      makeDefault
      enableZoom={false}
      enablePan={false}
      enableRotate={!isMobile} 
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      autoRotate={true}
      autoRotateSpeed={0.8}
      minPolarAngle={Math.PI / 3.5}
      maxPolarAngle={Math.PI / 2.2}
    />
  );
};

export const OriginCode: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="origin" className="py-16 lg:py-24 bg-black relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        <div className={`relative w-full rounded-xl border border-white/10 bg-gradient-to-b from-gray-900/20 to-black overflow-hidden shadow-2xl shadow-black order-first lg:order-last
          h-[350px] lg:h-[600px] z-30 pointer-events-auto
        `}>
             <Canvas camera={{ position: [0, -1, 18], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#FF4500" />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="blue" />

                <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                   <group scale={0.6}>
                      <SaudiMapMesh language={language} />
                   </group>
                </Float>
                
                <gridHelper args={[40, 40, 0x222222, 0x050505]} position={[0, -4, 0]} />
                
                <MapControls />
             </Canvas>

             <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 pointer-events-none">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-jarvis-orange rounded-full animate-pulse"></div>
                   <span className="text-white/50 font-mono text-[10px] tracking-widest uppercase">KSA.GRID.V4</span>
                </div>
             </div>
        </div>

        <div className="flex flex-col justify-center pointer-events-none z-20">
           <div className="inline-block border-l-2 border-jarvis-orange pl-4 mb-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
              <span className="text-jarvis-orange font-mono text-xs tracking-[0.2em] rtl:tracking-normal uppercase">{t('origin.sub')}</span>
           </div>

           <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight uppercase tracking-tight">
             {t('origin.headline')}
           </h2>

           <div className="space-y-6 text-gray-400 font-mono rtl:font-arabic text-base md:text-lg">
              <p className="border-l border-white/10 pl-6 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">
                {t('origin.founders')}
              </p>
              <div className="p-6 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                 <p className="text-white font-bold text-lg mb-2 uppercase">
                    {t('origin.chaos')}
                 </p>
                 <p className="text-sm text-gray-500">
                    {t('origin.vision')}
                 </p>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
};