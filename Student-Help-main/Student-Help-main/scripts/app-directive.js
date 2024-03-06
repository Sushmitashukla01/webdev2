const app = angular.module('app', ['ngRoute']);
var interval;

app.factory('authService', () => {
    let isLogged = false;
    let loggedUser = null;
    const BACKEND = 'http://localhost:2700';
    return {
        login: (email, password) => {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', BACKEND + '/login', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.withCredentials = true;
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const res = JSON.parse(xhr.responseText);
                        if (res.success) {
                            isLogged = true;
                            loggedUser = res.data.user;
                            resolve(loggedUser);
                        } else {
                            isLogged = false;
                            loggedUser = null;
                            resolve(loggedUser);
                        }
                    }
                }
                xhr.send(JSON.stringify({
                    email: email,
                    password: password
                }));
            });
        },
        signup: (email, password) => {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', BACKEND + '/signup', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.withCredentials = true;
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const res = JSON.parse(xhr.responseText);
                        if (res.success) {
                            isLogged = true;
                            loggedUser = res.data.user;
                            resolve(loggedUser);
                        }
                    }
                }
                xhr.send(JSON.stringify({
                    email: email,
                    password: password
                }));
            });
        },
        logout: () => { 
            return new Promise((resolve, reject) => { 
                console.log('logout');
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.open('GET', BACKEND + '/logout', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = () => { 
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const res = JSON.parse(xhr.responseText);
                    if (res.success) {
                        resolve(res.data.message);
                    } else {
                        resolve(res.data.message);
                    }
                }
            }
            xhr.send();
            })
        }
    }
});

app.factory('semesterService', () => {
    let semesters = [
        { id: 1, name: 'Semester 1' },
        { id: 2, name: 'Semester 2' },
        { id: 3, name: 'Semester 3' },
        { id: 4, name: 'Semester 4' },
        { id: 5, name: 'Semester 5' },
        { id: 6, name: 'Semester 6' },
        { id: 7, name: 'Semester 7' },
        { id: 8, name: 'Semester 8' }
    ];

    let subjects = {
        1: [
            { id: 1, name: 'Calculus' },
            { id: 2, name: 'Physics' },
            { id: 3, name: 'Basics of Electronics' },
            { id: 4, name: 'Python' }
        ],
        2: [
            { id: 5, name: 'Differential Mathematics' },
            { id: 6, name: 'DLM' },
            { id: 7, name: 'Chemistry' },
            { id: 8, name: 'Basic Electrical Engineering' },
            { id: 9, name: 'Technical report writing' },
            { id: 10, name: 'OOPS' }
        ],
        3: [
            { id: 11, name: 'Java' },
            { id: 12, name: 'Complex variables' },
            { id: 13, name: 'Discrete mathematics' },
            { id: 14, name: 'DSA' },
            { id: 15, name: 'POCS' }
        ],
        4: [
            { id: 16, name: 'Probability and statistics' },
            { id: 17, name: 'Software engineering' },
            { id: 18, name: 'Web technologies' },
            { id: 19, name: 'DBMS' },
            { id: 20, name: 'CAO' }
        ],
        5: [
            { id: 7, name: 'Computer Science' },
            { id: 8, name: 'Electronics' },
            { id: 9, name: 'cs' },
        ],
        6: [
            { id: 7, name: 'Computer Science' },
            { id: 8, name: 'Electronics' },
            { id: 9, name: 'cs' },
        ],
        7: [
            { id: 7, name: 'Computer Science' },
            { id: 8, name: 'Electronics' },
            { id: 9, name: 'cs' },
        ],
        8: [
            { id: 7, name: 'Computer Science' },
            { id: 8, name: 'Electronics' },
            { id: 9, name: 'cs' },
        ]
    };

    let timetable = [];

    let object = {
        semesters: semesters,
        subjects: subjects,
        getTimeTable: () => [...timetable],
        pushTimeTable: (slot) => timetable.push(slot)
    };

    return object;
});

app.factory('eventService', (semesterService) => {
    let semesters = semesterService.semesters;
    let subjects = semesterService.subjects;
    const API = 'http://localhost:2700/api/events';
    let events = [];

    let object = {
        getEvents: () => {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', API, true);
                xhr.withCredentials = true;
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let res = JSON.parse(xhr.responseText);
                        if (res.success) {
                            events = res.data.events;
                            resolve(events);
                        }
                    }
                };
                xhr.send();
            });
        },
        pushEvent: (event) => {
            return new Promise(async (resolve, reject) => { 
                const xhr = new XMLHttpRequest();
                xhr.open('POST', API, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.withCredentials = true;
                xhr.onreadystatechange = () => { 
                    if (xhr.readyState === 4 && xhr.status === 200) { 
                        const res = JSON.parse(xhr.responseText);
                        if (res.success) {
                            events = res.data.events;
                            resolve(events);
                        }
                    }
                }
                xhr.send(JSON.stringify(event));
            })
        }
    }
    return object;
});

app.directive('calendar', function () {
    return {
        restrict: 'E',
        templateUrl: './templates/calendar.html',
        controller: ($scope, $rootScope) => {
            $rootScope.weeks = [
                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
            ];
            $rootScope.months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            $rootScope.today = new Date();
            $rootScope.today.setHours(0, 0, 0, 0);
            $scope.currDate = new Date($scope.today);
            $scope.prevMonthDates = [];
            $scope.currMonthDates = [];
            $scope.nextMonthDates = [];
            $scope.selectedDate = null;

            renderCalendar = () => {
                console.log('calender rendered');
                let datesThisMonth = new Date($scope.currDate.getFullYear(), $scope.currDate.getMonth() + 1, 0).getDate();
                $scope.prevMonthDates = [];
                $scope.currMonthDates = [];
                $scope.nextMonthDates = [];

                for (let i = 1; i <= datesThisMonth; i++) {
                    $scope.currMonthDates.push(i);
                }

                let datesPrevMonth = new Date($scope.currDate.getFullYear(), $scope.currDate.getMonth(), 0).getDate();
                let firstDay = new Date($scope.currDate.getFullYear(), $scope.currDate.getMonth(), 1).getDay();

                for (let i = 0; i < firstDay; i++) {
                    $scope.prevMonthDates.push(datesPrevMonth - firstDay + 1 + i);
                }

                let nextFirstDay = new Date($scope.currDate.getFullYear(), $scope.currDate.getMonth() + 1, 1).getDay();
                if (nextFirstDay !== 0) {
                    for (let i = 1; i <= 7 - nextFirstDay; i++) {
                        $scope.nextMonthDates.push(i);
                    }
                }
            }

            renderCalendar();

            $scope.nextPressed = () => {
                console.log('Next Pressed');
                let nextMonth = $scope.currDate.getMonth() + 1;
                if (nextMonth === 12) {
                    let year = $scope.currDate.getFullYear();
                    $scope.currDate.setMonth(0);
                    $scope.currDate.setFullYear(year + 1);
                } else {
                    $scope.currDate.setMonth(nextMonth);
                }

                renderCalendar();
            }

            $scope.prevPressed = () => {
                console.log('Previous Pressed');
                let prevMonth = $scope.currDate.getMonth() - 1;
                if (prevMonth === -1) {
                    let year = $scope.currDate.getFullYear();
                    $scope.currDate.setMonth(11);
                    $scope.currDate.setFullYear(year - 1);
                } else {
                    $scope.currDate.setMonth(prevMonth);
                }

                renderCalendar();
            }

            $scope.datePressed = (date) => {
                console.log('Pressed');
                let dateObj = new Date($scope.currDate.getFullYear(), $scope.currDate.getMonth(), date);
                console.log(dateObj);
                $scope.selectedDate = dateObj;
                $scope.$emit('Date_Clicked', dateObj);
            }

            $rootScope.areSameDate = (date1, date2) => {
                return date1.getFullYear() === date2.getFullYear() &&
                    date1.getMonth() === date2.getMonth() &&
                    date1.getDate() === date2.getDate();
            }

            $scope.isScheduled = (date) => {
                let dateObj = new Date($scope.currDate.getFullYear(), $scope.currDate.getMonth(), date);
                let check = $rootScope.events.some(part => $rootScope.areSameDate(dateObj, part.due));
                return check;
            }

            $scope.isToday = (date) => {
                let dateObj = new Date($scope.currDate.getFullYear(), $scope.currDate.getMonth(), date);
                return $rootScope.areSameDate(dateObj, $rootScope.today);
            }
        }
    }
});

app.directive('appHeader', function () {
    return {
        restrict: 'E',
        templateUrl: './templates/header.html',
        controller: function ($scope, $rootScope) {
            $scope.dropdown = (event) => {
                document.getElementById("m-login").classList.toggle("show");
            }

            $scope.viewClick = (event) => {
                if (!event.target.matches('.m-account')) {
                    var dropdowns = document.getElementsByClassName("m-account-btn");
                    var i;
                    for (i = 0; i < dropdowns.length; i++) {
                        var openDropdown = dropdowns[i];
                        if (openDropdown.classList.contains('show')) {
                            openDropdown.classList.remove('show');
                        }
                    }
                }
            }
        }
    }
});

app.directive('home', (authService) => {
    return {
        restrict: 'E',
        templateUrl: './templates/home.html',
        controller: ($scope, $rootScope) => {
            $scope.mode = 'login';
            $scope.onSubmit = async () => {
                if ($scope.loginForm.$invalid)
                    return;
                if ($scope.mode === 'login') {
                    $rootScope.user = await authService.login($scope.email, $scope.password);
                    if ($rootScope.user) {
                        $rootScope.isLoggedIn = true;
                    } else {
                        $rootScope.isLoggedIn = false;
                        $scope.error = 'Invalid username or password!';
                    }
                    
                    $rootScope.$applyAsync();
                } else {
                    console.log
                    $rootScope.user = await authService.signup($scope.email, $scope.password);
                    $rootScope.isLoggedIn = true;
                    $rootScope.$applyAsync();
                }
            }

            $scope.onLogout = async () => { 
                const message = await authService.logout();
                $rootScope.user = null;
                $rootScope.isLoggedIn = false;
                $rootScope.$applyAsync();
            }
        }
    }
});

app.directive('timetable', () => {
    return {
        restrict: 'E',
        templateUrl: './templates/timetable.html',
        controller: ($scope, $rootScope, semesterService) => {
            console.log(semesterService.getTimeTable());
            semesterService.getTimeTable().forEach(obj => {
                const slots = obj.slot.split('+');
                console.log(slots);
                slots.forEach(obj1 => {
                    const el = $('.' + obj1);
                    console.log(el);
                    el.html(obj.subject.name);
                })
            });
            $scope.showAfternoon = false;
            $scope.timing = 'morning';
            $scope.onChange = () => {
                if ($('select').val() === 'afternoon') { 
                    $scope.showAfternoon = true;
                }
            }
        }
    }
});

app.directive('timetableForm', () => {
    return {
        restrict: 'E',
        templateUrl: './templates/timetable_form.html',
        controller: ($scope, $rootScope, semesterService) => { 
            $scope.semesters = semesterService.semesters;
            
            $scope.subjects = semesterService.subjects;
            $scope.submitForm = function () {
                if ($scope.myForm.$invalid) {
                    return;
                }
                const slot = {
                    slot: $scope.slot,
                    semester: $scope.semester,
                    subject: $scope.subject
                }
                semesterService.pushTimeTable(slot);
                $scope.slot = "";
                $scope.semester = "";
                $scope.subject = "";
                $scope.myForm.$setPristine();
            };

        }
    }
});

app.directive('eventsForm', () => {
    return {
        restrict: 'E',
        templateUrl: './templates/events_form.html',
        controller: ($scope, $rootScope, semesterService, eventService) => {
            $scope.semesters = semesterService.semesters;
            $scope.subjects = semesterService.subjects;
            $scope.onEventSubmit = async () => {
                const event = new EventModel($scope.etitle, $scope.edetail, $scope.semester, $scope.subject, new Date($scope.due), $rootScope.user);
                await eventService.pushEvent(event);
                $scope.$broadcast('NewEventAdded');
                $scope.etitle = "";
                $scope.edetail = "";
                $scope.semester = "";
                $scope.subject = "";
                $scope.due = "";
                $scope.eventsForm.$setPristine();
                $scope.$applyAsync();
            }

            
        }
    }
});

app.directive('eventList', () => {
    return {
        restrict: 'E',
        templateUrl: './templates/event-list.html',
        controller: async ($scope, $rootScope, eventService) => {
            $scope.events = await eventService.getEvents();
            $scope.$on('NewEventAdded', () => {
                $scope.events = eventService.getEvents();
            });
            $scope.$applyAsync();
        }
    }
});

