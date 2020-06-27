export const HOME = "/";
export const SIGN_UP = "/signup";
export const SIGN_IN = "/signin";
export const READ = "/read";
export const LISTEN = "/listen";
export const ABOUT = "/about";
export const CONTACT = "/contact";
export const ACCOUNT = "/account";
export const ADMIN = "/admin";
export const PRIVACY_POLICY = "/privacy";
export const LESSON_TOPIC_LIST = "/lessons-list";
export const LESSON_TOPIC = "/topic";
export const PASSWORD_FORGET = "/pw-forget";
// groups of routes
export const NON_FOOTER_PAGES = [ADMIN, LESSON_TOPIC, ACCOUNT];
export const SHARED_AUTH_ROUTES = [HOME, READ, LISTEN, ABOUT];
export const ROLES_AUTH_ROUTES = [HOME, READ, LISTEN, ABOUT, ACCOUNT, ADMIN];
