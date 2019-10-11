function Mvue(options) {
	this.$options = options || {}
	let data = (this.$data = options.data)
	let vm = this

	//代理 data上属性代理到vm实例上
	_proxy(data, vm)

	//observe data
	//监测数据变化
	_observe(data, vm)

	//订阅 message
	new Watcher(vm, 'message')
}

function _proxy(data, target) {
	let vm = target
	Object.keys(data).forEach(key => {
		Object.defineProperty(vm, key, {
			enumerable: true,
			configurable: false,
			get: function() {
				return vm.$data[key]
			},
			set: function(newVal) {
				vm.$data[key] = newVal
			}
		})
	})
}

// -----------------observe ------------------------

function _observe(data, vm) {
	if (!data || typeof data !== 'object') {
		return
	}
	return new Observer(data)
}

function Observer(data) {
	this.data = data
	this.walk(data)
}

Observer.prototype.walk = function(data) {
	const keys = Object.keys(data)
	for (let i = 0; i < keys.length; i++) {
		let key = keys[i]
		this.defineReactive(data, key, data[key])
	}
}

Observer.prototype.defineReactive = function(data, key, val) {
	//收集订阅者
	let dep = new Dep()

	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: false,
		get: function() {
			// 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
			if (Dep.target) {
				//通过depend方法转到watcher中进行添加，防止重复
				dep.depend()
			}
			return val
		},
		set: function(newVal) {
			val = newVal
			dep.notify()
		}
	})
}

// -----------------observe ------------------------

// ----------------- Dep ------------------------
let uid = 0
function Dep() {
	this.subs = []
	this.uid = uid++
}

Dep.prototype.addSub = function(watcher) {
	this.subs.push(watcher)
}

Dep.prototype.notify = function() {
	this.subs.forEach(watcher => {
		watcher.update()
	})
}

Dep.prototype.depend = function() {
	Dep.target.addDep(this)
}

Dep.target = null

// ----------------- Dep ------------------------

// ----------------- Watcher ------------------------
function Watcher(vm, datakey) {
	this.vm = vm
	this.depIds = {}
	this.datakey = datakey

	//触发 监听数据的get方法, 触发Dep 将自身收集
	this.vaule = this.get()
}

Watcher.prototype.get = function() {
	let datakey = this.datakey
	Dep.target = this
	let value = this.vm.$data[datakey]
	Dep.target = null
	return value
}

Watcher.prototype.addDep = function(dep) {
  //防止重复添加
	if (!this.depIds.hasOwnProperty(dep.uid)) {
		dep.addSub(this)
		this.depIds[dep.uid] = dep
	}
}

Watcher.prototype.update = function() {
	let datakey = this.datakey
	let value = this.get()
	let oldVal = this.value
	if (value !== oldVal) {
		this.value = value
	}
	console.log(`this is ${datakey} : ${this.value}`)
}

// ----------------- Watcher ------------------------
