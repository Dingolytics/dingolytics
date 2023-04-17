import debug from "debug";
import { includes, extend } from "@lodash";
import location from "@/services/location";
import { axios } from "@/services/axios";
import { notifySessionRestored } from "@/services/restoreSession";

const logger = debug("redash:auth");

export const clientConfig = {};

export const messages = [];

export const session = {
  loaded: false
};

export const currentUser = {
  _isAdmin: false,

  permissions: [],

  canEdit(object): boolean {
    const userId = object.user_id || (object.user && object.user.id);
    return this.isAdmin || (userId && userId === this.id);
  },

  canCreate(): boolean {
    return (
      this.hasPermission("create_query") ||
      this.hasPermission("create_dashboard") ||
      this.hasPermission("list_alerts")
    );
  },

  hasPermission(permission: string): boolean {
    if (permission === "admin" && this._isAdmin) {
      return true;
    }
    return includes(this.permissions, permission);
  },

  get isAdmin(): boolean {
    return this._isAdmin || this.hasPermission("admin");
  },

  set isAdmin(isAdmin: boolean) {
    this._isAdmin = isAdmin;
  },
};

const AuthUrls = {
  Login: "login",
};

export function updateClientConfig(newClientConfig) {
  extend(clientConfig, newClientConfig);
}

function updateSession(sessionData) {
  logger("Updating session to be:", sessionData);
  extend(session, sessionData, { loaded: true });
  extend(currentUser, session.user);
  extend(clientConfig, session.client_config);
  extend(messages, session.messages);
}

export const Auth = {
  apiKey: "",

  isAuthenticated() {
    return session.loaded && session.user.id;
  },

  getLoginUrl() {
    return AuthUrls.Login;
  },

  setLoginUrl(loginUrl: string) {
    AuthUrls.Login = loginUrl;
  },

  login() {
    const next = encodeURI(location.url || "/");
    logger("Calling login with next = %s", next);
    window.location.href = `${AuthUrls.Login}?next=${next}`;
  },

  logout() {
    logger("Logout.");
    window.location.href = "logout";
  },

  loadSession() {
    logger("Loading session");
    if (session.loaded && session.user.id) {
      logger("Resolving with local value.");
      return Promise.resolve(session);
    }

    Auth.setApiKey("");

    console.log("loadSession");

    return axios.get("/api/session").then(data => {
      updateSession(data);
      return session;
    });
  },

  loadConfig() {
    logger("Loading config");
    console.log("loadConfig");
    return axios.get("/api/config").then(data => {
      updateSession({
        user: { permissions: [] },
        client_config: data.client_config,
        messages: []
      });
      return data;
    });
  },

  setApiKey(apiKey: string) {
    logger("Set API key to: %s", apiKey);
    Auth.apiKey = apiKey;
  },

  getApiKey(): string {
    return Auth.apiKey;
  },

  requireSession() {
    logger("Requested authentication");
    if (Auth.isAuthenticated()) {
      return Promise.resolve(session);
    }
    return Auth.loadSession()
      .then(() => {
        console.log('isAuthenticated', Auth.isAuthenticated());
        if (Auth.isAuthenticated()) {
          logger("Loaded session");
          notifySessionRestored();
          return session;
        }
        logger("Need to login, redirecting");
        Auth.login();
      })
      .catch(() => {
        logger("Need to login, redirecting");
        Auth.login();
      });
  },
};
