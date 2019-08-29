(function() {
	const MVVM = function(options) {
		this.$data = options.data;
		this.$el = options.el;

		//代理
		this._proxy(options.data);
		this._proxy(options.methods);

		const watcher = new Watcher(this);

		//观察目标
		let ob = observer(this.$data);
		if (!ob) {
			return;
		}
		compile(options.el, this);
	};

	//代理到vm上
	MVVM.prototype._proxy = function(data) {
		let self = this;
		Object.keys(data).forEach(key => {
			Object.defineProperty(self, key, {
				enumerable: true,
				configurable: false,
				get: () => {
					return self.$data[key];
				},
				set: newValue => {
					self.$data[key] = newValue;
				}
			});
		});
	};
	function isObject(obj) {
		return obj !== null && typeof obj === "object";
	}
	function isPlainObject(obj) {
		return Object.prototype.toString(obj) === "[object Object]";
	}
	function observer(data) {
		//不是对象
		if (!isObject(data) || !isPlainObject(data)) {
			return;
		}

		return new Observer(data);
	}
	function Observer(data) {
		this.data = data;

		this.transform(data);
	}
	Observer.prototype.transform = function(data) {
		Object.keys(data).forEach(key => {
			this.defineReactive(data, key, data[key]);
		});
	};
	Observer.prototype.defineReactive = function(data, key, value) {
		let dep = new Dep();
		Object.defineProperty(data, key, {
			enumerable: true,
			configurable: false,
			get: () => {
				if (Dep.target) {
					dep.addSub(Dep.target);
				}
				return value;
			},
			set: newValue => {
				if (newValue == value) {
					return;
				}
				value = newValue;
				dep.notify();
			}
		});
	};

	//
	var Dep = function() {
		this.subs = [];
	};
	Dep.prototype.addSub = function(sub) {
		this.subs.push(sub);
	};
	//通知
	Dep.prototype.notify = function() {
		this.subs.forEach(sub => sub.update());
	};

	Dep.target = null;

	var Watcher = function() {
		Dep.target = this;
	};

	Watcher.prototype = {
		update: function() {
      console.log("update");
      compile(vm.$el, vm)
		}
	};

	function compile(el, _this) {
		console.log(_this.$data);

		document.getElementById(el).innerHTML = _this.$data.message;
	}

	window.MVVM = MVVM;
})();
