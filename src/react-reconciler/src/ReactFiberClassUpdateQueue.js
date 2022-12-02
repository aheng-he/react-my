import assign from "shared/assign";
import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates";

export const UpdateState = 0;

export function initializeUpdateQueue(fiber){
    const queue = {
        shared: {
            // 循环链表
            pending: null,
        }
    }
    fiber.updateQueue = queue;
}

export function createUpdate(){
    const update = {tag: UpdateState}
    return update
}

export function enqueueUpdate(fiber, update){
    const updateQueue = fiber.updateQueue;
    const sharedQueue = updateQueue.shared;

    const pending = sharedQueue.pending;

    if(pending === null){
        update.next = update;
    }else{
        update.next = pending.next;
        pending.next = update;
    }
    // pending 要指向最后一个更新，最后一个更新的next指向第一个更新 => 方便后续继续添加更新
    // 单向循环链表
    updateQueue.shared.pending = update;
    return markUpdateLaneFromFiberToRoot(fiber)
}

/**
 * 根据老状态和更新队列中的更新 计算最新的状态
 * @param {*} workInProgress 要计算的fiber
 */
export function processUpdateQueue(workInProgress){
    const queue = workInProgress.updateQueue;
    const pendingQueue = queue.shared.pending;

    // 如果有更新，
    if(pendingQueue !== null){
        // 清空待更新的链表
        queue.shared.pending = null;
        // 获取更新队列中的最后一个更新 update = { payload : {element: 'h1'} }
        const lastPendingUpdate = pendingQueue;
        // 获取第一个更新
        const firstPendingUpate = lastPendingUpdate.next;

        // 将循环链表表为单向链表
        lastPendingUpdate.next = null;

        // 获取老的状态 null
        let newState = workInProgress.memoizedState;
        let update = firstPendingUpate;
        while(update){
            // 根据老状态和更新计算新状态
            newState = getStateFromUpdate(update, newState)
            update = update.next
        }
        // 把最终的计算结果赋值给 memoizedState
        workInProgress.memoizedState = newState;
    }
}

/**
 * 根据老状态和更新计算新状态
 * @param {*} update 更新的对象其实有很多种类型
 * @param {*} prevState 
 */
function getStateFromUpdate(update, prevState) {
    switch (update.tag) {
        case UpdateState:
          const { payload } = update;
          return assign({}, prevState, payload);
    }
  }