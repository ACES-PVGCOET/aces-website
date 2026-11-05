"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";

// 1. Major Global Cyber Hub Nodes (22 Key Worldwide Terminal Locations)
// Four of these double as navigation hotspots: they carry an optional
// `page` (route to open) and `label` (tooltip text) field. Hovering shows
// the label in a tooltip; clicking routes to that page. To change which
// city maps to which section, just move the `page`/`label` fields to a
// different entry below — nothing else needs to change.
const HUB_LOCATIONS = [
  { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "Seattle", lat: 47.6062, lng: -122.3321 },
  { name: "New York", lat: 40.7128, lng: -74.0060, page: "/about", label: "About" },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Sao Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "London", lat: 51.5074, lng: -0.1278, page: "/team", label: "Team" },
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Frankfurt", lat: 50.1109, lng: 8.6821 },
  { name: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  { name: "Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Nairobi", lat: -1.2921, lng: 36.8219 },
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, page: "/events", label: "Events" },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "New Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, page: "/publications", label: "Publications" },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Seoul", lat: 37.5665, lng: 126.9780 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
];

// One extra HTML layer point, always mounted but hidden until India is celebrated.
const INDIA_FESTIVAL = { lat: 22.4, lng: 79.0, isFestival: true };
const GLOBE_HTML_POINTS = [...HUB_LOCATIONS, INDIA_FESTIVAL];

// 2a. Global High-Altitude 3D Network Arcs
const HIGH_ALTITUDE_ARCS = [
  { startLat: 51.5074, startLng: -0.1278, endLat: 40.7128, endLng: -74.0060, arcAlt: 0.32 },   // London ↔ NYC
  { startLat: 35.6762, startLng: 139.6503, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.45 },// Tokyo ↔ SF
  { startLat: 19.0760, startLng: 72.8777, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.35 },   // Mumbai ↔ London
  { startLat: -33.8688, startLng: 151.2093, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.30 }, // Sydney ↔ Singapore
  { startLat: -33.9249, startLng: 18.4241, endLat: -23.5505, endLng: -46.6333, arcAlt: 0.38 },// Cape Town ↔ Sao Paulo
  { startLat: 50.1109, startLng: 8.6821, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.42 },   // Frankfurt ↔ Tokyo
  { startLat: 37.7749, startLng: -122.4194, endLat: 40.7128, endLng: -74.0060, arcAlt: 0.18 }, // SF ↔ NYC
  { startLat: 51.5074, startLng: -0.1278, endLat: 50.1109, endLng: 8.6821, arcAlt: 0.15 },    // London ↔ Frankfurt
  { startLat: 50.1109, startLng: 8.6821, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.25 },    // Frankfurt ↔ Dubai
  { startLat: 25.2048, startLng: 55.2708, endLat: 19.0760, endLng: 72.8777, arcAlt: 0.22 },   // Dubai ↔ Mumbai
  { startLat: 19.0760, startLng: 72.8777, endLat: 28.6139, endLng: 77.2090, arcAlt: 0.15 },   // Mumbai ↔ New Delhi
  { startLat: 28.6139, startLng: 77.2090, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.28 },   // New Delhi ↔ Singapore
  { startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.30 },  // Singapore ↔ Tokyo
  { startLat: 35.6762, startLng: 139.6503, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.42 },// Tokyo ↔ Sydney
  { startLat: 34.0522, startLng: -118.2437, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.45 },// LA ↔ Sydney
  { startLat: -23.5505, startLng: -46.6333, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.38 }, // Sao Paulo ↔ London
  { startLat: -26.2041, startLng: 28.0473, endLat: 30.0444, endLng: 31.2357, arcAlt: 0.30 },  // Jo'burg ↔ Cairo
  { startLat: 30.0444, startLng: 31.2357, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.18 },   // Cairo ↔ Dubai
  { startLat: 51.5074, startLng: -0.1278, endLat: -1.2921, endLng: 36.8219, arcAlt: 0.34 },   // London ↔ Nairobi
  { startLat: 48.8566, startLng: 2.3522, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.42 },   // Paris ↔ Tokyo
  { startLat: 40.7128, startLng: -74.0060, endLat: -23.5505, endLng: -46.6333, arcAlt: 0.32 },// NYC ↔ Sao Paulo
  { startLat: 47.6062, startLng: -122.3321, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.44 },// Seattle ↔ HK
  { startLat: 43.6532, startLng: -79.3832, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.33 },   // Toronto ↔ Amsterdam
  { startLat: 25.2048, startLng: 55.2708, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.45 }, // Dubai ↔ Sydney
  { startLat: 37.5665, startLng: 126.9780, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.45 },// Seoul ↔ SF
];

// 2b. Low-Altitude Constellation Mesh Lines
const CONSTELLATION_MESH_LINES = [
  { startLat: 37.7749, startLng: -122.4194, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.03 }, // SF ↔ LA
  { startLat: 34.0522, startLng: -118.2437, endLat: 47.6062, endLng: -122.3321, arcAlt: 0.04 }, // LA ↔ Seattle
  { startLat: 40.7128, startLng: -74.0060, endLat: 43.6532, endLng: -79.3832, arcAlt: 0.02 },  // NYC ↔ Toronto
  { startLat: 51.5074, startLng: -0.1278, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.02 },     // London ↔ Paris
  { startLat: 48.8566, startLng: 2.3522, endLat: 50.1109, endLng: 8.6821, arcAlt: 0.02 },     // Paris ↔ Frankfurt
  { startLat: 50.1109, startLng: 8.6821, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.02 },     // Frankfurt ↔ Amsterdam
  { startLat: 30.0444, startLng: 31.2357, endLat: -1.2921, endLng: 36.8219, arcAlt: 0.04 },   // Cairo ↔ Nairobi
  { startLat: 25.2048, startLng: 55.2708, endLat: 28.6139, endLng: 77.2090, arcAlt: 0.04 },   // Dubai ↔ Delhi
  { startLat: 1.3521, startLng: 103.8198, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.03 },  // Singapore ↔ HK
  { startLat: 22.3193, startLng: 114.1694, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.04 },  // HK ↔ Tokyo
  { startLat: 35.6762, startLng: 139.6503, endLat: 37.5665, endLng: 126.9780, arcAlt: 0.02 },  // Tokyo ↔ Seoul
];

const ALL_NETWORK_ARCS = [
  ...HIGH_ALTITUDE_ARCS,
  ...CONSTELLATION_MESH_LINES,
];

// GeoJSON point-in-polygon helper
function isPointInPolygonRing(pt: [number, number], ring: number[][]) {
  const [x, y] = pt;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function isPointInFeature(pt: [number, number], feature: any) {
  const geom = feature?.geometry;
  if (!geom) return false;
  if (geom.type === "Polygon") {
    return isPointInPolygonRing(pt, geom.coordinates[0]);
  } else if (geom.type === "MultiPolygon") {
    for (const poly of geom.coordinates) {
      if (isPointInPolygonRing(pt, poly[0])) return true;
    }
  }
  return false;
}

function isIndiaFeature(feature: any) {
  return (
    feature?.properties?.NAME === "India" ||
    feature?.properties?.ISO_A2 === "IN" ||
    feature?.properties?.ADM0_A3 === "IND"
  );
}

// Convert spherical (lat, lng, alt) to Cartesian Vector3
function getCartesianCoords(lat: number, lng: number, alt: number = 0.006, radius: number = 100) {
  const r = radius * (1 + alt);
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (180 - lng) * (Math.PI / 180);
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

export default function CyberGlobe() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const animFrameRef = useRef<number>(0);
  const dot3DDataRef = useRef<any[]>([]);

  // India Diwali celebration refs — kept outside React state so hovering a
  // country does not re-render the WebGL globe or rebuild its layers.
  const indiaFireworksRef = useRef<HTMLElement | null>(null);
  const isIndiaHoveredRef = useRef(false);
  const isIndiaClickCelebratingRef = useRef(false);
  const indiaCelebrationRef = useRef(false);
  const celebrationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const pointerInsideRef = useRef(false);
  const suppressHoverRef = useRef(false);
  const isMountedRef = useRef(true);
  const hasMountedRef = useRef(false);
  const pendingGlobeReadyRef = useRef(false);

  const [countriesData, setCountriesData] = useState<any>({ features: [] });
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const [globeReady, setGlobeReady] = useState(false);

  const indiaFeature = useMemo(
    () => (countriesData?.features || []).find(isIndiaFeature) ?? null,
    [countriesData]
  );

  // Randomized Network Arcs with unique initial gaps, speeds, and dash parameters
  const randomizedNetworkArcs = useMemo(() => {
    return ALL_NETWORK_ARCS.map((arc, i) => ({
      ...arc,
      initialGap: ((i * 0.43) % 3.5) + Math.random() * 2.0,
      animTime: 850 + Math.random() * 1350,
      dashLength: 0.22 + Math.random() * 0.28,
      dashGap: 1.1 + Math.random() * 1.5,
    }));
  }, []);

  // Load GeoJSON world map data
  useEffect(() => {
    fetch("/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        if (isMountedRef.current) setCountriesData(data);
      })
      .catch((err) => console.error("Failed to load country GeoJSON:", err));
  }, []);

  // Generate tiny land star points across continents (with golden sparkling Diwali lights for India)
  const landDotMatrixPoints = useMemo(() => {
    if (!countriesData?.features || countriesData.features.length === 0) return [];

    const dots: {
      lat: number;
      lng: number;
      baseScale: number;
      baseColor: string;
      isIndia?: boolean;
      phase: number;
      speed: number;
      flareSeed: number;
    }[] = [];

    // Step = 2.4° yields a clean, spaced-out, non-dense distribution of ~1,400 dots across world
    const step = 2.4;

    for (let lat = -56; lat <= 75; lat += step) {
      for (let lng = -180; lng <= 180; lng += step) {
        const sampleLng = lng + (Math.random() * 0.8 - 0.4);
        const sampleLat = lat + (Math.random() * 0.8 - 0.4);

        for (const feature of countriesData.features) {
          if (isPointInFeature([sampleLng, sampleLat], feature)) {
            const isIndia = isIndiaFeature(feature);

            // If it's India, skip in this pass so we can generate a dedicated sparkling golden Diwali constellation!
            if (isIndia) break;

            const r = Math.random();
            // Rest of world: Pure White (~12%), Soft White-Lavender (~23%), Bright Violet (~35%), Neon Purple (~30%)
            const baseColor =
              r > 0.88 ? "#ffffff" :
              r > 0.65 ? "#f3e8ff" :
              r > 0.40 ? "#d8b4fe" :
              r > 0.20 ? "#c084fc" : "#a855f7";

            // Very tiny base scales (0.06 to 0.12 relative radius)
            const baseScale = 0.06 + Math.random() * 0.06;

            dots.push({
              lat: sampleLat,
              lng: sampleLng,
              baseScale,
              baseColor,
              isIndia: false,
              phase: Math.random() * Math.PI * 2,
              speed: 1.2 + Math.random() * 2.8,
              flareSeed: Math.random() * 100,
            });
            break;
          }
        }
      }
    }

    // Dedicated Diwali Festive Pass for India: Glowing Yellow-Golden Sparkling Points
    const indiaFeature = countriesData.features.find(isIndiaFeature);

    if (indiaFeature) {
      // Step = 1.6° creates a rich, sparkling constellation of ~110 golden diyas across India
      const stepIndia = 1.6;
      for (let lat = 7.5; lat <= 36.5; lat += stepIndia) {
        for (let lng = 68.0; lng <= 97.5; lng += stepIndia) {
          const sampleLng = lng + (Math.random() * 0.6 - 0.3);
          const sampleLat = lat + (Math.random() * 0.6 - 0.3);

          if (isPointInFeature([sampleLng, sampleLat], indiaFeature)) {
            const r = Math.random();
            // Shiny, glowing yellow-golden Diwali palette:
            // White-Gold Diamond Flare (~18%), Shimmering Light Gold (~25%), Bright Golden Yellow (~27%), Pure Gold (~20%), Warm Amber (~10%)
            const baseColor =
              r > 0.82 ? "#ffffff" :
              r > 0.57 ? "#fef08a" :
              r > 0.30 ? "#fde047" :
              r > 0.10 ? "#facc15" : "#fbbf24";

            // Slightly more prominent sparkling presence for festival of lights
            const baseScale = 0.085 + Math.random() * 0.075;

            dots.push({
              lat: sampleLat,
              lng: sampleLng,
              baseScale,
              baseColor,
              isIndia: true,
              phase: Math.random() * Math.PI * 2,
              speed: 1.5 + Math.random() * 3.2,
              flareSeed: Math.random() * 100,
            });
          }
        }
      }
    }

    return dots;
  }, [countriesData]);

  // Key Hub Node markers for Globe pointsData
  const hubPointData = useMemo(() => {
    return HUB_LOCATIONS.map((hub) => {
      const isIndiaHub = hub.name === "Mumbai" || hub.name === "New Delhi";
      return {
        lat: hub.lat,
        lng: hub.lng,
        radius: isIndiaHub ? 0.60 : 0.50,
        altitude: 0.035,
        color: isIndiaHub ? "#fde047" : "#ffffff",
      };
    });
  }, []);

  // Translucent Glass Globe Material (Blackish Dark Translucent)
  const customGlobeMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color("#060210"),
      emissive: new THREE.Color("#180638"),
      emissiveIntensity: 0.30,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      side: THREE.DoubleSide,
      shininess: 25,
    });
  }, []);

  // Responsive resizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        if (w > 0 && h > 0 && isMountedRef.current) {
          setDimensions({ width: w, height: h });
        }
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Globe setup on ready
  useEffect(() => {
    if (!globeRef.current || !globeReady) return;

    const globeObj = globeRef.current as any;

    // ── Globe sphere material: blackish dark translucent glass ──
    const globeMaterial = globeObj.globeMaterial?.();
    if (globeMaterial) {
      globeMaterial.color             = new THREE.Color("#060210");
      globeMaterial.emissive          = new THREE.Color("#180638");
      globeMaterial.emissiveIntensity = 0.30;
      globeMaterial.transparent       = true;
      globeMaterial.opacity           = 0.55;
      globeMaterial.depthWrite        = false;
      globeMaterial.side              = THREE.DoubleSide;
      globeMaterial.shininess         = 25;
      globeMaterial.needsUpdate       = true;
    }

    // ── Orbit controls ──
    const controls = globeObj.controls?.();
    if (controls) {
      controls.autoRotate      = !indiaCelebrationRef.current;
      controls.autoRotateSpeed = 0.70;
      controls.enableZoom      = false;
      controls.enablePan       = false;
      controls.enableDamping   = true;
      controls.dampingFactor   = 0.05;
      controls.minPolarAngle   = Math.PI * 0.18;
      controls.maxPolarAngle   = Math.PI * 0.82;
    }

    if (globeObj.pointOfView) {
      // Start with India in view so the festival interaction is discoverable.
      globeObj.pointOfView({ lat: 22, lng: 79, altitude: 2.0 }, 0);
    }

    const scene = globeObj.scene?.();
    if (!scene) return;

    // Root group for extras
    let root = scene.getObjectByName("globeExtras") as THREE.Group;
    if (!root) {
      root = new THREE.Group();
      root.name = "globeExtras";
      scene.add(root);

      const R = 100;

      // Bottom energetic darkish purple spot light
      const spotLight = new THREE.PointLight(0xa855f7, 4.0, R * 3.5);
      spotLight.position.set(0, -R * 1.12, 0);
      root.add(spotLight);

      // Energetic darkish purple ambient + hemisphere fill
      root.add(new THREE.AmbientLight(0x3b0764, 0.8));
      root.add(new THREE.HemisphereLight(0x7c3aed, 0x14052b, 0.6));
    }

    // Build or update land star dots InstancedMesh
    if (landDotMatrixPoints.length > 0) {
      const existingStarMesh = root.getObjectByName("landStarDots");
      if (existingStarMesh) {
        root.remove(existingStarMesh);
      }

      const dotCount = landDotMatrixPoints.length;
      const geo = new THREE.SphereGeometry(1, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95 });
      const instancedMesh = new THREE.InstancedMesh(geo, mat, dotCount);
      instancedMesh.name = "landStarDots";

      dot3DDataRef.current = landDotMatrixPoints.map((dot) => {
        const coords = globeObj.getCoords
          ? globeObj.getCoords(dot.lat, dot.lng, 0.006)
          : getCartesianCoords(dot.lat, dot.lng, 0.006, 100);
        return {
          pos: new THREE.Vector3(coords.x, coords.y, coords.z),
          baseScale: dot.baseScale,
          baseColor: new THREE.Color(dot.baseColor),
          isIndia: dot.isIndia,
          phase: dot.phase,
          speed: dot.speed,
          flareSeed: dot.flareSeed,
        };
      });

      const dummy = new THREE.Object3D();
      dot3DDataRef.current.forEach((dot, i) => {
        dummy.position.copy(dot.pos);
        dummy.scale.setScalar(dot.baseScale);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
        instancedMesh.setColorAt(i, dot.baseColor);
      });

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

      root.add(instancedMesh);
    }

    // ── Animation Loop ──
    let tick = 0;
    const whiteColor = new THREE.Color("#ffffff");
    const goldFlareColor = new THREE.Color("#fffbeb");
    const tempColor = new THREE.Color();

    const animate = () => {
      tick += 0.018;

      // Animate tiny land star dots (twinkle & random star flash flares)
      const starMesh = root.getObjectByName("landStarDots") as THREE.InstancedMesh;
      if (starMesh && dot3DDataRef.current && dot3DDataRef.current.length > 0) {
        const dummy = new THREE.Object3D();

        dot3DDataRef.current.forEach((dot, i) => {
          // Smooth twinkle wave
          const wave1 = Math.sin(tick * dot.speed + dot.phase);
          const wave2 = Math.cos(tick * dot.speed * 1.6 + dot.phase * 2.1);
          const twinkle = 0.5 + 0.35 * wave1 + 0.15 * wave2;

          // Random star flash flare (~4-6% of stars flaring brightly at any time)
          const flareWave = Math.sin(tick * 1.3 + dot.flareSeed * 13.37);
          const isFlaring = flareWave > 0.90;

          let scale = dot.baseScale * (0.65 + 0.45 * twinkle);
          tempColor.copy(dot.baseColor);

          if (isFlaring) {
            const flareFactor = (flareWave - 0.90) / 0.10; // 0.0 to 1.0
            scale = dot.baseScale * (1.15 + flareFactor * 2.6); // Expand up to 3.75x
            if (dot.isIndia) {
              tempColor.lerp(goldFlareColor, 0.85 + flareFactor * 0.15); // Flash luminous diamond gold burst
            } else {
              tempColor.lerp(whiteColor, 0.85 + flareFactor * 0.15); // Flash pure white star burst
            }
          } else {
            tempColor.multiplyScalar(0.45 + 0.55 * twinkle);
          }

          dummy.position.copy(dot.pos);
          dummy.scale.setScalar(scale);
          dummy.updateMatrix();

          starMesh.setMatrixAt(i, dummy.matrix);
          starMesh.setColorAt(i, tempColor);
        });

        starMesh.instanceMatrix.needsUpdate = true;
        if (starMesh.instanceColor) starMesh.instanceColor.needsUpdate = true;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [globeReady, landDotMatrixPoints]);

  // Toggle the celebration directly in the DOM and pause the orbit so the
  // globe holds still while the crackers are popping over India.
  const applyIndiaCelebration = () => {
    const active = isIndiaHoveredRef.current || isIndiaClickCelebratingRef.current;
    indiaCelebrationRef.current = active;

    indiaFireworksRef.current?.classList.toggle("is-active", active);
    containerRef.current?.classList.toggle("is-india-celebrating", active);

    const controls = (globeRef.current as any)?.controls?.();
    if (controls) {
      controls.autoRotate = !active;
      // Flush any residual auto-rotate inertia so the globe holds still
      // immediately instead of drifting out from under the cursor.
      controls.dampingFactor = active ? 1 : 0.05;
    }
  };

  const handlePolygonHover = (polygon: any) => {
    // The globe keeps raycasting from the last pointer position even after the
    // cursor leaves; ignore those stale hover events.
    const nextHover = pointerInsideRef.current && isIndiaFeature(polygon);
    if (isIndiaHoveredRef.current === nextHover) return;
    isIndiaHoveredRef.current = nextHover;
    applyIndiaCelebration();
  };

  const triggerIndiaClickCelebration = () => {
    isIndiaClickCelebratingRef.current = true;
    applyIndiaCelebration();

    if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current);
    celebrationTimeoutRef.current = setTimeout(() => {
      isIndiaClickCelebratingRef.current = false;
      applyIndiaCelebration();
    }, 5200);
  };

  const handleGlobePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !(event.target instanceof HTMLCanvasElement)) return;
    pointerDownPosRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleGlobePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const down = pointerDownPosRef.current;
    pointerDownPosRef.current = null;
    if (!down || event.button !== 0 || !(event.target instanceof HTMLCanvasElement)) return;
    if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 8) return;

    const wrapper = containerRef.current;
    const globe = globeRef.current as any;
    if (!wrapper || !globe?.toGlobeCoords || !indiaFeature) return;

    const rect = wrapper.getBoundingClientRect();
    const coords = globe.toGlobeCoords(event.clientX - rect.left, event.clientY - rect.top);
    if (!coords) return;
    if (!isPointInFeature([coords.lng, coords.lat], indiaFeature)) return;

    triggerIndiaClickCelebration();

    // Touch has no persistent hover, so clear stale raycast hover state.
    if (event.pointerType === "touch") {
      suppressHoverRef.current = true;
      pointerInsideRef.current = false;
      isIndiaHoveredRef.current = false;
      applyIndiaCelebration();
    }
  };

  const handleGlobePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    suppressHoverRef.current = false;
    pointerInsideRef.current = true;

    // Re-evaluate hover directly from the cursor position. This also recovers
    // cleanly after leaving and re-entering India, instead of waiting for the
    // globe's internal hover object to change.
    const wrapper = containerRef.current;
    const globe = globeRef.current as any;
    if (!wrapper || !globe?.toGlobeCoords || !indiaFeature) return;

    const rect = wrapper.getBoundingClientRect();
    const coords = globe.toGlobeCoords(event.clientX - rect.left, event.clientY - rect.top);
    const nextHover = Boolean(coords) && isPointInFeature([coords.lng, coords.lat], indiaFeature);

    if (isIndiaHoveredRef.current === nextHover) return;
    isIndiaHoveredRef.current = nextHover;
    applyIndiaCelebration();
  };

  const handleGlobeEnter = () => {
    if (!suppressHoverRef.current) pointerInsideRef.current = true;
  };

  const handleGlobeLeave = () => {
    pointerInsideRef.current = false;
    isIndiaHoveredRef.current = false;
    applyIndiaCelebration();
  };

  useEffect(() => {
    hasMountedRef.current = true;
    isMountedRef.current = true;
    if (pendingGlobeReadyRef.current) setGlobeReady(true);
    return () => {
      isMountedRef.current = false;
      if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-cyber-globe="true"
      className="relative w-full h-[520px] sm:h-[620px] lg:h-[720px] flex flex-col items-center justify-center select-none overflow-hidden"
      onMouseEnter={handleGlobeEnter}
      onMouseLeave={handleGlobeLeave}
      onPointerDown={handleGlobePointerDown}
      onPointerMove={handleGlobePointerMove}
      onPointerUp={handleGlobePointerUp}
    >
      {/* Keyframes for hub pings + the India Diwali cracker overlay */}
      <style>{`
        @keyframes hubPing {
          75%, 100% { transform: scale(2.4); opacity: 0; }
        }

        .india-diwali-fireworks {
          pointer-events: none;
        }
        .india-diwali-content {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(0.82);
          transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .india-diwali-fireworks.is-active .india-diwali-content {
          opacity: 1;
          transform: scale(1);
        }
        .india-diwali-fireworks:not(.is-active) .diwali-particle,
        .india-diwali-fireworks:not(.is-active) .diwali-ring,
        .india-diwali-fireworks:not(.is-active) .diwali-aura {
          animation-play-state: paused;
        }
        .diwali-aura {
          position: absolute;
          inset: 8%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(250,204,21,0.20) 0%, rgba(251,146,60,0.10) 38%, rgba(251,146,60,0) 72%);
          animation: diwaliAuraPulse 2.4s ease-in-out infinite;
        }
        .diwali-burst {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 0;
          height: 0;
          transform: translate(var(--bx), var(--by));
        }
        .diwali-ring {
          position: absolute;
          left: 0;
          top: 0;
          width: 9px;
          height: 9px;
          margin: -4.5px 0 0 -4.5px;
          border: 1px solid rgba(254,240,138,0.95);
          border-radius: 50%;
          animation: diwaliRingExpand 1.35s ease-out infinite;
          animation-delay: var(--delay);
        }
        .diwali-particle {
          position: absolute;
          left: 0;
          top: 0;
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          background: var(--color);
          box-shadow: 0 0 5px var(--color), 0 0 12px var(--color);
          opacity: 0;
          will-change: transform, opacity;
          animation: diwaliSparkFly 1.35s cubic-bezier(0.16, 0.84, 0.44, 1) infinite;
          animation-delay: var(--delay);
        }
        .diwali-label {
          position: absolute;
          left: 50%;
          bottom: -4px;
          transform: translateX(-50%);
          white-space: nowrap;
          color: #fef3c7;
          font-family: inherit;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-shadow: 0 0 8px rgba(250,204,21,0.95), 0 0 18px rgba(251,146,60,0.7);
        }
        @keyframes diwaliSparkFly {
          0% { transform: translate(-50%, -50%) scale(0.35); opacity: 0; }
          12% { opacity: 1; }
          72% { opacity: 0.9; }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.12); opacity: 0; }
        }
        @keyframes diwaliRingExpand {
          0% { transform: scale(0.25); opacity: 0; }
          16% { opacity: 0.95; }
          100% { transform: scale(5.2); opacity: 0; }
        }
        @keyframes diwaliAuraPulse {
          0%, 100% { transform: scale(0.82); opacity: 0.55; }
          50% { transform: scale(1.08); opacity: 0.95; }
        }
        @media (prefers-reduced-motion: reduce) {
          .india-diwali-fireworks .diwali-particle,
          .india-diwali-fireworks .diwali-ring,
          .india-diwali-fireworks .diwali-aura {
            animation: none;
          }
          .india-diwali-fireworks .diwali-particle {
            opacity: 0.85;
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.4);
          }
          .india-diwali-fireworks .diwali-ring {
            opacity: 0.6;
            transform: scale(2.2);
          }
        }
      `}</style>

      {/* 3D Cyber Globe */}
      <Globe
        ref={globeRef}
        onGlobeReady={() => {
          pendingGlobeReadyRef.current = true;
          if (!hasMountedRef.current) return;
          // Defer the state update so it lands after this component's commit.
          window.setTimeout(() => {
            if (isMountedRef.current) setGlobeReady(true);
          }, 0);
        }}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        showGlobe={true}
        globeImageUrl={null}
        globeMaterial={customGlobeMaterial}

        // Energetic violet atmospheric halo
        showAtmosphere={true}
        atmosphereColor="#a855f7"
        atmosphereAltitude={0.35}

        // Country polygon outlines (Golden border for India, purple for rest of world)
        polygonsData={countriesData.features || []}
        polygonCapColor={() => "rgba(0,0,0,0)"}
        polygonSideColor={() => "rgba(0,0,0,0)"}
        polygonStrokeColor={(feat: any) =>
          isIndiaFeature(feat) ? "rgba(250, 204, 21, 0.85)" : "rgba(192,132,252,0.60)"
        }
        polygonAltitude={0.005}
        onPolygonHover={handlePolygonHover}

        // Major hub nodes points
        pointsData={hubPointData}
        pointLat={(d: any) => d.lat}
        pointLng={(d: any) => d.lng}
        pointColor={(d: any) => d.color}
        pointAltitude={(d: any) => d.altitude}
        pointRadius={(d: any) => d.radius}

        // Glowing animated network arcs with randomized flow
        arcsData={randomizedNetworkArcs}
        arcStartLat={(d: any) => d.startLat}
        arcStartLng={(d: any) => d.startLng}
        arcEndLat={(d: any) => d.endLat}
        arcEndLng={(d: any) => d.endLng}
        arcColor={() => ["#ffffff", "#f3e8ff", "#c084fc", "rgba(168,85,247,0.12)"]}
        arcStroke={0.38}
        arcDashLength={(d: any) => d.dashLength}
        arcDashGap={(d: any) => d.dashGap}
        arcDashInitialGap={(d: any) => d.initialGap}
        arcDashAnimateTime={(d: any) => d.animTime}
        arcAltitude={(d: any) => d.arcAlt}

        // Expanding wave rings at hub nodes
        ringsData={HUB_LOCATIONS}
        ringLat={(d: any) => d.lat}
        ringLng={(d: any) => d.lng}
        ringColor={(d: any) => {
          const isIndiaHub = d?.name === "Mumbai" || d?.name === "New Delhi";
          return (t: number) =>
            isIndiaHub
              ? `rgba(250,204,21,${Math.sqrt(1 - t) * 0.95})`
              : `rgba(216,180,254,${Math.sqrt(1 - t) * 0.9})`;
        }}
        ringMaxRadius={6}
        ringPropagationSpeed={2}
        ringRepeatPeriod={900}

        // HTML star-burst lens-flare elements at each hub city + hidden India overlay
        htmlElementsData={GLOBE_HTML_POINTS}
        htmlLat={(d: any) => d.lat}
        htmlLng={(d: any) => d.lng}
        htmlAltitude={(d: any) => (d?.isFestival ? 0.02 : 0.042)}
        htmlElement={(d: any) => {
          if (d?.isFestival) {
            const el = document.createElement("div");
            el.className = "india-diwali-fireworks";
            el.style.cssText = "width:160px;height:160px;pointer-events:none;";
            el.setAttribute("aria-hidden", "true");

            const colors = ["#fff7cc", "#fef08a", "#fde047", "#facc15", "#fbbf24", "#fb923c"];
            const bursts = [
              { x: -30, y: -18, delay: 0.0 },
              { x: 26, y: -26, delay: 0.34 },
              { x: -8, y: 22, delay: 0.68 },
              { x: 34, y: 18, delay: 0.18 },
              { x: -38, y: 10, delay: 0.52 },
            ];

            const burstHtml = bursts
              .map((burst, burstIndex) => {
                const particles = Array.from({ length: 7 }, (_, i) => {
                  const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.55;
                  const distance = 20 + Math.random() * 26;
                  const dx = Math.cos(angle) * distance;
                  const dy = Math.sin(angle) * distance;
                  const delay = burst.delay + Math.random() * 0.16;
                  const size = 1.5 + Math.random() * 2.2;
                  const color = colors[(burstIndex + i) % colors.length];
                  return `<span class="diwali-particle" style="--dx:${dx.toFixed(1)}px;--dy:${dy.toFixed(1)}px;--delay:${delay.toFixed(2)}s;--size:${size.toFixed(1)}px;--color:${color};"></span>`;
                }).join("");

                return `<div class="diwali-burst" style="--bx:${burst.x}px;--by:${burst.y}px;--delay:${burst.delay}s;"><span class="diwali-ring"></span>${particles}</div>`;
              })
              .join("");

            el.innerHTML = `
              <div class="india-diwali-content">
                <div class="diwali-aura"></div>
                ${burstHtml}
                <div class="diwali-label">✦ Happy Diwali ✦</div>
              </div>
            `;

            indiaFireworksRef.current = el;
            if (indiaCelebrationRef.current) el.classList.add("is-active");
            return el;
          }

          const isNav = Boolean(d?.page);
          const isIndiaHub = d?.name === "Mumbai" || d?.name === "New Delhi";

          const el = document.createElement("div");
          el.style.cssText = [
            "position:relative",
            "width:28px",
            "height:28px",
            "display:flex",
            "align-items:center",
            "justify-content:center",
            "transform:translate(-50%,-50%)",
            isNav ? "pointer-events:auto" : "pointer-events:none",
            isNav ? "cursor:pointer" : "",
          ].join(";");

          const pingColor1 = isIndiaHub ? "rgba(250,204,21,0.25)" : "rgba(192,132,252,0.18)";
          const pingColor2 = isIndiaHub ? "rgba(245,158,11,0.30)" : "rgba(168,85,247,0.25)";
          const coreGlow = isIndiaHub
            ? `0 0 5px 2px rgba(255,255,255,0.95),
               0 0 14px 5px rgba(253,224,71,0.90),
               0 0 28px 10px rgba(250,204,21,0.65),
               0 0 50px 16px rgba(245,158,11,0.40)`
            : `0 0 5px 2px rgba(255,255,255,0.95),
               0 0 14px 5px rgba(216,180,254,0.85),
               0 0 28px 10px rgba(168,85,247,0.55),
               0 0 50px 16px rgba(139,92,246,0.30)`;

          el.innerHTML = `
            <!-- Outer ping ring 1 -->
            <div style="position:absolute;width:24px;height:24px;border-radius:50%;
              background:${pingColor1};
              animation:hubPing 1.6s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <!-- Outer ping ring 2 -->
            <div style="position:absolute;width:16px;height:16px;border-radius:50%;
              background:${pingColor2};
              animation:hubPing 1.6s cubic-bezier(0,0,0.2,1) infinite 0.5s;"></div>
            <!-- Vertical spike -->
            <div style="position:absolute;width:1.5px;height:18px;
              background:linear-gradient(to bottom,transparent,rgba(255,255,255,0.95),transparent);
              border-radius:1px;"></div>
            <!-- Horizontal spike -->
            <div style="position:absolute;width:18px;height:1.5px;
              background:linear-gradient(to right,transparent,rgba(255,255,255,0.95),transparent);
              border-radius:1px;"></div>
            <!-- Diagonal spike NE/SW -->
            <div style="position:absolute;width:1.5px;height:12px;
              background:linear-gradient(to bottom,transparent,rgba(255,255,255,0.65),transparent);
              border-radius:1px;transform:rotate(45deg);"></div>
            <!-- Diagonal spike NW/SE -->
            <div style="position:absolute;width:12px;height:1.5px;
              background:linear-gradient(to right,transparent,rgba(255,255,255,0.65),transparent);
              border-radius:1px;transform:rotate(45deg);"></div>
            <!-- Bright white core with thematic glow -->
            <div class="cyber-globe-core" style="width:5px;height:5px;border-radius:50%;background:${isIndiaHub ? "#fef08a" : "white"};z-index:10;
              transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
              box-shadow:${coreGlow};"></div>
            ${
              isNav
                ? `
            <!-- Hover tooltip: section name + navigation cue -->
            <div class="cyber-globe-tooltip" style="position:absolute;bottom:30px;left:50%;
              transform:translate(-50%,4px);white-space:nowrap;z-index:20;
              padding:5px 13px;border-radius:9999px;
              background:rgba(59,7,100,0.88);
              border:1px solid rgba(168,85,247,0.8);
              color:#f5f3ff;font-family:inherit;font-size:11px;font-weight:600;
              letter-spacing:0.03em;
              box-shadow:0 0 22px rgba(168,85,247,0.5);
              opacity:0;transition:opacity 0.22s ease,transform 0.22s ease;">
              ${d.label}
              <div style="position:absolute;bottom:-4px;left:50%;width:8px;height:8px;
                transform:translateX(-50%) rotate(45deg);
                background:rgba(59,7,100,0.88);
                border-right:1px solid rgba(168,85,247,0.8);
                border-bottom:1px solid rgba(168,85,247,0.8);"></div>
            </div>`
                : ""
            }
          `;

          if (isNav) {
            const tooltip = el.querySelector(".cyber-globe-tooltip") as HTMLElement | null;
            const core = el.querySelector(".cyber-globe-core") as HTMLElement | null;

            const showHover = () => {
              if (tooltip) {
                tooltip.style.opacity = "1";
                tooltip.style.transform = "translate(-50%,0px)";
              }
              if (core) core.style.transform = "scale(1.4)";
            };
            const hideHover = () => {
              if (tooltip) {
                tooltip.style.opacity = "0";
                tooltip.style.transform = "translate(-50%,4px)";
              }
              if (core) core.style.transform = "scale(1)";
            };
            const goToPage = () => router.push(d.page);

            el.addEventListener("mouseenter", showHover);
            el.addEventListener("mouseleave", hideHover);
            el.addEventListener("click", (e: MouseEvent) => {
              e.stopPropagation();
              goToPage();
            });

            // Keyboard accessibility
            el.tabIndex = 0;
            el.setAttribute("role", "link");
            el.setAttribute("aria-label", `Go to ${d.label} page`);
            el.addEventListener("focus", showHover);
            el.addEventListener("blur", hideHover);
            el.addEventListener("keydown", (e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goToPage();
              }
            });
          }

          return el;
        }}
      />
    </div>
  );
}
