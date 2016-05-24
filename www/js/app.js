var url = "http://10.8.0.10:8080/api";

angular.module('app', ['ionic', 'ionic.service.core', 'ion-datetime-picker', 'app.controllers'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            })
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.hackathons', {
                url: '/hackathons',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/hackathons/browse.html',
                        controller: 'HackathonListCtrl'
                    }
                }
            })
            .state('app.hackathon', {
                url: '/hackathon',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/hackathons/view.html',
                        controller: 'HackathonViewCtrl'
                    }
                }
            })
            .state('app.schedule', {
                url: '/schedule',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/hackathons/schedule.html',
                        controller: 'HackathonScheduleCtrl'
                    }
                }
            })
            .state('app.event', {
                url: '/event/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/events/view.html',
                        controller: 'EventViewCtrl'
                    }
                }
            })
            .state('app.announcements', {
                url: '/announcements',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/announcements.html',
                        controller: 'AnnounceListCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/register');
    })
    .filter('toArray', function () {
        return function (obj) {
            if (!(obj instanceof Object)) return obj;
            return _.map(obj, function (val, key) {
                return Object.defineProperty(val, '$key', {__proto__: null, value: key});
            });
        }
    });
