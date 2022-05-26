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
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chattings',
  cors: {
    origin: 'http://localhost:5501',
  },
}) // namespace 프론트에서 받을 주소(엔드포인트 느낌)(controller와 유사)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  wsClients = [];

  // private logger = new Logger('chat');

  // // 가장 먼저 실행 1
  // constructor() {
  //   this.logger.log('constructor');
  // }

  // // 연결이 되는 순간 실행 3
  // handleConnection(@ConnectedSocket() socket: Socket) {
  //   this.logger.log(`connect:  ${socket.id} ${socket.nsp.name}`);
  // } // 커넥션 후 이벤트 발생

  // // 초기화 후 바로 실행(constructor 후 바로 실행) 2
  // // afterInit(server: any) {
  // //   this.logger.log('init');
  // // }

  // // 연결이 중단되면 실행
  // handleDisconnect(@ConnectedSocket() socket: Socket) {
  //   this.logger.log(`disconnect:  ${socket.id} ${socket.nsp.name}`);
  // }

  @SubscribeMessage('join')
  connectSomeone(@MessageBody() data: string, @ConnectedSocket() client) {
    const [nickname, room] = data;
    // client.join(room);
    // console.log(`${nickname}님이 코드: ${room}방에 접속했습니다.`);
    const comeOn = `${nickname}님이 입장했습니다.`;
    this.server.emit('comeOn' + room, comeOn);
    this.wsClients.push(client);
  }

  private broadcast(event, client, message: any) {
    for (const c of this.wsClients) {
      if (client.id == c.id) continue;
      c.emit(event, message);
    }
  }

  @SubscribeMessage('submit_chat')
  handleSubmitChat(@MessageBody() data: string, @ConnectedSocket() client) {
    const [room, nickname, message] = data;
    // 대화내용 저장
    console.log(message);
    // 브로드캐스팅을 이용해 연결된 모든 소켓에 전달
    this.broadcast(room, client, [nickname, message]);
    // this.wsClients.push(client);
  }
}
