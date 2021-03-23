import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'

import {
  append as svgAppend,
  // attr as svgAttr,
  // classes as svgClasses,
  create as svgCreate,
  remove as svgRemove
} from 'tiny-svg'

import {
  getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil'

import { is } from 'bpmn-js/lib/util/ModelUtil'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'

const HIGH_PRIORITY = 1500
const TASK_BORDER_RADIUS = 2

const customLists = [
  'bpmn:UserTask',
  'bpmn:ServiceTask',
  'bpmn:ScriptTask',
  'event',
  'bpmn:StartEvent',
  'bpmn:IntermediateThrowEvent',
  'bpmn:ExclusiveGateway'
]
const customConfig = {
  'bpmn:UserTask': {
    'url': require('../../assets/user-task.png'),
    'attr': { x: 0, y: 0, width: 100, height: 80 }
  },
  'bpmn:ServiceTask': {
    'url': require('../../assets/service-task.png'),
    'attr': { x: 0, y: 0, width: 100, height: 80 }
  },
  'bpmn:ScriptTask': {
    'url': require('../../assets/script-task.png'),
    'attr': { x: 0, y: 0, width: 100, height: 80 }
  },
  'bpmn:StartEvent': {
    'url': require('../../assets/start-event.png'),
    'attr': { x: -10, y: -8, width: 56, height: 50 }
  },
  'bpmn:IntermediateThrowEvent': {
    'url': require('../../assets/intermediate-event.png'),
    'attr': { x: -5, y: -5, width: 44, height: 44 }
  },
  'bpmn:EndEvent': {
    'url': require('../../assets/end-event-none.png'),
    'attr': { x: -5, y: -5, width: 44, height: 44 }
  },
  'bpmn:ExclusiveGateway': {
    'url': require('../../assets/gateway-none.png'),
    'attr': { x: -10, y: -8, width: 70, height: 70 }
  }
}

export default class CustomRenderer extends BaseRenderer {
  constructor (eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY)

    this.bpmnRenderer = bpmnRenderer
  }

  canRender (element) {
    // only render tasks and events (ignore labels)
    return isAny(element, customLists) && !element.labelTarget
  }

  drawShape (parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element)
    const type = element.type
    const { url, attr } = customConfig[type]
    const customIcon = svgCreate('image', {
      ...attr,
      href: url
    })
    console.log('e', element)
    svgRemove(shape)
    svgAppend(parentNode, customIcon)
    return shape
  }

  getShapePath (shape) {
    if (is(shape, 'bpmn:Task')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS)
    }

    return this.bpmnRenderer.getShapePath(shape)
  }
}

CustomRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ]

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
// function drawRect (parentNode, width, height, borderRadius, strokeColor) {
//   const rect = svgCreate('rect')

//   svgAttr(rect, {
//     width: width,
//     height: height,
//     rx: borderRadius,
//     ry: borderRadius,
//     stroke: strokeColor || '#000',
//     strokeWidth: 2,
//     fill: '#fff'
//   })

//   svgAppend(parentNode, rect)

//   return rect
// }

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
// function prependTo (newNode, parentNode, siblingNode) {
//   parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild)
// }
