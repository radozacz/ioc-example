import IocContainer from './index';

const IOC_TOKEN_KEY = 'StoreAccessToken';
const IOC_USERNAME_KEY = 'StoreUsername';
const IOC_PASSWORD_KEY = 'StorePassword';
const IOC_REPOSITORY_KEY = 'StoreRepository';
const IOC_TOKEN_GENERATOR_KEY = 'AccessTokenGenerator';

const STORE_USERNAME = 'example-username';
const STORE_PASSWORD = 'example-password';
const STORE_PASSWORD_2 = 'example-password-2';
const TOKEN_1 = `${STORE_USERNAME}_${STORE_PASSWORD}`;
const TOKEN_2 = `${STORE_USERNAME}_+_${STORE_PASSWORD}`;
const TOKEN_3 = `${STORE_USERNAME}_+_${STORE_PASSWORD_2}`;

const createStoreAccessToken = (username: string, password: string) => `${username}_${password}`;

const anotherCreateStoreAccessToken = (username: string, password: string) => `${username}_+_${password}`;

class StoreRepository {
  private token = '';

  constructor(token: string){
    this.token = token;
  }

  getToken(){
    return this.token;
  }
}

describe('commonElements', () => {
  const container = new IocContainer();

  container.register(IOC_TOKEN_KEY, (c: IocContainer) => c.get(IOC_TOKEN_GENERATOR_KEY)(c.get(IOC_USERNAME_KEY), c.get(IOC_PASSWORD_KEY)));
  container.register(IOC_USERNAME_KEY, () => STORE_USERNAME);
  container.register(IOC_PASSWORD_KEY, () => STORE_PASSWORD);
  container.register(IOC_TOKEN_GENERATOR_KEY, () => createStoreAccessToken);
  container.register(IOC_REPOSITORY_KEY, (c: IocContainer) => new StoreRepository(c.get(IOC_TOKEN_KEY)));

  test('Check username', () => {
    const username = container.get(IOC_USERNAME_KEY)
    expect(username).toEqual(STORE_USERNAME)
  })

  test('Check generator function', () => {
    const generator = container.get(IOC_TOKEN_GENERATOR_KEY)
    expect(generator).toEqual(createStoreAccessToken)
  })

  test('Check store access token', () => {
    const StoreAccessToken = container.get(IOC_TOKEN_KEY);
    expect(StoreAccessToken).toEqual(TOKEN_1);
  })

  test('Check store access token generator', () => {
    const tokenGenerator = container.get(IOC_TOKEN_GENERATOR_KEY);
    const exampleToken = tokenGenerator('a', 'b');
    expect(exampleToken).toEqual(`a_b`);
  })

  test('Check store access token from repository object', () => {
    const storeRepository = container.get(IOC_REPOSITORY_KEY);
    const repositoryToken = storeRepository.getToken();
    expect(repositoryToken).toEqual(TOKEN_1);
  })

  test('Change token generator', () => {
    container.register(IOC_TOKEN_GENERATOR_KEY, () => anotherCreateStoreAccessToken);
    const newToken = container.get(IOC_TOKEN_KEY);
    expect(newToken).toEqual(TOKEN_2);
  })

  test('Change password', () => {
    container.register(IOC_PASSWORD_KEY, () => STORE_PASSWORD_2);
    const newToken = container.get(IOC_TOKEN_KEY);
    expect(newToken).toEqual(TOKEN_3);
  })
});
