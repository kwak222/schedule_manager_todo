const config = require( './resource/config' );
const express = require( 'express' );
const app = express();

// post 파서모듈
const bodyParser = require( 'body-parser' );

// DATABASE 메니저
const dbManager = require( './resource/dbManager' );
const DB = new dbManager( config.dbUrl );

// USER 메니저
const userManager = require( './resource/userManager' );
const user = new userManager( DB );

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
	html += '<br><a href="/index.html">사용자 등록</a>';
	html += '<br><a href="/index.html">로그인</a>';
	return html;
};

router.post( '/addUser', ( req, res, next ) => {
	let id = req.body.id;
	let password = req.body.password;
	user.addUser( { id : id, password : password }, ( err, data ) => {
		res.send( message( err, data, '추가' ) );
		next();
	} );
} );

router.post( '/login', ( req, res, next ) => {
	let id = req.body.id;
	let password = req.body.password;
	user.login( { id : id, password : password }, ( err, data ) => {
		res.send( message( err, data, '로그인' ) );
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

/*
const http = require('http');
http.createServer((request, response) => {
	response.write("Hello, this is dog.");
}).listen(3000);

console.log('Listening on port 3000...');
*/
