# Gripper Physics (基于 Rapier3D 的机械爪物理仿真)

本项目是一个高性能的 Web 端机械爪物理仿真系统，结合了实时渲染与精确的动力学模拟。

## 🚀 技术栈

- **渲染引擎**: [Three.js](https://threejs.org/) - 负责复杂的 3D 模型渲染和实时视觉反馈。
- **物理引擎**: [Rapier3D](https://rapier.rs/) - 使用 WebAssembly 驱动的高性能物理引擎，提供工业级的几何碰撞和约束求解。
- **构建工具**: [Vite](https://vitejs.dev/) - 极速的开发环境与打包优化。
- **控制界面**: [lil-gui](https://github.com/georgealways/lil-gui) - 简洁直观的物理参数实时调试界面。
- **部署**: GitHub Actions - 自动化构建并部署至 GitHub Pages。

## ✨ 核心特性

- **电机驱动同步**: 实现基于电机的机械爪开合控制，支持目标角度插值。
- **优势群组优化 (Dominance Groups)**: 通过设置物理优先级，确保机械爪在与环境物体（如抓取物）交互时保持绝对的结构稳固，避免因物理穿透导致的抖动。
- **运动学与动力学混合驱动**:
  - 基座使用 **Kinematic** 驱动，实现平滑、精确的平移控制。
  - 零件（Splint/Tie/Support）使用 **Dynamic** 驱动，真实反馈碰撞阻力和接触力。
- **高精度约束求解**: 针对机械爪多级联动结构，优化了内部求解器迭代次数 (`numSolverIterations`)，平衡性能与准确性。

## 🛠️ 开始使用

### 环境要求

- Node.js 20+
- npm 或 pnpm

### 本地开发

1. 安装依赖:
   ```bash
   npm install
   ```
2. 启动开发服务器:
   ```bash
   npm run dev
   ```
3. 构建项目:
   ```bash
   npm run build
   ```

## 🎮 控制指南

- **键盘移动**: 使用键盘（如配置）或 GUI 面板控制机械爪的 XYZ 平移。
- **开合控制**: 通过 GUI 控制目标角度 `targetAngle` 实现机械爪的抓取动作。
- **调试线**: 勾选 `showDebugLines` 可实时观察 Rapier3D 生成的物理碰撞体和关节约束。

---

*Made with ❤️ for High-Stakes Physics Simulation.*
