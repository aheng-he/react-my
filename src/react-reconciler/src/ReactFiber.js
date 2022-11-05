import { NoFlags } from "./ReactFiberFlags";
import { HostRoot } from "./ReactWorkTags";

export function FiberNode(tag, pendingProps, key){
    this.tag = tag;
    this.key = key;
    this.stateNode = null;

    this.return = null;
    this.child = null;
    this.sibling = null;

    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;

    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
    this.alternate = null;
}

function createFiber(tag, pendingProps, key){
    return new FiberNode(tag, pendingProps, key)
}

export function createHostRootFiber(){
    return createFiber(HostRoot, null, null)
}