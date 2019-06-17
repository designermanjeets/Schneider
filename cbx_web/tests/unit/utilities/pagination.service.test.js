describe('Pagination Service Test', function () {
  var paginationService;

  beforeEach(angular.mock.module('conext_gateway.utilities'));
  beforeEach(inject(function (_paginationService_) {
    paginationService = new _paginationService_();
  }));

  it('Get first page items', function () {
    var items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    paginationService.addItems(items);
    paginationService.setItemsPerPage(5);
    var result = paginationService.changePage(1);
    expect(result.length).toBe(5);
    expect(result[0]).toBe(1);
    expect(result[4]).toBe(5);
  });

  it('Get second page items', function () {
    var items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    paginationService.addItems(items);
    paginationService.setItemsPerPage(5);
    var result = paginationService.changePage(2);
    expect(result.length).toBe(5);
    expect(result[0]).toBe(6);
    expect(result[4]).toBe(10);
  });
})
