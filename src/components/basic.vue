<template>
  <div>
    <div class="btns">
      <el-button-group>
        <el-button size="mini" @click="save">保存</el-button>
        <el-button size="mini">放大</el-button>
        <el-button size="mini">缩小</el-button>
      </el-button-group>
    </div>
    <div class="containers" ref="content">
      <div class="containers-canvas">
        <div class="canvas" ref="canvas"></div>
      </div>
      <div class="containers-panel">
         <div id="js-properties-panel" class="panel"></div>
      </div>
    </div>
    <conditional ref="conditional" :medeling="bpmnModeler" :element="element" :val="val"></conditional>
    <change-task-user ref="taskUser" :medeling="bpmnModeler" :element="element" :assignee="defaultTrees"></change-task-user>
  </div>
</template>

<script>
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import customTranslate from './customTranslate/customTranslate'
import templateXml from '../mock/template'
import activitiModdle from './data/activiti.json'
import costomRenderer from './costomRenderer'
import costomPalettle from './costomPalettle'
import conditional from './part/conditional'
import changeTaskUser from './part/changeTaskUser'
export default {
  name: 'basic',
  data () {
    return {
      bpmnModeler: null,
      container: null,
      canvas: null,
      initTemplate: '',
      initData: null,
      element: null,
      conditionFlag: false,
      defaultTrees: [],
      val: ''
    }
  },
  components: {
    conditional,
    changeTaskUser
  },
  methods: {
    init () {
      let customTranslateModule = {
        translate: [ 'value', customTranslate ]
      }
      this.container = this.$refs.content
      const canvas = this.$refs.canvas
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          // 左边工具栏以及节点
          propertiesProviderModule,
          // 右边的工具栏
          propertiesPanelModule,
          customTranslateModule,
          costomRenderer,
          costomPalettle,
          BpmnModeler, {
            zoomScroll: ['value', '']
          }
        ],
        moddleExtensions: {
          activiti: activitiModdle
        }
      })
      this.createNewDiagram()
    },
    createNewDiagram () {
      //  todo 请求后台bpmn 文件 ,需要一个跟节点
      let xml = this.initTemplate
      this.bpmnModeler.importXML(xml, (err) => {
        if (err) {
          console.info(err)
        } else {
          this.successBpmn()
        }
      })
    },
    successBpmn () {
      const minDao = require('min-dom')
      const container = this.bpmnModeler.get('propertiesPanel')._container
      minDao.delegate.bind(container, 'input', 'click', (e) => {
        this.handleChange(e)
      })
      this.addModelerListener()
    },
    handleChange (e) {
      // 用户任务
      if (e.delegateTarget.id === 'camunda-assignee') {
        const propertiesPanel = this.bpmnModeler.get('propertiesPanel')
        const entries = propertiesPanel._current.groups.details.entries
        if (typeof entries !== 'undefined') {
          entries.map(res => {
            this.defaultTrees = res.oldValues['assignee'].split(',')
          })
        }
        this.$refs.taskUser.flag = true
      }
      // 条件表达式
      if (e.delegateTarget.id === 'cam-condition') {
        const propertiesPanel = this.bpmnModeler.get('propertiesPanel')
        const entries = propertiesPanel._current.groups.details.entries
        if (typeof entries !== 'undefined') {
          entries.map(res => {
            this.val = res.oldValues['condition'] !== '' ? res.oldValues['condition'] : ''
          })
        }
        this.$refs.conditional.dialogVisible = true
      }
    },
    addModelerListener () {
      const eventBus = this.bpmnModeler.get('eventBus')
      const eventTypes = ['element.click', 'element.changed', 'element.updateLabel']
      eventTypes.forEach((eventType) => {
        eventBus.on(eventType, (e) => {
          if (!e || e.element.type === 'bpmn:Process') return
          if (eventType === 'element.changed') {
            this.element = e.element
          } else if (eventType === 'element.click') {
            this.element = e.element
          } else if (eventType === 'element.updateLabel') {
          }
        })
      })
    },
    save () {
      this.bpmnModeler.saveXML({format: true}, (err, data) => {
        if (err) {
          console.log(err)
        } else {
          // 请求后台保存接口
          console.info(data)
        }
      })
    }
  },
  mounted () {
    let processId = new Date().getTime()
    this.initTemplate = templateXml.initTemplate(processId)
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btns{
    width: 20%;
    height: 32px;
    z-index: 2000;
    position: absolute;
    margin: 10px;
  }
  .containers{
    position: absolute;
    background-color: #f0f0f0ad;
    overflow: hidden;
    width: 99%;
    height: 100%;
  }
  .containers-canvas{
    width: 77%;
    background-color: #fff;
    height: 100%;
  }
  .containers-panel{
    height: 100%;
    margin: 0 auto;
  }
  .canvas{
    width: 100%;
    height: 100%;
  }
  .panel{
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
  }
</style>
