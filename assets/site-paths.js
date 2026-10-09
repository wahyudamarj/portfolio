// Resolve assets and navigation against the deployment directory (including GitHub project Pages).
export const siteRoot = new URL('../', import.meta.url);
export const siteURL = path => new URL(path.replace(/^\//, ''), siteRoot).href;
export const localPath = path => path.startsWith(siteRoot.pathname)
  ? '/' + path.slice(siteRoot.pathname.length) : path;
