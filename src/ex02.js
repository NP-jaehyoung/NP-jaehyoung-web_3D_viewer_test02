import * as THREE from 'three'
import {
    OrbitControls
}from 'three/examples/jsm/controls/OrbitControls.js'
import {
    WEBGL
} from './webgl'
import {
     OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

if(WEBGL.isWebGLAvailable()) {

    //장면
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff);

    //카메라 
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z=100;

    // 좌표축 추가
    const axesHelper = new THREE.AxesHelper( 10);
    scene.add( axesHelper );    

    //렌더러
    const renderer = new THREE.WebGLRenderer({
        alpha : true,  // => true 일시 배경 없이 가능
        antialias : true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    
    // 카메라
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.update();

    // 빛
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    ambientLight.position.set(0,2,12);
    scene.add(ambientLight);
    
    const scaling = new THREE.Vector3(0.01, 0.01, 0.01);
    // obj loader
    const OBJloader = new OBJLoader();
    let ObjGroup = new THREE.Object3D()
    //mtl loader
    const mtlLoader = new MTLLoader()
    mtlLoader.load('./static/models/kimhae/kimhae.mtl', (mtl) => {
        mtl.preload()
        OBJloader.setMaterials(mtl)
        OBJloader.load(
            './static/models/kimhae/kimhae.obj', 
            function (object) {
                object.scale.x = 0.001;
                object.scale.y = 0.001;
                object.scale.z = 0.001;
                ObjGroup.add(object);
                // ObjGroup.scale(scaling);
                scene.add(ObjGroup)
            },
            function (xhr) {
            const progress = (xhr.loaded / xhr.total) * 100 + '%'
            console.log(progress)
            },
            function(error) {
                console.log('An error happened')
            }
        )
    })

    
    

    // 카메라 obj에 포커스
    // controls.target.copy(ObjGroup.position);


    function render(time){
        time *=0.0005; // convert time to seconds

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    //반응형 처리
    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);
    console.log(';ad');
} else{
    var warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
}