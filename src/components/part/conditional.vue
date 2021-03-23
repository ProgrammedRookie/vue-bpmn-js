<template>
  <div>
    <div class="dialog-sytle">
      <el-dialog title="编辑判断条件" top="5vh" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="tag-content">
          <el-button @click="handleClick(item.id)"  size="small" v-for="item in filedList" :key="item.id">{{item.name}}</el-button>
      </div>
      <div class="textarea-class">
        <el-input type="textarea" :rows="4" v-model="value" placeholder="请输入判断条件"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSaveConditional">确 定</el-button>
      </div>
    </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      value: '',
      filedList: [
        {
          id: 1,
          name: '姓名'
        },
        {
          id: 2,
          name: '性别'
        }
      ]
    }
  },
  props: {
    medeling: {
      type: Object,
      default: () => {
        return null
      }
    },
    element: {
      type: Object,
      default: () => {
        return null
      }
    },
    val: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  methods: {
    // 关闭
    handleClose () {
      this.dialogVisible = false
      this.value = ''
    },
    handleClick (val) {
      this.value = '${' + val + '}'
    },
    handleSaveConditional () {
      console.log('e', this.element)
      const elementRegistry = this.medeling.get('elementRegistry')
      const sequenceFlowElement = elementRegistry.get(this.element.id)
      const moddle = this.medeling.get('moddle')
      let newCondition = moddle.create('bpmn:FormalExpression', {
        body: this.value
      })
      const modeling = this.medeling.get('modeling')
      modeling.updateProperties(sequenceFlowElement, {
        conditionExpression: newCondition
      })
      this.handleClose()
    },
    init () {
      if (this.val !== '') {
        this.value = this.val
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
.el-dialog__title {
    line-height: 24px;
    font-size: 16px;
    color: #303133;
}
.el-dialog__body {
    padding: 20px 30px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
}
.tag-content{
  display: flex;
  margin: 20 0px;
}
.tag-class{
  margin-right: 10px;
}
.textarea-class{
  margin-top: 20px;
}

</style>
