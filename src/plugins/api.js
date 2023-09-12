/* eslint-disable no-param-reassign */
import parseInfo from 'infobox-parser';

class Api {
  endpoints = {
    authSignin: 'user',
    authLogin: 'user/login',
    authConfirm: 'user/confirm',
    authRecoverPassword: 'user/recoverpass',
    authResetPassword: 'user/resetpass',
    user: 'user',
    userGet: 'user/{1}',
    collectionSelection: 'collection/{1}',
    sendFeedback: 'feedback',
    searchPerson: 'mediawiki/search-person/{1}/{2}/{3}',
    page: 'mediawiki/page/{1}',
    allCollectionNames: 'collection/names',
    saveCollection: 'collection',
  };

  genericError = 'An error ocurred. Try it again later...';

  static endpoint(endpoint, ...args) {
    let count = 0;

    args.forEach((element) => {
      count += 1;
      endpoint = endpoint.replace(`{${count}}`, element);
    });

    return endpoint;
  }

  getErrorMessage(error) {
    if (error && error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }

    if (error && error.response && error.response.statusText) {
      return error.response.statusText;
    }

    return this.genericError;
  }

  login(username, password) {
    const url = Api.endpoint(this.endpoints.authLogin);

    const data = {
      username,
      password,
    };

    return this.axios.post(url, data);
  }

  register(fullname, username, password) {
    const url = Api.endpoint(this.endpoints.authSignin);

    const data = {
      fullname,
      email: username,
      password,
    };

    return this.axios.post(url, data);
  }

  confirmRegister(email, token) {
    const url = Api.endpoint(this.endpoints.authConfirm);

    const data = {
      email,
      confirmationToken: token,
    };

    return this.axios.post(url, data);
  }

  getUser(userId) {
    const url = Api.endpoint(this.endpoints.userGet, userId);

    return this.axios.get(url);
  }

  saveUser(user, oldPassword, newPassword) {
    const url = Api.endpoint(this.endpoints.user, user.id);

    const userToSave = { oldPassword, newPassword, ...user };
    return this.axios.put(url, userToSave);
  }

  recoverPassword(email) {
    const url = Api.endpoint(this.endpoints.authRecoverPassword);
    return this.axios.post(url, { email });
  }

  resetPassword(email, password, token) {
    const url = Api.endpoint(this.endpoints.authResetPassword);
    return this.axios.post(url, { email, password, token });
  }

  sendFeedback(email, feedback) {
    const url = Api.endpoint(this.endpoints.sendFeedback);
    return this.axios.post(url, { email, feedback });
  }

  async searchPerson(text, offset, limit) {
    const url = Api.endpoint(this.endpoints.searchPerson, offset, limit, text);
    return this.axios.get(url);
  }

  async getWikiInfoBox(pageId) {
    const url = Api.endpoint(this.endpoints.page, pageId);
    const { data: { parse: { wikitext: { '*': content } } } } = await this.axios.get(url);
    return parseInfo(content);
  }

  async getAllCollectionNames() {
    const url = Api.endpoint(this.endpoints.allCollectionNames);
    return this.axios.get(url);
  }

  async saveCollection(userId, name, items) {
    const url = Api.endpoint(this.endpoints.saveCollection);
    const data = { _id: userId, name, items };
    return this.axios.post(url, data);
  }
}

const api = new Api();

const ApiPlugin = {
  install(app, options) {
    app.config.globalProperties.api = api;
    api.axios = options.axios;
  },
  api,
};

export function useApi() {
  return api;
}

export default ApiPlugin;
