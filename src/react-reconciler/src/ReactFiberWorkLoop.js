import { scheduleCallback } from "scheduler"
import { createWorkInProgress } from "./ReactFiber";

let workInProgress = null;

export function scheduleUpdateOnFiber(root){
    ensureRootIsScheduled(root)
}

function ensureRootIsScheduled(root){
    scheduleCallback(performConcurrentWorkOnRoot.bind(null, root))
}

function performConcurrentWorkOnRoot(root){

    renderRootSync(root)
}

function prepareFreshStack(root){
    workInProgress = createWorkInProgress(root.current, null)
}

function renderRootSync(root){
    prepareFreshStack(root)
}