import THREE from '../third_party/three.js';
import {renderer, getCamera} from '../modules/three.js';
import Maf from '../modules/maf.js';
import easings from '../modules/easings.js';
import RoundedCylinderGeometry from '../modules/three-rounded-cylinder.js';

const canvas = renderer.domElement;
const camera = getCamera();
const scene = new THREE.Scene();
const group = new THREE.Group();

const whiteMaterial = new THREE.MeshStandardMaterial({color:0xffffff});
const blackMaterial = new THREE.MeshStandardMaterial({color:0x000000});

const MAX = 30;
const objects = [];
for (let j=0; j<MAX; j++) {
  const r = MAX-j;
  const h = 1 + 1 * j;
  const mesh = new THREE.Mesh(
    new RoundedCylinderGeometry(r,h,.1,5),
    (j%2)?blackMaterial:whiteMaterial
  );
  objects.push(mesh);
  mesh.receiveShadow = mesh.castShadow = true;
  group.add(mesh);
}
group.scale.setScalar(.075);
group.rotation.x =- Math.PI / 2;
scene.add(group);

const directionalLight = new THREE.DirectionalLight( 0xffffff, .5 );
directionalLight.position.set(-1,1,1);
directionalLight.castShadow = true;
scene.add( directionalLight );

const directionalLight2 = new THREE.DirectionalLight( 0xffffff, .5 );
directionalLight2.position.set(1,2,1);
directionalLight2.castShadow = true;
scene.add( directionalLight2 );

const ambientLight = new THREE.AmbientLight(0x808080, .5);
scene.add(ambientLight);

const light = new THREE.HemisphereLight( 0xcefeff, 0xb3eaf0, .5 );
scene.add( light );

camera.position.set(0,10,0);
camera.lookAt(group.position);
renderer.setClearColor(0xffffff,1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const loopDuration = 3;
const cameraOffset = new THREE.Vector3();

function draw(startTime) {

  const time = ( .001 * (performance.now()-startTime)) % loopDuration;
  const t = time / loopDuration;

  objects.forEach( (o, id) => {
    o.rotation.z = t * Maf.TAU + .2 * id;
  });

  renderer.render(scene, camera);
}

export { draw, loopDuration, canvas };
