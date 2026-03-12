import GUI from 'lil-gui';

export const guiState = {
    targetAngle: 0,
    currentAngle: 0,
    speed: 20, // 0-100 开合速度
    showDebugLines: true, // 是否显示物理辅助线
    posX: 0,
    posY: 0,
    posZ: 0
};

export function initGUI() {
    const gui = new GUI();

    const actions = {
        open: () => { guiState.targetAngle = 45; },
        close: () => { guiState.targetAngle = 0; }
    };

    const actionFolder = gui.addFolder('控制');
    actionFolder.add(actions, 'open').name('打开');
    actionFolder.add(actions, 'close').name('闭合');
    actionFolder.add(guiState, 'speed', 1, 100).name('开合速度 (0-100)').step(1);
    actionFolder.add(guiState, 'showDebugLines').name('物理调试线');

    const posFolder = gui.addFolder('机械爪位置');
    posFolder.add(guiState, 'posX', -10, 10).name('X 位置').step(0.1);
    posFolder.add(guiState, 'posY', -10, 10).name('Y 位置').step(0.1);
    posFolder.add(guiState, 'posZ', -10, 10).name('Z 位置').step(0.1);

    return gui;
}
