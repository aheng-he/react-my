import logger from 'shared/logger';
import { HostComponent, HostRoot, HostText } from './ReactWorkTags';
import { processUpdateQueue } from './ReactFiberClassUpdateQueue';
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber';
import { shouldSetTextContent } from './ReactDOMHostConfig';

/**
 * 根据新的虚拟DOM生成新的Fiber链表
 * @param {*} current 老得父fiber
 * @param {*} workInProgress 新的子Fiber
 * @param {*} nextChildren 新的子虚拟DOM
 */
function reconcileChildren(current, workInProgress, nextChildren){
    // 如果此新的 fiber没有老fiber，说明此新fiber是新创建的
    if(current === null){
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren)
    }else{
        // 如果有老fiber的话，做DOM-DIFF
        // 拿老的子fiber链表与新的子虚拟DOM进行比较，最小话更新
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren)
    }
}

function updateHostRoot(current, workInProgress){
    // 需要知道他的子虚拟DOM，知道它的儿子的子虚拟DOM的信息
    processUpdateQueue(workInProgress)  // workInprogress.memoizedState = { element } 

    const nextState = workInProgress.memoizedState;
    const nextChildren = nextState.element;

    // 协调子节点 DOM-DIFF
    reconcileChildren(current, workInProgress, nextChildren)

    return workInProgress.child; //{tag:5,type:'h1'}
}

function updateHostComponent(current, workInProgress) {
    const { type } = workInProgress;
    const nextProps = workInProgress.pendingProps;
    let nextChildren = nextProps.children;
    const isDirectTextChild = shouldSetTextContent(type, nextProps);
    if (isDirectTextChild) {
      nextChildren = null;
    }
    reconcileChildren(current, workInProgress, nextChildren);
    return workInProgress.child;
}

/**
 * 目标是根据新虚拟DOM构建新的fiber子链表，child sibling
 * @param {*} current 老的fiber
 * @param {*} workInProgress 新的fiber
 */
export function beginWork(current, workInProgress){
    logger('beginwork', workInProgress)

    switch(workInProgress.tag){
        case HostRoot:
            return updateHostRoot(current, workInProgress)
        case HostComponent:
            return updateHostComponent(current, workInProgress)
        case HostText:
            return null;
        default:
            return null
    }
}