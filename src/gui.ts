import GUI from 'lil-gui';

export const guiState = { tieRotationY: 0, posX: 0, posY: 0, posZ: 0 };

export function initGUI() {
    const gui = new GUI();
    
    gui.add(guiState, 'tieRotationY', -45, 45).name('开合角度 (度)');

    const posFolder = gui.addFolder('机械爪位置');
    posFolder.add(guiState, 'posX', -10, 10).name('X 位置').step(0.1);
    posFolder.add(guiState, 'posY', -10, 10).name('Y 位置').step(0.1);
    posFolder.add(guiState, 'posZ', -10, 10).name('Z 位置').step(0.1);

    return gui;
}
