/**
 * Round A2, task 4: gates the Test Mode belt behind ?test=1 so the public
 * menu's primary CTA doesn't drop players into an unfinished mode.
 * import.meta.env.DEV is deliberately not used — rundot deploy runs a
 * production vite build, so DEV is false in the private build too and the
 * belt would be untestable on device.
 *
 * Latches to localStorage so the gate survives the host stripping the query
 * string on later navigations; ?test=0 clears it. try/catch mirrors
 * save.ts's never-throw posture.
 */
const KEY = 'spice-expert-ramu:dev';

export function devModeEnabled(): boolean {
    try {
        const p = new URLSearchParams(location.search);
        if (p.get('test') === '1') { localStorage.setItem(KEY, '1'); return true; }
        if (p.get('test') === '0') { localStorage.removeItem(KEY); return false; }
        return localStorage.getItem(KEY) === '1';
    } catch {
        return false;
    }
}
