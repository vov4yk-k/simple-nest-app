import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';

export type EnvConfig = Record<string, string>;

export class ConfigService {

  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {

    const fileConfig = fs.existsSync(filePath) ? dotenv.parse(fs.readFileSync(filePath)) : {};

    this.envConfig = this.validateInput({
      ...fileConfig,
      ...process.env,
    });
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {

    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      MONGO_URL: Joi.string().required(),
      ACCESS_TOKEN_SECRET: Joi.string().required(),
      ACCESS_TOKEN_LIVE: Joi.string().empty(['', null]).default('3600s'),
      API_PORT: Joi.string().empty(['', null]).default(3000),
      API_STAGE: Joi.string().valid('dev', 'prod').default('dev'),
    }).unknown();

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );


    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;

  }

  get(key: string): string {
    return this.envConfig[key];
  }

  isDev() {
    return this.get('API_STAGE') === 'dev';
  }

  getMongoConfig(): any {
    return {
      uri: this.get('MONGO_URL'),
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };
  }

}
