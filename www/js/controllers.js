angular.module('app.controllers', ['app.factories'])
    .controller('RegisterCtrl', function ($scope, $state, $http) {
        if (typeof(localStorage['session']) !== 'undefined') {
            $http.post(url + '/validate_session', {
                session_id: localStorage['session']
            }).success(function (data) {
                if (data.code == 0) $state.go('app.hackathon');
                else $scope.form = 'Register';
            });
        } else {
            $scope.form = 'Register';
        }

        $scope.registerData = {};
        $scope.register = function () {
            if ($scope.registerData.password == $scope.registerData.cpassword) {
                $http.post(url + "/register", {
                    'username': $scope.registerData.username,
                    'name': $scope.registerData.name,
                    'email': $scope.registerData.email,
                    'password': $scope.registerData.password
                }).success(function (data) {
                    $state.go('app.hackathons');
                });
            }
        };

        $scope.loginData = {};
        $scope.switch = function () {
            $scope.form = 'Login';
        };
        $scope.login = function () {
            var push = new Ionic.Push({});

            push.register(function (token) {
                console.log("Got Token: ", token.token);
                push.saveToken(token);

                $http.post(url + '/login', {
                    username: $scope.loginData.username,
                    password: $scope.loginData.password,
                    device_id: token.token
                }).success(function (data) {
                    localStorage['session'] = data.id;
                    $scope.closeLogin();
                }).error(function (data) {
                    console.log('error: ' + data);
                });
            });
        }
    })
    .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $http, Hackathons) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.signedIn = localStorage['session'] !== undefined;
        // Form data for the login modal
        $scope.loginData = {};
        Hackathons.joined().success(function (data) {
            $scope.hackathons = data.hackathons;
        });
        Hackathons.get(Hackathons.getLastActiveIndex()).success(function (data) {
            $scope.hackathon = data;
        });

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.loginModal = modal;
            if (!$scope.signedIn) {
                modal.show();
            }
        });
        $scope.closeLogin = function () {
            $scope.loginModal.hide();
        };
        $scope.showLogin = function () {
            $scope.loginModal.show();
        };
        $scope.doLogin = function () {
            var push = new Ionic.Push({});

            push.register(function (token) {
                console.log("Got Token:", token.token);
                push.saveToken(token);  // persist the token in the Ionic Platform

                $http.post(url + '/login', {
                    username: $scope.loginData.username,
                    password: $scope.loginData.password,
                    device_id: token.token
                }).success(function (data) {
                    localStorage['session'] = data.id;
                    $scope.closeLogin();
                }).error(function (data) {
                    console.log('error: ' + data);

                });
            });
        };

        $ionicModal.fromTemplateUrl('templates/hackathons/list.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.hackathonModal = modal;
        });
        $scope.showHackathon = function () {
            $scope.hackathonModal.show();
        };
        $scope.closeHackathon = function () {
            $scope.hackathonModal.hide();
        };
        $scope.doHackathon = function (id) {
            Hackathons.setLastActiveIndex(id);
            Hackathons.get(id).success(function (data) {
                $scope.hackathon = data;
                $scope.closeHackathon();
            });
        };

        $scope.logout = function () {
            delete(localStorage['session']);
        }
    })
    .controller('HackathonListCtrl', function ($scope, Hackathons) {
        Hackathons.all().success(function (data) {
            $scope.hackathons = data.hackathons;
        });
        $scope.join = function (id) {
            Hackathons.join(id).success(function() {
                Hackathons.joined().success(function (data) {
                    $scope.hackathons = data.hackathons;
                });
            });
        };
    })
    .controller('HackathonViewCtrl', function ($scope, $timeout, $http) {
        $scope.upcomingEvents = function (obj) {
            var date = new Date();
            var eventDate = new Date(obj.start);
            return eventDate >= date;
        };
        $scope.onTimeout = function () {
            if ($scope.hackathon != undefined) {
                $scope.events = $scope.hackathon.events;
                $scope.left = $scope.hackathon.end - Date.now();
                $http.post(url + '/hackathon/announcements/list', {
                    hackathon_id: $scope.hackathon.id
                }).success(function(data) {
                    $scope.announcements = data.announcements;
                })
            }
            $timeout($scope.onTimeout, 900);
        };
        $scope.onTimeout();
    })
    .controller('HackathonScheduleCtrl', function ($scope, $ionicModal, $http, Hackathons) {
        $scope.$watch('hackathon', function (hackathon) {
            if (hackathon == undefined) return hackathon;
            $scope.days = {};
            $scope.hackathon.events.forEach(function (e) {
                var time = Math.floor(e.start / 86400000) * 86400000;
                if ($scope.days[time] === undefined) $scope.days[time] = [e];
                else $scope.days[time].push(e);
            });
            console.log($scope.days);
            return hackathon;
        });

        $ionicModal.fromTemplateUrl('templates/events/add.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.addModal = modal;
        });
        $scope.formData = {};
        $scope.close = function () {
            $scope.addModal.hide();
        };
        $scope.show = function () {
            $scope.addModal.show();
        };
        $scope.add = function () {
            $http.post(url + '/hackathon/events/create', {
                session_id: localStorage['session'],
                hackathon_id: $scope.hackathon.id,
                event_name: $scope.formData.name,
                event_description: $scope.formData.description,
                start_time: $scope.formData.start.getTime(),
                end_time: $scope.formData.end.getTime()
            }).success(function() {
                Hackathons.get($scope.hackathon.id).success(function (data) {
                    $scope.hackathon = data;
                });
            });
            $scope.closeLogin();
        };
    })
    .controller('EventViewCtrl', function ($scope, $stateParams, Hackathons) {
        $scope.$watch('hackathon', function (hackathon) {
            if (hackathon == undefined) return hackathon;
            $scope.event = $scope.hackathon.events.find(function (e) {
                return e.id == $stateParams.id;
            });
            return hackathon;
        });
    })
    .controller('AnnounceListCtrl', function ($scope, $ionicModal, $http) {
        $scope.$watch('hackathon', function (hackathon) {
            if (hackathon == undefined) return hackathon;
            $http.post(url + '/hackathon/announcements/list', {
                hackathon_id: $scope.hackathon.id
            }).success(function(data) {
                $scope.announcements = data.announcements;
            });
            return hackathon;
        });
        $ionicModal.fromTemplateUrl('templates/announce_add.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.addModal = modal;
        });
        $scope.formData = {};
        $scope.close = function () {
            $scope.addModal.hide();
        };
        $scope.show = function () {
            $scope.addModal.show();
        };
        $scope.add = function () {
            $http.post(url + '/hackathon/announcements/create', {
                session_id: localStorage['session'],
                hackathon_id: $scope.hackathon.id,
                title: $scope.formData.title,
                message: $scope.formData.message
            }).success(function() {
                $http.post(url + '/hackathon/announcements/list', {
                    hackathon_id: $scope.hackathon.id
                }).success(function(data) {
                    $scope.announcements = data.announcements;
                });
            });
            $scope.closeLogin();
        };
    });
