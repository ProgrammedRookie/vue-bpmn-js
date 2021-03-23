<template>
  <div>
     <el-dialog
      :visible.sync="flag"
      title="配置任务执行者"
      width="50%"
      :before-close="handleClose"
      top="1%"
      >
      <div class="dialog-sytle">
        <el-card>
          <div slot="header">
            <span>已选执行名单</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="handleEmpty">清空</el-button>
          </div>
          <div class="content-tag">
             <el-tag class="content-tag-style" type="success" v-for="item in handleData" :key="item.id" size="mini"> {{item.id}} - {{item.label}} </el-tag>
          </div>
        </el-card>
        <div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="固定执行者" name="user">
              <div style="padding:10px">
                <el-input size="mini" placeholder="请输入名称或者编号模糊查询" @click="handleSelectList"></el-input>
              </div>
              <el-tree :data="treeData" :default-checked-keys="assignee" @check-change="handleNodeClick" show-checkbox node-key="id" ref="tree" :props="defaultProps"></el-tree>
            </el-tab-pane>
            <el-tab-pane label="动态执行者" name="group">动态执行者</el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSaveAssignee">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      flag: false,
      activeName: 'user',
      handleData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [
        {
          id: '2',
          label: '研发部',
          disabled: true,
          children: [
            {
              id: '2',
              label: '张三'
            },
            {
              id: '3',
              label: '李四'
            }
          ]
        }
      ]
    }
  },
  props: {
    medeling: {
      type: Object,
      defaul: () => {
        return null
      }
    },
    element: {
      type: Object,
      default: () => {
        return null
      }
    },
    assignee: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // todo 请求后台获取用户列表
      if (this.assignee.length > 0) {
        this.assignee.map(res => {
          this.handleData.push({
            id: res,
            name: ''
          })
        })
      }
    },
    // 清空已选名单
    handleEmpty () {
      this.$refs.tree.setCheckedKeys([])
      this.handleData = []
    },
    handleNodeClick (data, checked, indeterminate) {
      if (checked && typeof data.children === 'undefined') {
        this.handleData.push(data)
      } else {
        this.handleData = this.handleData.filter(res => {
          return res.id !== data.id
        })
      }
    },
    handleClose () {
      this.flag = false
      this.$refs.tree.setCheckedKeys([])
      this.handleData = []
    },
    handleSaveAssignee (event) {
      let properties = {}
      properties['assignee'] = this.handleData.map(res => {
        return res.id
      }).join(',')
      const medeling = this.medeling.get('modeling')
      medeling.updateProperties(this.element, properties)
      this.handleClose()
    },
    handleSelectList () {

    }
  }
}
</script>

<style>
.dialog-sytle{
    height: 100vh;
    font-size: 12px;
  }
  .content-tag{
    display: flex;
  }
  .content-tag-style {
    margin-right: 5px
  }
</style>
