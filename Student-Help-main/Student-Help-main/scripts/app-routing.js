const approute = angular.module('app');

approute.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            template: `
                <home></home>
            `,
            requireAuth: true
        })
        .when('/calendar', {
            template: `
            <div class="row">
                <div ng-class="{ 'col-8': showList, 'col-12': !showList }">
                    <calendar></calendar>
                </div>
                <div class="col-4">
                    <event-list ng-if="showList"></event-list>
                </div>
            </div>
            `,
            controller: 'CalendarController'
        })
        .when('/timetable', {
            template: `
            <timetable></timetable>
            `
        })
        .when('/timeform', {
            template: `<timetable-form></timetable-form>`
        })
        .when('/events', {
            template: `<event-list></event-list>`
        })
        .when(`/add/event`, {
            template: `<events-form></events-form>`
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

approute.controller('CalendarController', ['$scope', function ($scope) {
    $scope.showList = false;
    $scope.selectedDate = null;

    $scope.$on('Date_Clicked', (date) => {
        $scope.showList = !$scope.showList;
        console.log(date);
        $scope.selectedDate = date;
    });
}]);