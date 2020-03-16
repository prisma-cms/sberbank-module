
import PrismaModule from '@prisma-cms/prisma-module'
import PrismaProcessor from '@prisma-cms/prisma-processor'

import Debug from 'debug';

const debug = Debug('sberbank-module:payment');

const request = async function (data) {

  const {
    SBERBANK_ENDPOINT: endpoint,
  } = process.env

  if (!endpoint) {
    throw new Error('SBERBANK_ENDPOINT env is empty');
  }

  // const endpoint = 'https://3dsec.sberbank.ru'

  const url = `${endpoint}/payment/google/payment.do`

  debug('request url', url);

  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    // .then(response => response.json()); // парсит JSON ответ в Javascript объект
    .then(response => {
      return response.json()
    }) // парсит JSON ответ в Javascript объект

  return result
}


export class PaymentProcessor extends PrismaProcessor {
  async sberbankPayment(args, info) {
    const {
      data: {
        preAuth,
        ...data
      },
    } = args

    console.log('sberbankPayment data', JSON.stringify(data, true, 2))

    // const result = await request('/payment/google/payment.do', data);

    if (typeof preAuth === 'boolean') {
      data.preAuth = preAuth.toString()
    }


    // console.log('sberbank sberbankPayment result', result);

    // const result = {
    //   securepayments: await request('https://securepayments.sberbank.ru'),
    //   '3dsec': await request('https://3dsec.sberbank.ru'),
    // }

    const result = await request(data)

    console.log('sberbank sberbankPayment result', result)

    const {
      success,
      error,
      data: responseData,
      ...other
    } = result

    const {
      orderId,
      acsUrl,
      paReq,
      termUrl,
    } = responseData || {}

    if (success !== true || error) {

      const {
        code,
        message,
      } = error || {}

      throw new Error(`${message || 'Ошибка выполнения запроса'}. ${code ? `Код ${code}` : ''}`)
    }

    return {
      ...other,
      success,
      orderId,
      acsUrl,
      paReq,
      termUrl,
    }
  }
}


export default class PaymentModule extends PrismaModule {
  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx)
  }


  getProcessorClass() {
    return PaymentProcessor
  }


  getResolvers() {
    return {
      Query: {
      },
      Mutation: {
        sberbankPayment: (source, args, ctx, info) => {
          return this.getProcessor(ctx).sberbankPayment(args, info)
        },
      },
    }
  }
}
