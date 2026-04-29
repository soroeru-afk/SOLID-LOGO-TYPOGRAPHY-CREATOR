export const buildThreeJsScene = (
  imageBase64: string,
  effectId: string,
  resolution: number,
  lighting: number,
  autoRotate: boolean,
  colorFace: string,
  colorSide: string,
  bgColor: string,
  thickness: number
): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: transparent; overflow: hidden; font-family: monospace; }
    canvas { display: block; }
    #loader { position: absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#8a95a3; letter-spacing:0.3em; font-size:10px; font-weight:bold; }
  </style>
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
      }
    }
  </script>
</head>
<body>
<div id="loader">INITIALIZING 3D ENGINE...</div>
<script type="module">
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  const TEXT_IMAGE_BASE64 = '${imageBase64}';
  const EFFECT = '${effectId}';
  const RESOLUTION = ${resolution};
  const AUTO_ROTATE = ${autoRotate};
  const COLOR_FACE = parseInt('${colorFace}'.replace('#', '0x'));
  const COLOR_SIDE = parseInt('${colorSide}'.replace('#', '0x'));
  const BG_COLOR = parseInt('${bgColor}'.replace('#', '0x'));
  const THICKNESS = ${thickness};
  let LIGHTING = ${lighting};

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG_COLOR);
  scene.fog = new THREE.FogExp2(BG_COLOR, 0.002);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.set(0, 0, RESOLUTION * 1.5);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0); // Transparent
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = AUTO_ROTATE;
  controls.autoRotateSpeed = 2.0;

  // Add lights
  const makeLights = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4 * LIGHTING);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2 * LIGHTING);
    dirLight.position.set(100, 100, 50);
    scene.add(dirLight);
    
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8 * LIGHTING);
    dirLight2.position.set(-100, -50, -50);
    scene.add(dirLight2);
    
    const spotLight = new THREE.SpotLight(0xffffff, 1.5 * LIGHTING);
    spotLight.position.set(0, 100, 100);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);
    
    return [ambientLight, dirLight, dirLight2, spotLight];
  };
  
  const lights = makeLights();

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  scene.environment = pmremGenerator.fromScene(scene).texture;

  // Load image and generate
  const img = new Image();
  img.src = TEXT_IMAGE_BASE64;
  
  let instancedMesh;
  
  img.onload = () => {
    document.getElementById('loader').style.display = 'none';
    const aspect = img.width / img.height;
    
    const h = Math.floor(RESOLUTION / Math.sqrt(aspect));
    const w = Math.floor(h * aspect);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    
    ctx.drawImage(img, 0, 0, w, h);
    const idata = ctx.getImageData(0,0,w,h);
    const data = idata.data;

    let points = [];
    for(let y=0; y<h; y++){
      for(let x=0; x<w; x++){
        const idx = (y*w + x) * 4;
        const a = data[idx+3];
        
        if (a > 128) {
           const px = (x - w/2);
           const py = -(y - h/2);
           points.push(new THREE.Vector3(px, py, 0));
        }
      }
    }

    if (points.length === 0) return;

    const group = new THREE.Group();
    scene.add(group);

    const dummy = new THREE.Object3D();

    if (EFFECT === 'solid_voxel') {
       const geometry = new THREE.BoxGeometry(0.9, 0.9, THICKNESS);
       const matFace = new THREE.MeshStandardMaterial({ 
         color: COLOR_FACE, roughness: 0.8, metalness: 0.0 
       });
       const matSide = new THREE.MeshStandardMaterial({ 
         color: COLOR_SIDE, roughness: 0.9, metalness: 0.0 
       });
       const materials = [matSide, matSide, matSide, matSide, matFace, matFace];
       
       instancedMesh = new THREE.InstancedMesh(geometry, materials, points.length);
       
       points.forEach((p, i) => {
         dummy.position.copy(p);
         dummy.updateMatrix();
         instancedMesh.setMatrixAt(i, dummy.matrix);
       });
       group.add(instancedMesh);
    } 
    else if (EFFECT === 'wireframe_block') {
       const geometry = new THREE.BoxGeometry(1, 1, THICKNESS);
       const material = new THREE.MeshBasicMaterial({ 
         color: COLOR_FACE,
         wireframe: true,
         transparent: true,
         opacity: 0.6
       });
       instancedMesh = new THREE.InstancedMesh(geometry, material, points.length);
       points.forEach((p, i) => {
         dummy.position.copy(p);
         dummy.updateMatrix();
         instancedMesh.setMatrixAt(i, dummy.matrix);
       });
       group.add(instancedMesh);
    }
    else if (EFFECT === 'dot_matrix') {
       const geometry = new THREE.SphereGeometry(0.4, 12, 12);
       const material = new THREE.MeshStandardMaterial({ 
         color: COLOR_FACE,
         roughness: 0.5,
         metalness: 0.0
       });
       instancedMesh = new THREE.InstancedMesh(geometry, material, points.length);
       points.forEach((p, i) => {
         dummy.position.copy(p);
         dummy.updateMatrix();
         instancedMesh.setMatrixAt(i, dummy.matrix);
       });
       group.add(instancedMesh);
    }
    else if (EFFECT === 'clean_flat') {
       const geometry = new THREE.BoxGeometry(1.05, 1.05, THICKNESS);
       const matFace = new THREE.MeshStandardMaterial({ 
         color: COLOR_FACE, roughness: 0.8, metalness: 0.0 
       });
       const matSide = new THREE.MeshStandardMaterial({ 
         color: COLOR_SIDE, roughness: 0.8, metalness: 0.0 
       });
       const materials = [matSide, matSide, matSide, matSide, matFace, matFace];
       
       instancedMesh = new THREE.InstancedMesh(geometry, materials, points.length);
       points.forEach((p, i) => {
         dummy.position.copy(p);
         dummy.updateMatrix();
         instancedMesh.setMatrixAt(i, dummy.matrix);
       });
       group.add(instancedMesh);
    }

    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);
    
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y);
    camera.position.z = maxDim * 1.2;
    controls.target.set(0,0,0);
  };

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  window.addEventListener('message', (e) => {
    if(e.data.type === 'UPDATE_LIGHT') {
      LIGHTING = e.data.value;
      lights[0].intensity = 0.4 * LIGHTING; // ambient
      lights[1].intensity = 1.2 * LIGHTING; // dir1
      lights[2].intensity = 1.0 * LIGHTING; // dir2
      lights[3].intensity = 2.0 * LIGHTING; // spot
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
</script>
</body>
</html>`;
};
