export function getDefaultSortAndFilterOptions(routeQuery, mode) {
  var validSortOptions = [];
  var validFilterOptions = [];

  if (mode == 0) {
    validSortOptions = ['id', 'health', 'firepower', 'torpedo', 'anti-air', 'armor'];
    validFilterOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 16, 17, 18, 19, 20, 21, 22];
  } else if (mode == 1) {
    validSortOptions = ['id', 'firepower', 'torpedo', 'anti-air', 'armor', 'antisub', 'evasion', 'los', 'dive', 'precision', 'range', 'reach'];
    validFilterOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 56, 57, 58, 59, 93, 94, 95];
  }
    
    const defaultOptions = {
      sortOption: 'id',
      sortReverse: false,
      filterOption: 0
    };
  
    if (routeQuery.sort && validSortOptions.includes(routeQuery.sort)) {
      defaultOptions.sortOption = routeQuery.sort;
    }
  
    if (routeQuery.reverse === 'true') {
      defaultOptions.sortReverse = true;
    }
  
    const filterQueryParam = parseInt(routeQuery.filter);
    if (!isNaN(filterQueryParam) && validFilterOptions.includes(filterQueryParam)) {
      defaultOptions.filterOption = filterQueryParam;
    }
  
    return defaultOptions;
}
