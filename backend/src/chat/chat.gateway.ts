import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(81, {
  namespace: 'chattings',
  cors: {
    origin: '*',
  },
}) // namespace 프론트에서 받을 주소(엔드포인트 느낌)(controller와 유사)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server;

  wsClients = [];

  private logger = new Logger('chat');

  // 가장 먼저 실행 1
  constructor() {
    this.logger.log('constructor');
  }

  // 연결이 되는 순간 실행 3
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connect:  ${socket.id} ${socket.nsp.name}`);
  } // 커넥션 후 이벤트 발생

  // 초기화 후 바로 실행(constructor 후 바로 실행) 2
  // afterInit(server: any) {
  //   this.logger.log('init');
  // }

  // 연결이 중단되면 실행
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnect:  ${socket.id} ${socket.nsp.name}`);
  }

  @SubscribeMessage('new_user') // 프론트에서 호출할 함수이름
  // 아무 함수이름 사용(컨트롤러 역할)
  // @MessageBody()  데코레이터 사용해서 받을 데이터 값 선언
  // @ConnectedSocket(): 소 켓을 받는 데코레이터(emit,on를 사용가능하게 해줌)
  // 새로운 사용자가 들어온 경우 사용할 함수
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(socket.id); //console.log(socket.id);  연결이 차단되기 전까지는 같은 아이디 사용
    console.log(username);
    socket.emit('hello_user', 'hello' + username);
    // username db에 저장
    // 프로젝트와 이메일로 중복저장 방지

    // 브로드캐스팅 사용(모든 소켓에 공유)
    // 다른 사용자에게도 알려줄 수 있음
    socket.broadcast.emit('user_connected', username);
    return username;
    //return 'hello word';
  }

  @SubscribeMessage('submit_chat')
  handleSubmitChat(@MessageBody() data: string, @ConnectedSocket() client) {
    const [room, nickname, message] = data;
    // 대화내용 저장

    // 브로드캐스팅을 이용해 연결된 모든 소켓에 전달
    this.server.emit(room, [nickname, message]);
    this.wsClients.push(client);
    //return username;
  }

  @SubscribeMessage('ㅋㅋㅋ')
  connectSomeone(@MessageBody() data: string, @ConnectedSocket() client) {
    const [nickname, room] = data;
    console.log(`${nickname}님이 코드: ${room}방에 접속했습니다.`);
    const comeOn = `${nickname}님이 입장했습니다.`;
    this.server.emit('comeOn' + room, comeOn);
    this.wsClients.push(client);
  }
}
