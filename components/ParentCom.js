import ChildCom from './ChildCom';
export default {
  name: 'parent',
  template: `<div>
    父级组件
    <childCom />
  </div>`,
  methods: {

  },
  components:{
    ChildCom
  }
}