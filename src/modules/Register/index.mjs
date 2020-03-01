
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";
import { request } from "../";


export class RegisterProcessor extends PrismaProcessor {


  async sberbankRegister(args, info) {

    const {
      data: {
        jsonParams,
        ...data
      },
    } = args;

    // console.log('sberbankRegister data', JSON.stringify(data, true, 2));

    if (jsonParams) {

      data.jsonParams = JSON.stringify(jsonParams);

    }

    // console.log('sberbankRegister data 2', JSON.stringify(data, true, 2));

    const {
      orderId,
      formUrl,
      errorCode: code,
      errorMessage,
      // ...other
    } = await request('/payment/rest/register.do', data);

    const errorCode = code ? parseInt(code) : 0;

    // console.log('sberbankRegister errorCode', errorCode);
    // console.log('sberbankRegister errorMessage', errorMessage);
    // console.log('sberbankRegister other', JSON.stringify(other, true, 2));

    if (errorCode) {
      throw new Error(`${errorMessage || 'Ошибка выполнения запроса'}. Код ${errorCode}`);
    }

    if (!orderId) {
      throw new Error(`Не был получен ID заказа`);
    }

    return {
      orderId,
      formUrl,
    };
  }

}


export default class RegisterModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return RegisterProcessor;
  }


  getResolvers() {

    return {
      Mutation: {
        sberbankRegister: (source, args, ctx, info) => {
          return this.getProcessor(ctx).sberbankRegister(args, info);
        },
      },
    }

  }

}