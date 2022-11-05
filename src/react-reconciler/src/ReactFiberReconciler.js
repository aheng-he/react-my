import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from './ReactFiberClassUpdateQueue';
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop';

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}
/**
 * 更新容器，把虚拟DOM变成真实的DOM
 * @param {*} element 虚拟DOM
 * @param {*} container DOM容器 FiberRootNode containerInfo div#root    
 */
export function updateContainer(element, container){

    // 获取当前的fiber
    const current = container.current;
    // 创建更新
    const update = createUpdate()
    // 保存要更新的DOM
    update.payload = {element}
    // 将要更新的对象添加到 current这个根Fiber的更新队列上
    const root = enqueueUpdate(current, update)

    scheduleUpdateOnFiber(root)
}