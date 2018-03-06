const mongoose = require( 'mongoose' );
const autoIncrement = require( 'mongoose-easy-auto-increment' );

let dbManager = class {

	constructor( url ) {
		this.database = null;
		this.schema = {};
		this.model = {};
		this.dbUrl = url;
	}

	// DB 접속 메서드
	connect() {

		let _this = this;
		mongoose.Promise = global.Promise;
		mongoose.connect( _this.dbUrl );
		_this.database = mongoose.connection;
		_this.database.on( 'error', console.error.bind( console, 'mongoose connection error.' ) );
		_this.database.on( 'open', function () {
			console.log( 'Database 에 연결되었습니다. : ' + _this.dbUrl );
			_this.createUserScheme();
			_this.createTodoScheme();
		} );

	}

	// User 모델 생성
	createUserScheme() {

		let _this = this;
		_this.schema.user = mongoose.Schema( {
			id       : { type : String, required : true, unique : true, 'default' : '' },
			password : { type : String, required : true, 'default' : '' }
		} );

		// 자동증가 플러그인. 자동증가로 num 칼럼 추가
		_this.schema.user.plugin( autoIncrement, { field : 'num' } ); //기존에 필드로 지정되있지 않는 값만 선언 가능

		// 스키마에 static 으로 findById 메소드 추가
		_this.schema.user
			.static( 'findById', function ( id, callback ) {
				return this.find( { id : id }, callback );
			} );

		console.log( 'schema.user 정의함.' );

		// Users 모델 정의
		try {
			// moder == 'user' 데이터베이스 // 이미 등록되있는 스키마는 에러발생
			_this.model.user = mongoose.model( "users", _this.schema.user );
		} catch ( error ) {
			// users라는 컬렉션을 등록
			_this.model.user = mongoose.model( "users" );
		}
		console.log( 'users 정의함.' );

	}

	// todo목록 스키마 생성
	createTodoScheme() {
		let _this = this;
		_this.schema.todo = mongoose.Schema( {
			id         : { type : String, required : true, 'default' : '' },
			contentKey : mongoose.Schema.Types.ObjectId,
			// sortOrd    : { type : String, required : true, 'default' : '' },
			content    : { type : String, required : true, 'default' : '' },
			status     : { type : String, required : true, 'default' : '' },
			date       : { type : Date, required : true, default: Date.now }
		} );

		// 자동증가 플러그인. 자동증가로 num 칼럼 추가
		_this.schema.todo.plugin( autoIncrement, { field : 'num' } ); //기존에 필드로 지정되있지 않는 값만 선언 가능

		// 스키마에 static 으로 findById 메소드 추가
		_this.schema.todo
			.static( 'findById', function ( data, callback ) {
				return this.find( { id : data.id, status: data.status }, callback );
			} );

		console.log( 'schema.todo 정의함.' );

		// todo목록 모델 정의
		try {
			// moder == 'todo_' 데이터베이스 // 이미 등록되있는 스키마는 에러발생
			_this.model.todo = mongoose.model( "todo", _this.schema.todo );
		} catch ( error ) {
			_this.model.todo = mongoose.model( "todo" );
		}
		console.log( 'todo 정의함.' );

	}

};

module.exports = dbManager;