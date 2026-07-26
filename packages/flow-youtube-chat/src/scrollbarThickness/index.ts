import {
  Effect as Z,
} from 'effect';

// The thickness in CSS px of a classic (space-taking) scrollbar, 0 where
// scrollbars overlay content. CSS has no unit or env() for this
// quantity, so layouts that budget for a scrollbar gutter (see
// settingsPanelSize) measure it from a throwaway probe element.
export default Z.sync(() => {
  const probe = document.createElement('div');
  probe.style.position = 'fixed';
  probe.style.top = '-100px';
  probe.style.width = '50px';
  probe.style.height = '50px';
  probe.style.overflow = 'scroll';
  probe.style.visibility = 'hidden';
  document.documentElement.append(probe);
  const thickness = probe.offsetWidth - probe.clientWidth;
  probe.remove();

  return thickness;
});
