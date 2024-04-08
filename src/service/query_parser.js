export function getDefaultSortAndFilterOptions(routeQuery) {
    const validSortOptions = ['id', 'health', 'firepower', 'torpedo', 'anti-air', 'armor'];
    const validFilterOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 16, 17, 18, 19, 20, 21, 22];

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