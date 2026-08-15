import Site from '@/Site';
import siteYt from '@/siteYt';

// Every site adapter the script knows, in preference order: @/initialize
// adopts the first whose `matches` accepts the page, and falls back to the
// first entry when none does. Adding a site is an entry here plus its
// @match header in config/userscriptPlugin.mts.
//
// Non-empty by type, so the fallback needs no runtime hole. Typed as the
// interface rather than inferred from the entries, so consumers can only
// reach what @/Site declares.
const sites: readonly [Site, ...Site[]] = [siteYt];

export default sites;
