const config = require( './resource/config' );
const express = require( 'express' );
const app = express();
const path = require( 'path' );

// post 파서모듈
const bodyParser = require( 'body-parser' );

// DATABASE 메니저
const dbManager = require( './resource/dbManager' );
const DB = new dbManager( config.dbUrl );

// USER 메니저
const userManager = require( './resource/userManager' );
const user = new userManager( DB );
const todoManager = require( './resource/todoManager' );
const todo = new todoManager( DB );

// id정보
const userInfo = { id : '' };

// 프로세스 종료 시
process.on( 'SIGTERM', function () {
	console.log( "프로세스가 종료됩니다." );
	app.close();
} );

// 서버 종료 시
app.on( 'close', function () {
	console.log( "Express 서버 객체가 종료됩니다." );
} );

/*
* Static 미들웨어
* */

app.use( express.static( __dirname + '/main' ) );

/*
* POST 파서 등록
* */
app.use( bodyParser.urlencoded( { extended : true } ) );

/*
* Route 미들웨어
* */
const router = express.Router();

let message = ( err, data, cat ) => {
	let html = '';
	if ( err ) {
		html += '사용자 ' + cat + '에 실패하였습니다.';
	} else {
		html += data.id + '사용자 ' + cat + ' 완료';
		html += '<br>사용자 ID : ' + data.id;
		html += '<br>Password : ' + data.password;
	}
	html += '<br><a href="/adduser.html">사용자 등록</a>';
	html += '<br><a href="/index.html">로그인</a>';
	return html;
};

// 사용자 추가
router.post( '/addUser', ( req, res, next ) => {
	let id = req.body.id;
	let password = req.body.password;
	user.addUser( { id : id, password : password }, ( err, data ) => {
		res.send( message( err, data, '추가' ) );
		next();
	} );
} );

// 로그인
router.post( '/login', ( req, res, next ) => {
	let id = req.body.id;
	let password = req.body.password;
	user.login( { id : id, password : password }, ( err, data ) => {
		let success = true;
		if ( err ) {
			success = false;
		}
		userInfo.id = id;
		res.send( { success : success, data : data } );
		next();
	} );
} );

// todo항목 추가
router.post( '/todoAdd', ( req, res, next ) => {
	let content = req.body.content;
	let status = req.body.status;
	let paramObj = { id : userInfo.id, content : content, status : status };
	todo.add( paramObj, ( err, data ) => {
		let success = true;
		if ( err ) {
			success = false;
		}
		res.send( { success : success } );
		next();
	} );
} );

// todo항목 조회
router.post( '/todoSelectList', ( req, res, next ) => {
	let status = req.body.status;
	let paramObj = { id : userInfo.id, status : status };
	todo.select( paramObj, ( err, data ) => {
		let success = true;
		if ( err ) {
			success = false;
		}
		res.send( { success : success, data : data } );
		next();
	} );
} );

// todo항목 delete
router.post( '/todoDeleteOne', ( req, res, next ) => {
	let _id = req.body._id;
	let status = req.body.status;
	todo.delete( { _id : _id, id : userInfo.id }, ( err, data ) => {
		let success = true;
		if ( err ) {
			success = false;
		}
		res.send( { success : success } );
		next();
	} );
} );

// todo항목 update
router.post( '/todoUpdate', ( req, res, next ) => {
	let _id = req.body._id;
	let status = req.body.status;
	todo.update( { _id : _id, status : status, id : userInfo.id }, ( err, data ) => {
		let success = true;
		if ( err ) {
			success = false;
		}
		res.send( { success : success } );
		next();
	} );
} );

app.use( '/', router );

/*
* 서비스 시작
* */
app.listen( config.port, () => {
	console.log( 'Server start : %d', config.port );

	// 데이터베이스 연결
	DB.connect();
} );