import { get_room } from './rooms';

function c_goto(room, next_room_name) {
	this.room           = room;
	this.next_room_name = next_room_name;
	this.block_goto     = false;
	this.fail_set       = [];
	this.next_room      = null;
}

c_goto.prototype.fails = function(o) {
	this.fail_set.push(o);
	return this;
};

c_goto.prototype.start = function() {
	this.room.insert_updatable(this);
	get_room(this.next_room_name)
	.then(room => { 
		this.next_room = room;
	})
	.catch(_ => {
		this.room.remove_updatable(this);
		this.fail_set.forEach(o => o.start());
	})
};

c_goto.prototype.update = function() {
	if (this.next_room !== null && this.room.updatables.every(o => !o.block_goto)) {
		this.room.stop();
		this.next_room.start();
	}
};
