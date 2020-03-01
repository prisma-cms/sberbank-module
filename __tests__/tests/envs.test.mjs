
import mocha from 'mocha'
const { describe, it } = mocha

// console.log('process.env', process.env)



describe('Verify environments', () => {

  const {
    SBERBANK_ENDPOINT,
    SBERBANK_TOKEN,
    SBERBANK_LOGIN,
    SBERBANK_PASSWORD,
  } = process.env

  console.log('process.env.SBERBANK_ENDPOINT', SBERBANK_ENDPOINT)

  it('SBERBANK_ENDPOINT', () => {

    if (!SBERBANK_ENDPOINT) {
      throw new Error('SBERBANK_ENDPOINT env required')
    }
  });

  it('SBERBANK credentials', () => {

    if (SBERBANK_TOKEN) {
      return true
    }

    if (SBERBANK_LOGIN && SBERBANK_PASSWORD) {
      return true
    }

    throw new Error('SBERBANK_TOKEN or SBERBANK_LOGIN & SBERBANK_PASSWORD envs required')

  })

})


