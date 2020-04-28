import { types } from '@iooxa/runtime';

export function getLabelsAndValues(labelsString: string, valuesString: string) {
  const labels = labelsString === '' ? String(valuesString).split(',') : String(labelsString).split(',');
  const values = valuesString === '' ? labels : String(valuesString).split(',');

  if (labels.length !== values.length) {
    // eslint-disable-next-line no-console
    console.warn(`Labels and values do not match: labels: "${labelsString}"  values: "${valuesString}"`);
  }
  return { labels, values };
}

export function getValueOrTransform(
  $runtime: types.ComponentShortcut<{transform: any, value: number}> | null,
) {
  const { transform, value } = $runtime!.state;
  const transformFunc = $runtime!.component?.properties.transform.func ?? '';
  const useTransform = transformFunc !== '' && transformFunc?.trim() !== 'value';
  const val = useTransform ? transform : value;
  return val;
}
