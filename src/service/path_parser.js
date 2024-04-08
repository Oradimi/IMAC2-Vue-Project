export function getImagePath(id, eors, type, ext, filename) {
    const resource = [6657, 5699, 3371, 8909, 7719, 6229, 5449, 8561, 2987, 5501, 3127, 9319, 4365, 9811, 9927, 2423, 3439, 1865, 5925, 4409, 5509, 1517, 9695, 9255, 5325, 3691, 5519, 6949, 5607, 9539, 4133, 7795, 5465, 2659, 6381, 6875, 4019, 9195, 5645, 2887, 1213, 1815, 8671, 3015, 3147, 2991, 7977, 7045, 1619, 7909, 4451, 6573, 4545, 8251, 5983, 2849, 7249, 7449, 9477, 5963, 2711, 9019, 7375, 2201, 5631, 4893, 7653, 3719, 8819, 5839, 1853, 9843, 9119, 7023, 5681, 2345, 9873, 6349, 9315, 3795, 9737, 4633, 4173, 7549, 7171, 6147, 4723, 5039, 2723, 7815, 6201, 5999, 5339, 4431, 2911, 4435, 3611, 4423, 9517, 3243];
    const key = s => s.split("").reduce((a, e) => a + e.charCodeAt(0), 0);
    const create = (id, type) =>
      (17 * (id + 7) * resource[(key(type) + id * type.length) % 100] % 8973 + 1000).toString();
    const pad = (id) => id.toString().padStart(4, "0");
    var suffix = "";
    if (type.indexOf("_d") > 0 && type.indexOf("_dmg") < 0) {
      suffix = "_d";
      type = type.replace("_d", "");
    }
    const uniqueKey = filename ? "_" + filename : "";
    return `/${eors}/${type}/${pad(id, eors)}${suffix}_${create(id, `${eors}_${type}`)}${uniqueKey}.${ext}`;
}
