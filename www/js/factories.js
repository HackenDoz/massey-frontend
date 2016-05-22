angular.module('app.factories', [])
    .factory('Hackathons', function ($http) {
        return {
            // projects: [
            //     {
            //         id: 1,
            //         name: 'MasseyHacks',
            //         desc: 'No pornhub allowed!',
            //         start: 1463868809000,
            //         end: 1463949000000,
            //         events: [
            //             {
            //                 id: 1,
            //                 name: "Clock Making Contest",
            //                 desc: "Raise your dongers",
            //                 start: 1463869809000,
            //                 end: 1463969889000
            //             },
            //             {
            //                 id: 2,
            //                 name: "Meme Contest",
            //                 desc: "Bring your rasest pepes",
            //                 start: 1453869809000,
            //                 end: 1464919889000
            //             },
            //             {
            //                 id: 3,
            //                 name: "Jacky Stacking",
            //                 desc: "Use your Jacky stacking skills in this intense competition!",
            //                 start: 1563869809000,
            //                 end: 1564919889000
            //             },
            //             {
            //                 id: 4,
            //                 name: "Jacky Stacking",
            //                 desc: "Use your Jacky stacking skills in this intense competition!",
            //                 start: 1463869809000,
            //                 end: 1564919889000
            //             },
            //         ],
            //     },
            //     {
            //         id: 2,
            //         name: 'FooHacks',
            //         desc: 'foobar',
            //         start: 1433868809000,
            //         end: 1463950000000,
            //     },
            //     {
            //         id: 3,
            //         name: 'HackWestern',
            //         desc: 'AuthFID',
            //         start: 1432868809000,
            //         end: 1463960000000,
            //     }
            // ],
            // joinedProjects: [],
            all: function () {
                return $http.post(url + '/hackathons/all', {
                    session_id: localStorage['session']
                });
            },
            joined: function () {
                return $http.post(url + '/hackathons', {
                    session_id: localStorage['session']
                });
            },
            join: function (id) {
                console.log(id);
                return $http.post(url + '/hackathon/join', {
                    session_id: localStorage['session'],
                    hackathon_id: id
                });
                // this.joinedProjects.push(this.projects.find(function (e) {
                //     return e.id === id;
                // }));
            },
            get: function (id) {
                return $http.post(url + '/hackathon/' + id, {
                    session_id: localStorage['session'],
                    hackathon_id: id
                });
            },
            getLastActiveIndex: function () {
                return parseInt(window.localStorage['lastActiveProject']);
            },
            setLastActiveIndex: function (id) {
                window.localStorage['lastActiveProject'] = id;
            }
        }
    });