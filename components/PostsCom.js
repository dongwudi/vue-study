export default {
  data () {
    return {
      contents: [
        {h3:'this is one',cont: 'this is con1'},
        {h3:'this is two',cont: 'this is con2'},
        {h3:'this is thr',cont: 'this is con3'}
      ],
      num: 0
    }
  },
  methods : {
    change (num) {
      this.num = num;
    }
  },
  template: `
    <div>
      <ul>
        <li @click="change(0)">cat ipsum</li>
        <li @click="change(1)">hipster</li>
        <li @click="change(2)">cucat</li>
      </ul>
      <div>
        <h3>{{contents[num].h3}}</h3>
        <div>{{contents[num].cont}}</div>
      </div>
    </div>
  `
}