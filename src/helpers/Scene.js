import { SceneWizard } from "./session/session.js";

// Класс для создания диалога между пользователем и ботом 

class Scene {
  optionalData = {}
  constructor(name = "", ...steps) {
    this.name = name;
    this.steps = [...steps];
  }

  async get(user_id) {
    if (!user_id) {
      throw new Error("user_id is empty");
    }
    const scene = await SceneWizard.findOne({ where: { user_id } });
    return scene;
  }

  async enter(userId = 0, params = {}) {
    if (!userId) {
      throw new Error("Not enough data");
    }

    // Проверка существования сцены
    const currentScene = await this.get(userId)
    if (currentScene) {
      // Удаление существующей сцены
      await currentScene.destroy()
    }

    const scene = await SceneWizard.create({
      user_id: userId,
      name: this.name,
      // Нулевой step пропускается, тк, это первый вопрос без ответа
      current_step_idx: 0,
    });
    // this.user_id = userId;
    return await this.steps[0]({ ...params, scene: this });
  }

  async goStep(userId = 0, params = {}) {
    const currScene = await this.get(userId);
    if (!currScene) {
      return await this.enter(userId, params);
    }
    // const currentStepIdx = this.currentStepIdx
    // this передается, чтобы использовать функции данного класса с сохранением контекста
    // const params = { volunteer, update, scene: this }
    // this.user_id = userId;
    return await this.steps[currScene.current_step_idx]({
      ...params,
      scene: this,
    });
  }

  async _isLastStep() { }

  async next(userId) {
    // const currentStepIdx = await this._getCurrentStepIdx(this.user_id)
    const scene = await SceneWizard.findOne({
      where: { user_id: userId },
    });
    scene.current_step_idx += 1;
    await scene.save();
  }

  async selectStep(userId, idx) {
    const scene = await SceneWizard.findOne({
      where: { user_id: userId },
    });
    scene.current_step_idx = idx;
    await scene.save();
  }

  async leave(userId) {
    try {
      await this._delete(userId);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  back() { }

  jump() { }

  async _delete(user_id) {
    try {
      const scene = await SceneWizard.destroy({ where: { user_id } });
      return scene;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _getCurrentStepIdx(user_id) {
    const scene = await SceneWizard.findOne({ where: { user_id } });
    if (!scene) {
      return null;
    }
    const currentStepIdx = scene.current_step_idx;
    return currentStepIdx;
  }
}

export default Scene;
