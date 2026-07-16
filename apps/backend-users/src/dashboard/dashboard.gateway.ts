import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

@WebSocketGateway()
export class DashboardGateway {
	@SubscribeMessage('message')
	handleMessage(_client: unknown, _payload: unknown): string {
		return 'Hello world!'
	}
}
