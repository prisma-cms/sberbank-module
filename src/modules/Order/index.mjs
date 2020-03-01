
import PrismaModule from '@prisma-cms/prisma-module'
import PrismaProcessor from '@prisma-cms/prisma-processor'
import { request } from '../'


export class OrderProcessor extends PrismaProcessor {
  async sberbankGetOrderStatusExtended(args, info) {
    const {
      data: {
        jsonParams,
        ...data
      },
    } = args

    console.log('sberbankRegister data', JSON.stringify(data, true, 2))

    if (jsonParams) {
      data.jsonParams = JSON.stringify(jsonParams)
    }

    console.log('sberbankRegister data 2', JSON.stringify(data, true, 2))

    const result = await request('/payment/rest/getOrderStatusExtended.do', data)

    const {
      errorCode: code,
      errorMessage,
      ...other
    } = result

    const errorCode = code ? parseInt(code) : 0;

    console.log('sberbankRegister errorCode', errorCode)
    console.log('sberbankRegister errorMessage', errorMessage)
    console.log('sberbankRegister other', JSON.stringify(other, true, 2))

    if (errorCode) {
      throw new Error(`${errorMessage || 'Ошибка выполнения запроса'}. Код ${errorCode}`)
    }

    return result;
  }
}


export default class OrderModule extends PrismaModule {
  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx)
  }


  getProcessorClass() {
    return OrderProcessor
  }


  getResolvers() {
    return {
      Query: {
        sberbankGetOrderStatusExtended: (source, args, ctx, info) => {
          return this.getProcessor(ctx).sberbankGetOrderStatusExtended(args, info)
        },
      },
    }
  }
}
