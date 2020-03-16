
import Debug from "debug";
import fs from "fs";
import PrismaProcessor from "@prisma-cms/prisma-processor";
import chalk from 'chalk';
import Base64 from 'js-base64';


import PrismaModule from "@prisma-cms/prisma-module";

import MergeSchema from 'merge-graphql-schemas';

import path from 'path';

import RegisterModule from './Register';
import PaymentModule from './Payment';
import OrderModule from './Order';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { createWriteStream, unlinkSync } = fs;

const { fileLoader, mergeTypes } = MergeSchema

const debug = Debug('sberbank-module:core');

const {
  Base64: {
    atob,
    btoa,
  },
} = Base64;

// console.log('base64.atob', atob);
// console.log('base64.btoa', btoa);




export class SberbankProcessor extends PrismaProcessor {


  async payment_googlepay(args, info) {

    let {
      data: {
        token,
        token2,
        tokenData,
        ...data
      },
    } = args;

    console.log('payment_googlepay data', JSON.stringify(data, true, 2));

    // const result = await request('/payment/google/payment.do', data);

    /**
     * Формируем данные из конечного объекта данных
     */
    const fromObject = (object) => {

      console.log('fromObject object', object);

      const {
        signedMessage,
      } = object;

      Object.assign(object, {
        signedMessage: JSON.stringify(signedMessage),
      });

      console.log('object 2', object);

      const paymentToken = JSON.stringify(object).replace(/=/g, '\\u003d');

      console.log(chalk.green('fromObject paymentToken'), paymentToken);

      const paymentTokenBase64 = btoa(paymentToken);

      console.log(chalk.green('fromObject paymentTokenBase64'), paymentTokenBase64);

      return paymentTokenBase64;
    }


    const processToken = (token) => {

      const tokenDecoded = atob(token);

      console.log('tokenDecoded', typeof tokenDecoded, tokenDecoded);

      const tokenDecodedObject = JSON.parse(tokenDecoded);

      console.log('tokenDecodedObject', tokenDecodedObject);

      const {
        signedMessage,
      } = tokenDecodedObject;

      console.log('signedMessage', signedMessage);

      const signedMessageObject = JSON.parse(signedMessage);

      console.log('signedMessageObject', signedMessageObject);

      // const signedMessageJSON = JSON.stringify(signedMessageObject);
      const signedMessageJSON = JSON.stringify(signedMessageObject).replace(/=/g, '\\u003d');

      console.log('signedMessageJSON', signedMessageJSON);

      console.log('signedMessageJSON === signedMessage', signedMessageJSON === signedMessage);

      Object.assign(tokenDecodedObject, {
        signedMessage: signedMessageJSON,
      });

      console.log('tokenDecodedObject 2', tokenDecodedObject);

      const tokenDecodedJSON = JSON.stringify(tokenDecodedObject);

      // const encoded = btoa(tokenDecoded);
      const encoded = btoa(tokenDecodedJSON);

      console.log('encoded', encoded);

      console.log('encoded === token', encoded === token);

      // const tokenJson = JSON.parse

      // return {
      //   token,
      // }

      // const paymentToken = token;
      const paymentToken = encoded;

      return paymentToken;
    }


    if (token) {

      // console.log('gson.decode', gson.decode(token));
      // console.log('gson.encode', gson.encode({ a: "b=" }));
      // console.log('gson.parse', gson.parse(JSON.stringify({ a: "b=" })));

      const paymentToken = processToken(token);

      Object.assign(data, {
        paymentToken,
      });

    }

    else if (token2) {

      token = token2;

      // console.log('gson.decode', gson.decode(token));
      // console.log('gson.encode', gson.encode({ a: "b=" }));
      // console.log('gson.parse', gson.parse(JSON.stringify({ a: "b=" })));

      const tokenDecoded = atob(token);

      console.log('tokenDecoded', typeof tokenDecoded, tokenDecoded);

      const tokenDecodedObject = JSON.parse(tokenDecoded);

      console.log('tokenDecodedObject', tokenDecodedObject);

      const {
        signedMessage,
      } = tokenDecodedObject;

      console.log('signedMessage', signedMessage);

      const signedMessageObject = JSON.parse(signedMessage);

      console.log('signedMessageObject', signedMessageObject);

      // // const signedMessageJSON = JSON.stringify(signedMessageObject);
      // const signedMessageJSON = JSON.stringify(signedMessageObject).replace(/=/g, '\\u003d');

      // console.log('signedMessageJSON', signedMessageJSON);

      // console.log('signedMessageJSON === signedMessage', signedMessageJSON === signedMessage);

      Object.assign(tokenDecodedObject, {
        // signedMessage: signedMessageJSON,
        signedMessage: signedMessageObject,
      });

      console.log('tokenDecodedObject 2', tokenDecodedObject);

      // const tokenDecodedJSON = JSON.stringify(tokenDecodedObject);

      // // const encoded = btoa(tokenDecoded);
      // const encoded = btoa(tokenDecodedJSON);

      // console.log('encoded', encoded);

      // console.log('encoded === token', encoded === token);

      // // const tokenJson = JSON.parse

      // // return {
      // //   token,
      // // }

      // // const paymentToken = token;
      // const paymentToken = encoded;
      const paymentToken = fromObject(tokenDecodedObject);

      console.log(chalk.green('token2 paymentToken'), paymentToken);

      const processedToken = processToken(paymentToken);

      console.log(chalk.green('token2 processedToken'), processedToken);

      Object.assign(data, {
        paymentToken: processedToken,
      });
    }

    else if (tokenData) {

      const paymentToken = fromObject(tokenData)

      const processedToken = processToken(paymentToken);

      Object.assign(data, {
        paymentToken: processedToken,
      });

      // return paymentToken;
    }

    Object.assign(data, {
    });


    const request = async function (endpoint) {

      const url = `${endpoint}/payment/google/payment.do`;

      const result = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        // .then(response => response.json()); // парсит JSON ответ в Javascript объект
        .then(response => {

          return response.json();
        }); // парсит JSON ответ в Javascript объект

      return result;
    }


    // console.log('sberbank payment_googlepay result', result);

    const result = {
      securepayments: await request('https://securepayments.sberbank.ru'),
      "3dsec": await request('https://3dsec.sberbank.ru'),
    }


    // return {
    //   "orderId": "f47f2e97-60f0-7e69-ae60-361901e2370d",
    //   "formUrl": "https://securepayments.sberbank.ru/payment/merchants/sbersafe/payment_ru.html?mdOrder=f47f2e97-60f0-7e69-ae60-361901e2370d"
    // }

    return result;
  }

}



class Module extends PrismaModule {


  constructor(props = {}) {

    super(props);

    Object.assign(this, {
    });

    this.mergeModules([
      RegisterModule,
      PaymentModule,
      OrderModule,
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return SberbankProcessor;
  }


  getSchema(types = []) {


    let schema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });


    if (schema) {
      types = types.concat(schema);
    }


    let typesArray = super.getSchema(types);

    return typesArray;

  }


  getApiSchema(types = []) {


    let baseSchema = [];

    let schemaFile = __dirname + "/../schema/generated/prisma.graphql";

    if (fs.existsSync(schemaFile)) {
      baseSchema = fs.readFileSync(schemaFile, "utf-8");
    }

    let apiSchema = super.getApiSchema(types.concat(baseSchema), []);

    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });


    return apiSchema;

  }


  getResolvers() {

    const {
      Query,
      Mutation,
      Subscription,
      ...other
    } = super.getResolvers();

    return {
      ...other,
      Query: {
        ...Query,
      },
      Mutation: {
        ...Mutation,
      },
      // Subscription: {
      //   ...Subscription,
      // },
    };
  }


}


export default Module;