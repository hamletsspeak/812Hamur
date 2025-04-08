// Web Worker для обработки данных
self.onmessage = function(e) {
  const { data, type } = e.data;
  
  switch (type) {
    case 'SORT_PROJECTS':
      // Сортировка проектов по различным критериям
      const sortedProjects = data.sort((a, b) => {
        switch (data.sortBy) {
          case 'stars':
            return b.stars - a.stars;
          case 'date':
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          default:
            return 0;
        }
      });
      self.postMessage({ type: 'SORTED_PROJECTS', data: sortedProjects });
      break;

    case 'FILTER_PROJECTS':
      // Фильтрация проектов
      const filteredProjects = data.filter(project => {
        return project.name.toLowerCase().includes(data.searchTerm.toLowerCase()) ||
               project.description?.toLowerCase().includes(data.searchTerm.toLowerCase());
      });
      self.postMessage({ type: 'FILTERED_PROJECTS', data: filteredProjects });
      break;

    default:
      break;
  }
};