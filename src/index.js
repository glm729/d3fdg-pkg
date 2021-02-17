/**
 * Function for scaling an array of values.  Definitions of functions for
 * finding the minimum and maximum of an array of values are defined
 * internally, but should probably be defined externally (and perhaps in a less
 * obscured format!).
 * @param {Array} arr Array of values to scale
 * @param {Number} min Minimum value by which to scale
 * @param {Number} max Maximum value by which to scale
 * @return {Array} New array of scaled values
 */
export function arrayScale(arr, min = 0, max = 1) {
  let f = {
    min: (a) => a.reduce((b, c) => ((b > c) ? c : b), a[0]),
    max: (a) => a.reduce((b, c) => ((b > c) ? b : c), a[0])
  };
  let obsMin = f.min(arr);
  let obsMax = f.max(arr);
  return arr.slice().map(a => {
    return (a - obsMin) * (max - min) / (obsMax - obsMin) + min;
  });
};

/**
 * Function for providing a dummy header if none is provided in a data upload.
 *
 * @param {Integer} ofLength The length of the array of dummy names to return
 * @return {Array} Array of dummy names of the form `vPN`, where `P` is the
 * zero-padding (if applicable), and `N` is the current number.
 */
export function assignEmptyHeader(ofLength) {
  let result = [];
  for (let i = 0; i < ofLength; ++i) {
    result.push(`v${String(i).padStart(String(ofLength).length, '0')}`);
  };
  return result;
}

/**
 * Function for getting only the linked compounds with ID, such that there are
 * no "floating" nodes, i.e. nodes with no links.
 *
 * @param {Array} withId Array of Objects of the entries with ID in the KEGG
 * Compound data
 * @param {Array} opposeReduced Reduced opposing compounds present in the data
 * with IDs
 * @return {Array} withId filtered to select only those entries with an anchor
 * ID found in the reduced opposing compounds data
 */
export function getWithLinks(withId, opposeReduced) {
  let idAll = opposeReduced.map(x => [x.lhs, x.rhs]).flat();
  return withId.filter(x => idAll.indexOf(x.idAnchor) !== -1);
}

/**
 * A function for sorting an array of Objects by one specific attribute.
 * @param {Array} obj Array of Objects to sort
 * @param {String} key Key by which to sort `obj`
 * @return {Array} The input Array of Objects, sorted by the specified
 * attribute
 */
export function sortJsonAttr(obj, key = 'name') {
  let output = new Array();
  [...new Set(obj.map(o => o[key]))].sort().map(j => {
    obj.filter(o => o[key] === j).map(o => output.push(o));
  });
  return output;
};

/**
 * Function for getting contents of a ZIP file.
 * - Requires JSZip
 * - Function must be async
 *
 * @param {???} content File content of the uploaded ZIP
 * @return {Object} Contents of each file within the ZIP, whereby the key is
 * the filename without the file extension
 */
export async function unzip(content) {
  let jsz = new JSZip();
  let zip = await jsz.loadAsync(content);
  let results = {};
  for (let k in zip.files) {
    let fileContent = await zip.files[k].async('string');
    results[k.replace(/\..+$/, '')] = fileContent;
  };
  return results;
}
