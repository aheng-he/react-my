import isArray from 'shared/isArray';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { createFiberFromElement, createFiberFromText } from './ReactFiber';
import { FiberNode } from './ReactFiber';
import { Placement } from './ReactFiberFlags';
import { HostText } from './ReactWorkTags';


function createChildReconciler(shouldTrackSideEffects){
    function reconcileSingleElement(returnFiber, currentFirstChild, element){
        const created = createFiberFromElement(element)
        created.return = returnFiber
        return created
    }

    function placeSingleChild(newFiber){
        if(shouldTrackSideEffects) newFiber.flags |= Placement
        return newFiber
    }

    function reconcileSingleTextNode(returnFiber, currentFirstChild, content){
        const created = new FiberNode(HostText, { content }, null)
        created.return = returnFiber
        return created
    }

    function createChild(returnFiber, newChild){
        if((typeof newChild === "string" && newChild !== "") || typeof newChild === "number"){
            const create = createFiberFromText(`${newChild}`)
            create.return = returnFiber
            return create
        }
        if(typeof newChild === "object" && newChild !== null){
            switch(newChild.$$typeof){
                case REACT_ELEMENT_TYPE : {
                    const created = createFiberFromElement(newChild)
                    created.return = returnFiber;
                    return created
                }
                default: 
                break
            }
        }
        return null
    }
    function placeChild(newFiber, lastPlacedIndex, newIdx){
        newFiber.index = newIdx;
        if(shouldTrackSideEffects){
            newFiber.flags != Placement;
        }
    }

    function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren){
        let resultingFirstChildren = null;
        let previousNewFiber = null;
        let newIdx = 0;

        for(; newIdx < newChildren.length; newIdx++){
            const newFiber = createChild(returnFiber, newChildren[newIdx])
            if(newFiber === null){
                continue
            }

            placeChild(newFiber, newIdx)
            if(previousNewFiber === null){
                resultingFirstChildren = newFiber
            }else{
                previousNewFiber.sibling = newFiber
            }
            previousNewFiber = newFiber;
        }
        return resultingFirstChildren
    }

    function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
        if (typeof newChild === "object" && newChild !== null) {
            switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE: {
                return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild));
            }
            default:
                break;
            }
            if (isArray(newChild)) {
            return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
            }
        }
        if (typeof newChild === "string") {
            return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, newChild));
        }
        return null;
    }
    return reconcileChildFibers;
}

export const reconcileChildFibers = createChildReconciler(true)
export const mountChildFibers = createChildReconciler(false)