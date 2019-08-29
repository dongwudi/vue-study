function Observe(data, callback) {
	Object.keys(data).forEach(key => defineFn(data, key, data[key], callback));
}

function defineFn(data, key, value, callback) {
  //
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: false,
		get: () => {
			return value;
		},
		set: newV => {
      value = newV;
      //订阅者收到消息的回调
			callback();
		}
	});
}

class Vue {
	constructor(options) {
		this._data = options.data;

		Observe(this._data, options.render);
	}
}

let vm = new Vue({
	data: {
		name: "test"
	},
	render() {
		console.log("render");
	}
});

console.log(vm._data.name)
vm._data.name = 'test change'; // 同步打印callback 'render'
console.log(vm._data.name)
