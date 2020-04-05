
export default class {
  static get $inject() { return ['$state', '$http']; }

  constructor($state, $http) {
    this.$state = $state;
    this.$http = $http;
  }
};
