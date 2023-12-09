import { ConfigService } from '@nestjs/config';
import { Update, Start, Ctx, On, Message } from 'nestjs-telegraf';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';
import { Telegraf, Scenes } from 'telegraf';

interface Context extends Scenes.SceneContext {}

@Update()
export class TelegramService extends Telegraf<Context> {
  constructor(
    private readonly configService: ConfigService,
    private readonly gpt: ChatgptService,
  ) {
    super(configService.get('TELEGRAM_API'));
  }

  @Start()
  onStart(@Ctx() ctx: Context) {
    ctx.replyWithHTML(`<b>Привет, ${ctx.from.username}</b>
Это чат бот с CHATGPT!
Введите Ваш запрос!
    `);
  }

  @On('text')
  onMessage(@Message('text') message: string) {
    return this.gpt.generateResponse(message);
  }
}
