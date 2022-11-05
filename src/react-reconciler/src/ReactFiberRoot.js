import { createHostRootFiber } from "./ReactFiber";
import { initializeUpdateQueue } from "./ReactFiberClassUpdateQueue";


function FiberRootNode(containerInfo) {
    this.containerInfo = containerInfo;
  }
  

export function createFiberRoot(containerInfo){
    const root = new FiberRootNode(containerInfo)
    // HostRoot 指的就是根节点 div#root
    const uninitializedFiber = createHostRootFiber()
    // 根节点的 current 指向当前的跟fiber
    root.current = uninitializedFiber;
    // 根fiber的stateNode就是真实DOM节点指向 FiberRootNode
    uninitializedFiber.stateNode = root;

    // 初始化更新队列
    initializeUpdateQueue(uninitializedFiber)
    console.log('root :>> ', root);
    return root
}