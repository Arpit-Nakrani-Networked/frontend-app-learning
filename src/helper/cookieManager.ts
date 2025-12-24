// @ts-nocheck
import Cookies from 'js-cookie';

export default class CookieManager {
  static setCookie = (key, value, domain = undefined, expires = 90, others: any = {}) => {
    Cookies.set(key, value, { expires, domain, ...others });
  };

  static getCookie = (key, params?) => (params ? Cookies.withAttributes(params).get(key) : Cookies.get(key));

  static removeCookie = (key, params?) => {
    Cookies.remove(key, params);
  };

  static calculateDomain = (host?: string): string => {
    const hostName = host || window.location.hostname;
    const subHosts = hostName.split('.');

    if (subHosts.length <= 2) { return hostName; }

    subHosts.splice(0, 1);
    return subHosts.join('.');
  };

  static setSessionToken = (val): void => {
    CookieManager.removeSessionToken();
    CookieManager.setCookie('sessionToken', val, CookieManager.calculateDomain());
  };

  static setOpenedxCookies = (cookies = {}): void => {
    Object.entries(cookies).forEach(([key, value]) => {
      CookieManager.setCookie(key, value, CookieManager.calculateDomain());
    });
  };

  static setTokenId = (val): void => {
    CookieManager.setCookie('tokenId', val, CookieManager.calculateDomain());
  };

  static getTokenId = () => CookieManager.getCookie('tokenId');

  static removeTokenId = (): void => {
    CookieManager.removeCookie('tokenId', { domain: CookieManager.calculateDomain() });
    CookieManager.removeCookie('tokenId');
  };

  static setSessionId = (val, readableId): void => {
    CookieManager.setCookie(
      'session_id',
      `**loggedin**${val}`,
      undefined,
      undefined,
      { path: `/c/${readableId}/` },
    );
  };

  static getSessionId = () => CookieManager.getCookie('session_id');

  static removeSessionId = (): void => {
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/^(\/c\/[^/]*\/)/gi);
      if (match?.length) {
        CookieManager.removeCookie('session_id', { path: match[0] });
        return;
      }
    }
    CookieManager.removeCookie('session_id');
  };

  static getSessionToken = () => CookieManager.getCookie('sessionToken');

  static removeSessionToken = (): void => {
    CookieManager.removeSessionId();
    CookieManager.removeCookie('sessionToken', { domain: CookieManager.calculateDomain() });
    CookieManager.removeCookie('sessionToken');
  };

  static setCommunityToken = (val): void => {
    CookieManager.removeCommunityToken();

    if (process.env.NEXT_PUBLIC_NEXT_URL) {
      CookieManager.setCookie('nextCommunityToken', val);
      return;
    }

    CookieManager.setCookie('communityToken', val, CookieManager.calculateDomain());

    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;
    const userId = parsedUser?.userId;

    if (userId) {
      CookieManager.setCookie(
        `selected_community_${userId}`,
        localStorage.getItem('selected_community'),
        CookieManager.calculateDomain(),
      );
    }

    if (user) {
      CookieManager.setCookie(
        'session_id',
        `**loggedin**${CookieManager.getCookie('session_id')}`,
      );
    } else {
      CookieManager.removeSessionId();
    }
  };

  static removeCommunityToken = (): void => {
    CookieManager.removeSessionId();
    CookieManager.removeCookie('communityToken', { domain: CookieManager.calculateDomain() });
    CookieManager.removeCookie('communityToken');

    if (process.env.NEXT_PUBLIC_NEXT_URL) {
      CookieManager.removeCookie('nextCommunityToken');
    }
  };

  static clearCoursesCookies = (): void => {
    if (typeof window === 'undefined') { return; }

    const cookiesToClear = [
      'csrftoken',
      'edxloggedin',
      'openedx-language-preference',
      'sessionid',
      'studio_session_id',
    ];

    const baseDomain = 'networked.co';
    const { hostname, pathname } = window.location;

    let envPrefix = '';
    if (hostname.includes('.qa.')) {
      envPrefix = 'qa.';
    } else if (hostname.includes('.lab.')) {
      envPrefix = 'lab.';
    }

    const subDomains = ['app', 'apps', 'courses', 'mattermost'];

    const domains = new Set([
      hostname,
      baseDomain,
      `.${baseDomain}`,
      `${envPrefix}${baseDomain}`,
      `.${envPrefix}${baseDomain}`,
      ...subDomains.flatMap(sub => [
        `${sub}.${envPrefix}${baseDomain}`,
        `.${sub}.${envPrefix}${baseDomain}`,
      ]),
    ]);

    const paths = ['/', pathname];

    cookiesToClear.forEach(key => {
      domains.forEach(domain => {
        paths.forEach(path => {
          Cookies.remove(key, { domain, path });
        });
      });
      Cookies.remove(key);
    });
  };
}
