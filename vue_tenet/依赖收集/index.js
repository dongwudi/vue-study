//依赖收集 --> Vue能够实现当一个数据变更时，视图就进行刷新，而且用到这个数据的其他地方也会同步变更；而且，这个数据必须是在有被依赖的情况下，视图和其他用到数据的地方才会变更。所以，Vue要能够知道一个数据是否被使用，实现这种机制的技术叫做依赖收集
// 1.如何知道渲染用到了哪些数据 --> getter 时进行收集处理
// 2. 变更数据如何通知render --> setter 时进行拦截处理

// 依赖的数据是观察目标
// 视图、计算属性、侦听器这些是观察者

class Dep {
	constructor() {
		this.subs = [];
	}

	addSub(sub) {
		this.subs.push(sub);
	}

	notify() {
		const subs = this.subs.slice();
		for (let i = 0, l = subs.length; i < l; i++) {
			subs[i].update();
		}
	}
}

class Watcher {
	constructor() {
		Dep.target = this;
	}

	update() {
		console.log("1");
	}
}

function Observe(data, callback) {
	Object.keys(data).forEach(key => defineFn(data, key, data[key], callback));
}

function defineFn(data, key, value, callback) {
	let dep = new Dep(); //每个数据都生成一个观察目标实例收集依赖此数据的观察者
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: false,
		get: () => {
			if (Dep.target) {
				dep.addSub(Dep.target);
			}
			return value;
		},
		set: newV => {
			value = newV;
			dep.notify();
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
		new Watcher(this);
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
vm.name = "test change"; //update => 1
