import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// DRACOLoader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);

export interface GripperParts {
    left: {
        splint: THREE.Object3D | undefined;
        support: THREE.Object3D | undefined;
        tie: THREE.Object3D | undefined;
    };
    right: {
        splint: THREE.Object3D | undefined;
        support: THREE.Object3D | undefined;
        tie: THREE.Object3D | undefined;
    };
    base: THREE.Object3D | undefined;
}

export interface GripperModel {
    scene: THREE.Group;
    parts: GripperParts;
}

export async function loadGripperModel(url: string): Promise<GripperModel | null> {
    const gltf = await loader.loadAsync(url);
    const scene = gltf.scene;
    const root = scene.getObjectByName("gripper_g2")
    if (!root) {
        return null
    }

    const parts = {
        left: {
            splint: root.getObjectByName("splint_l"),
            support: root.getObjectByName("support_l"),
            tie: root.getObjectByName("tie_l")
        },
        right: {
            splint: root.getObjectByName("splint_r"),
            support: root.getObjectByName("support_r"),
            tie: root.getObjectByName("tie_r")
        },
        base: root.getObjectByName("case")
    }

    return {
        scene,
        parts
    };
}
