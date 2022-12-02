import { NoFlags } from "./ReactFiberFlags";
import { HostComponent, HostRoot, HostText, IndeterminateComponent } from "./ReactWorkTags";

export function FiberNode(tag, pendingProps, key){
    this.tag = tag;
    this.key = key;
    // fiber 类型 具体的元素标签 来自于虚拟DOM节点的type， span div a
    this.type = null;  
    // 每个虚拟DOM => Fiber节点 => 真实DOM
    this.stateNode = null;

    this.return = null;  // 指向父节点
    this.child = null;  // 指向第一个子节点
    this.sibling = null;  // 指向弟弟节点

    // fiber哪来的？通过虚拟DOM创建，虚拟DOM会提供pendingProps用来创建fiber节点的属性
    this.pendingProps = pendingProps;  // 待生效的属性
    this.memoizedProps = null;  // 已经生效的属性

    // 每一个fiber还会有更新队列
    this.updateQueue = null;
    // 每个fiber还会有自己的状态，每一种fiber状态存在的类型是不一样的
    // 类组件对应的fiber存的就是类的实例状态，HostRoot存的就是要渲染的元素
    this.memoizedState = null;

    // 副作用标识，表示要对此fiber进行何种的操作
    this.flags = NoFlags;
    // 子节点的副作用标识
    this.subtreeFlags = NoFlags;
    // 替身，轮换，DOM-Diff的时候使用
    this.alternate = null;
}

function createFiber(tag, pendingProps, key){
    return new FiberNode(tag, pendingProps, key)
}

export function createHostRootFiber(){
    return createFiber(HostRoot, null, null)
}
// We use a double buffering pooling technique because we know that we'll
// only ever need at most two versions of a tree. We pool the "other" unused
// node that we're free to reuse. This is lazily created to avoid allocating
// extra objects for things that are never updated. It also allow us to
// reclaim the extra memory if needed.
//我们使用双缓冲池技术，因为我们知道一棵树最多只需要两个版本
//我们将“其他”未使用的我们可以自由重用的节点
//这是延迟创建的，以避免分配从未更新的内容的额外对象。它还允许我们如果需要，回收额外的内存
/**
 * 基于老的fiber和新的属性创建新的fiber
 * @param {*} current 老fiber
 * @param {*} pendingProps 新属性
 */
export function createWorkInProgress(current, pendingProps){
    let workInProgress = current.alternate;
    if(workInProgress === null){
        workInProgress = createFiber(current.tag, pendingProps, current.key)
        workInProgress.type = current.type;
        workInProgress.stateNode = current.stateNode;
        workInProgress.alternate = current;
        current.alternate = workInProgress
    }else{
        workInProgress.pendingProps = pendingProps;
        workInProgress.type = current.type;
        workInProgress.flags = NoFlags;
        workInProgress.subtreeFlags = NoFlags;
    }

    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue;
    workInProgress.sibling = current.sibling;
    workInProgress.index = current.index;
    return workInProgress
}

export function createFiberFromTypeAndProps(type, key, pendingProps) {
    let fiberTag = IndeterminateComponent;
    if (typeof type === "string") {
    fiberTag = HostComponent;
    }
    const fiber = createFiber(fiberTag, pendingProps, key);
    fiber.type = type;
    return fiber;
}
export function createFiberFromElement(element) {
    const { type } = element;
    const { key } = element;
    const pendingProps = element.props;
    const fiber = createFiberFromTypeAndProps(type, key, pendingProps);
    return fiber;
}

export function createFiberFromText(content) {
    const fiber = createFiber(HostText, content, null);
    return fiber;
}