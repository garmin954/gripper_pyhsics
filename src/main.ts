import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initPhysics } from './physics';
import { loadGripperModel } from './loader';
import { initGUI, guiState } from './gui';

async function main() {
    // 1. 初始化物理
    const physics = await initPhysics();

    // 2. 初始化渲染器
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 5);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // 半球光：提供整体环境照明
    const hemi = new THREE.HemisphereLight(0xbad7f0, 0x1d1a12, 0.65);
    scene.add(hemi);

    // 坐标系
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    // 平行光：提供方向光与阴影
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(0, 10, 0);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    scene.add(dir);

    // ===== 地面（渲染） =====
    const ground = new THREE.Mesh(
        new THREE.BoxGeometry(20, 0.1, 20),
        new THREE.MeshStandardMaterial({ color: 0x2a313d, metalness: 0.1, roughness: 0.9 }),
    );

    ground.position.setY(-0.1)
    scene.add(ground);

    // 3. 加载 GLB 模型部件
    let gripper: any = null;
    try {
        gripper = await loadGripperModel('/gripperg2.glb');
        if (!gripper) {
            throw new Error('模型加载失败');
        }
        // gripper.scene.getObjectByName("case").visible = false;

        // 创建该模型物理部分的刚体集
        scene.add(gripper.scene);
        physics.addGripperParts(gripper.parts);

    } catch (e) {
        console.error('模型加载失败:', e);
    }

    // 5. GUI 控制
    initGUI();

    // 6. 物理调试渲染器
    const debugLines = new THREE.LineSegments(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true })
    );


    scene.add(debugLines);

    // 7. 动画循环
    function animate() {
        requestAnimationFrame(animate);

        if (gripper) {
            // gripper.scene.position.set(guiState.posX, guiState.posY, guiState.posZ);
        }

        // a. 更新主动件 tie 的变换
        if (gripper && gripper.parts.left.tie) {
            const rad = (guiState.tieRotationY * Math.PI) / 180;
            // 控制 tie 绕着其局部 Y 轴旋转，从而作为主动件驱动整个机械爪运动
            physics.setPartKinematicRotation(gripper.parts.left.tie, new THREE.Euler(0, rad, 0));
            physics.setPartKinematicRotation(gripper.parts.right.tie, new THREE.Euler(0, -rad, 0));

        }

        // b. 步进物理世界
        physics.step();

        // c. 更新调试辅助线
        const buffers = physics.world.debugRender();
        debugLines.geometry.setAttribute('position', new THREE.BufferAttribute(buffers.vertices, 3));
        debugLines.geometry.setAttribute('color', new THREE.BufferAttribute(buffers.colors, 4));

        // d. 同步物理状态到视觉
        physics.partRigidBodies.forEach((rb, part) => {
            const p = rb.translation();
            const r = rb.rotation();

            // 因为 RigidBody 的 translation 处于世界坐标下，而 part 是嵌套在 scene 中的，
            // 假设 gripper.scene 没有发生过变换，那么可以直接赋值 part.position。
            // 假如 gripper.scene 进行了平移旋转，在更复杂的应用中应该使用 worldToLocal，这里先简单按世界坐标处理
            part.position.set(p.x, p.y, p.z);
            part.quaternion.set(r.x, r.y, r.z, r.w);
        });

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

main();
