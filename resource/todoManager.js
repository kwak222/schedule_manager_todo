// todo 목록추가, 목록조회, 목록삭제, 목록수정
let todo = class {

	constructor( db ) {
		this.db = db;
	}

	//목록추가
	add( data, callback ){
		let _this = this;
		let todo = new _this.db.model.todo( data );
		todo.save( function ( err ) {
			if ( err ) {
				callback( err, null );
				return;
			}
			let res = {
				id       : data.id,
				content : data.content,
				status : data.status
			};
			callback( err, res );
			console.log( data.id + ' todo 추가' );
		} );
	}
	// 목록조회
	select( data, callback ) {
		let _this = this;
		let todo = this.db.model.todo
			.findById( data, function(err, results) {
				if(results === undefined) results = [];
				callback( err, results );
			} );
	}
	// 목록삭제
	delete( data, callback ) {
		let _this = this;
		let todo = _this.db.model.todo.deleteOne(data,function(err) {
			if( err ) {
				callback( err, null );
				return;
			}
			callback( err );
			console.log( data.id + ' todo 삭제' );
		});
	}
	// 목록상태 변경
	update(data, callback) {
		let _this = this;
		let todo = _this.db.model.todo.updateOne({_id:data._id, id:data.id},{$set:{status:data.status}},function(err, result) {
			if( err ) {
				callback( err, null );
				return;
			}
			callback( err );
			console.log( data.id + ' todo 완료' );
		});
	}
};

module.exports = todo;
