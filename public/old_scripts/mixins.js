export function starts(o) {
	if (!this.start_set) {
		this.start_set = [o];
	} else {
		this.start_set.push(o);
	}
	return this;
}

export function stops(o) {
	if (!this.stop_set) {
		this.stop_set = [o];
	} else {
		this.stop_set.push(o);
	}
	return this;
}

export function run_stop_set() {
	if ('stop_set' in this) {
		this.stop_set.forEach(o => o.stop());
	}
}

export function run_start_set() {
	if ('start_set' in this) {
		this.start_set.forEach(o => {
			if (typeof(o) === 'string') {
				this.room.goto(o);
			} else {
				o.start();
			}
		});
	}
}
