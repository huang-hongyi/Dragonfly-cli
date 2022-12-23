import shell from 'shelljs';

export function queryNpmPackageUrl(packageName: string) {
  let {
    stdout: resourceURL,
    stderr,
    code
  } = shell.exec(`npm view ${packageName} dist.tarball`, { silent: true });
  if (code) {
    throw new Error(`[${code}] ${stderr}`);
  }
  if (!resourceURL || resourceURL.trim() === '') {
    throw new Error(`Get ${packageName} url error: no such package`);
  }
  return resourceURL.trim();
}