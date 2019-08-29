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

//通过代理 将data上的属性 代理到vm上
function _proxy(data) {
	const that = this;
	Object.keys(data).forEach(key => {
		Object.defineProperty(that, key, {
			configurable: false,
			enumerable: true,
			get: function proxyGetter() {
				return that._data[key];
			},
			set: function proxySetter(val) {
				that._data[key] = val;
			}
		});
	});
}

class Vue {
	constructor(options) {
		this._data = options.data;
		Observe(this._data, options.render);
		_proxy.call(this, options.data);
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

console.log(vm.name);
vm.name = "test change"; // 同步打印callback 'render'
console.log(vm.name);
