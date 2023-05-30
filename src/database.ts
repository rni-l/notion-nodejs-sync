import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Data } from './data/data.entity';
import { DataConfig } from './data/data-config.entity';

export default SequelizeModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    return {
      dialect: 'postgres',
      host: configService.get('PG_HOST'),
      port: +configService.get('PG_PORT'),
      username: configService.get('PG_USERNAME'),
      password: configService.get('PG_PASSWORD'),
      database: configService.get('PG_DATABASE'),
      define: {
        timestamps: false,
      },
      models: [Data, DataConfig],
      autoLoadModels: true,
      synchronize: true,
      logging: configService.get('MODE') === 'development',
    };
  },
  inject: [ConfigService],
});
