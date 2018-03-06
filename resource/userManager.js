let userManager = class {

	constructor( db ) {
		this.db = db;
	}

	// 사용자 추가 메서드
	addUser( data, callback ) {

		let _this = this;
		let user = new _this.db.model.user( data );
		user.save( function ( err ) {
			if ( err ) {
				console.log( err );
				callback( err, null );
				return;
			}
			let res = {
				id       : data.id,
				password : data.password
			};
			callback( err, res );
			console.log( data.id + '사용자 추가' );
		} );

	};

	// 로그인 메서드
	login( data, callback ) {

		let _this = this;
		_this.db.model.user
			.findById( data.id, function ( err, results ) {
				if ( err ) {
					callback( err, null );
					return;
				}
				let user = results[ 0 ];
				// 사용자 정보 조회
				if ( user === undefined ) {
					callback( true );
					console.log( data.id + '사용자 로그인 실패' );
					return;
				}
				// 아이디, 패스워드 일치여부 확인
				if ( user.password === data.password ) {
					let res = {
						id       : data.id,
						password : data.password
					};
					callback( err, res );
					console.log( data.id + '사용자 로그인' );
				} else {
					callback( true );
					console.log( data.id + '사용자 로그인 실패' );
				}
			} );

	};
};

module.exports = userManager;