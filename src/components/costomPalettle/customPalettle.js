import {assign} from 'min-dash'
// const SUITABILITY_SCORE_HIGH = 100
// const SUITABILITY_SCORE_AVERGE = 50
// const SUITABILITY_SCORE_LOW = 25

export default class CustomPalette {
  constructor (create, elementFactory, palette, translate, handTool, globalConnect) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate
    this.handTool = handTool
    this.globalConnect = globalConnect
    palette.registerProvider(this)
  }

  getPaletteEntries (element) {
    const {
      create,
      elementFactory,
      translate,
      handTool,
      globalConnect
    } = this

    function createAction (type, group, className, title, options) {
      function createListener (event) {
        var shape = elementFactory.createShape(assign({ type: type }, options))
        if (options) {
          shape.businessObject.di.isExpanded = options.isExpanded
        }
        create.start(event, shape)
      }
      var shortType = type.replace(/^bpmn:/, '')
      return {
        group: group,
        className: className,
        title: title || translate('Create {type}', { type: shortType }),
        action: {
          dragstart: createListener,
          click: createListener
        }
      }
    }

    return {
      'hand-tool': {
        group: 'tools',
        className: 'icon-custom icon-custom-hand-tool',
        title: translate('拖拽画布'),
        action: {
          click: function (event) {
            handTool.activateHand(event)
          }
        }
      },
      'global-connect-tool': {
        group: 'tools',
        className: 'icon-custom icon-custom-connect-tool',
        title: translate('关联'),
        action: {
          click: function (event) {
            globalConnect.toggle(event)
          }
        }
      },
      // 开始事件
      'create.start-event': createAction(
        'bpmn:StartEvent', 'event', 'icon-custom icon-custom-start-event-none',
        translate('创建开始事件')
      ),
      // 中间/边界事件
      'create.intermediate-event': createAction(
        'bpmn:IntermediateThrowEvent', 'event', 'icon-custom icon-custom-intermediate-event-none',
        translate('创建中间/边界事件')
      ),
      // 结束事件
      'create.end-event': createAction(
        'bpmn:EndEvent', 'event', 'icon-custom icon-custom-end-event-none',
        translate('创建结束事件')
      ),
      // 创建网关
      'create.exclusive-gateway': createAction(
        'bpmn:ExclusiveGateway', 'gateway', 'icon-custom icon-custom-gateway-none',
        translate('创建网关')
      ),
      // 用户任务
      'create.UserTask': createAction(
        'bpmn:UserTask', 'activity', 'icon-custom icon-custom-user-task',
        translate('创建用户任务')
      ),
      // 服务任务
      'create.ServiceTask': createAction(
        'bpmn:ServiceTask', 'activity', 'icon-custom icon-custom-service-task',
        translate('创建服务任务')
      ),
      // 脚本任务
      'create.ScriptTask': createAction(
        'bpmn:ScriptTask', 'activity', 'icon-custom icon-custom-script-task',
        translate('创建脚本任务')
      ),
      'create.subprocess-expanded': createAction(
        'bpmn:SubProcess', 'activity', 'icon-custom icon-custom-subprocess-expanded',
        translate('创建子流程'),
        { isExpanded: true }
      )
    }
  }
}

CustomPalette.$inject = [
  'create',
  'elementFactory',
  'palette',
  'translate',
  'handTool',
  'globalConnect'
]
