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
    camera.position.z=3;

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

    // 텍스쳐 추가
    const textureLoader = new THREE.TextureLoader();
    const textureBaseColor = textureLoader.load('src/image/Stone_Path_008_basecolor.jpg');
    const textureNormalMap = textureLoader.load('src/image/Stone_Path_008_normal.jpg');
    const textureHeightMap = textureLoader.load('src/image/Stone_Path_008_height.png');
    const textureRoughnessMap = textureLoader.load('src/image/Stone_Path_008_roughness.jpg');
    
    //도형
    const geometry01 = new THREE.SphereGeometry(.5,162,16);
    const material01 = new THREE.MeshStandardMaterial({
            map : textureBaseColor,
    });
    const obj01 = new THREE.Mesh(geometry01,material01);
    obj01.position.x=-1;
    scene.add(obj01);

    const geometry02 = new THREE.SphereGeometry(.5,162,16);
    const material02 = new THREE.MeshStandardMaterial({
        map : textureBaseColor,
        normalMap : textureNormalMap
    });
    const obj02 = new THREE.Mesh(geometry02,material02);
    scene.add(obj02);

    const geometry03 = new THREE.SphereGeometry(.5,162,16);
    const material03 = new THREE.MeshStandardMaterial({
        map : textureBaseColor,
        normalMap : textureNormalMap,
        displacementMap : textureHeightMap,
        displacementScale : 0.05

    });
    const obj03 = new THREE.Mesh(geometry03,material03);
    obj03.position.x=1;
    scene.add(obj03);

    const geometry04 = new THREE.SphereGeometry(.5,162,16);
    const material04 = new THREE.MeshStandardMaterial({
        map : textureBaseColor,
        normalMap : textureNormalMap,
        displacementMap : textureHeightMap,
        displacementScale : 0.05,
        roughnessMap : textureRoughnessMap
    });
    const obj04 = new THREE.Mesh(geometry04,material04);
    obj04.position.x=2;
    scene.add(obj04);

    // obj loader
    const OBJloader = new OBJLoader();
    let ObjGroup = new THREE.Object3D()
    //mtl loader
    const mtlLoader = new MTLLoader()
    mtlLoader.load('static/models/kimhae/charizar-export.mtl', (mtl) => {
        mtl.preload()
        OBJloader.setMaterials(mtl)
        OBJLoader.load(
            'static/models/kimhae/charizar-export.obj', 
            function (object) {
                ObjGroup.add( object );
                structuredClone.add(ObjGroup)
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

        // obj01.rotation.x = time;
        obj01 .rotation.y = time;
        // obj02.rotation.x = time;
        obj02 .rotation.y = time;
        // obj03.rotation.x = time;
        obj03 .rotation.y = time;
        obj04 .rotation.y = time;

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