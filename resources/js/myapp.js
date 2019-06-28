var Utility = {
    apiBaseUrl: "http://172.16.2.37:8000/api/",
    // apiBaseUrl: "http://127.0.0.1:8000/api/",
    // apiBaseUrl: "http://172.16.1.213:8000/api/",
    // apiBaseUrl: "http://apiprojectmgmt.syslogyx.com/api/",
    // apiBaseUrl: "http://apiprojectmgmttest.vyako.com/api/",

    hrmsBaseUrl: "http://172.16.1.180/",
    //hrmsBaseUrl: "http://hrmstest.vyako.com/",
    // hrmsBaseUrl: "https://hrms.syslogyx.com/",

    formatDate: function (date, format) {
        var tDate = null;
        if (format == "Y/m/d") {
            tDate = this.toDate(date);
        } else {
            tDate = new Date(date);
        }

        var dd = tDate.getDate();
        var mm = tDate.getMonth() + 1; //January is 0!

        var yyyy = tDate.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        if (format == "Y/m/d") {
            return (yyyy + '-' + mm + '-' + dd);
        } else {
            return (dd + '/' + mm + '/' + yyyy);
        }

    },
    toDate: function (dateStr) {
        const [day, month, year] = dateStr.split("/")
        return new Date(year, month - 1, day)
    },
    startAnimation: function () {
        if ($("#loading").css('display') == 'none') {
            $('#loading').css("display", "block");
        }
    },
    stopAnimation: function () {
        $("#loading").fadeOut(1000, function () {
            $(".wrapper").css("display", "block");
        });
    },
    descriptiveFormatOfDate: function (date) {
        var m_names = new Array("Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul", "Aug", "Sep",
            "Oct", "Nov", "Dec");

        var d = new Date(date);
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();
        var formatedDate = curr_date + "-" + m_names[curr_month] + "-" + curr_year;
        return formatedDate;
    },
    formatPhoneNumber: function (number) {
        var arr = number.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (arr) {
            arr.shift();
        }
        return arr;
    },
    formatLandlineNumber: function (number) {
        var arr = number.match(/^(\d{4})(\d{3})(\d{4})$/);
        if (arr) {
            arr.shift();
        }
        return arr;
    },
    formatAadharNumber: function (number) {
        // var data = usc.data.hrmsUserInfo.aadhar_number;
        var arr = number.match(/\d{3,4}/g);
        return arr;
    },
    formatDateToYYMMDD: function (date) {
        date = new Date(date);
        year = date.getFullYear();
        month = date.getMonth() + 1;
        dt = date.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return (year + '-' + month + '-' + dt);
    },
    getCookie: function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },

    /**
    * Namrata : Convert time from String format to seconds
    */
    convertTimeIntoSeconds: function (hms, separator) {
        if (hms != null) {
            var a = hms.toString().split(separator); // split it at the colons
            // minutes are worth 60 seconds. Hours are worth 60 minutes.
            var seconds = 0;
            if (a[2]) {
                seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
            } else if (a[1]) {
                seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60;
            } else {
                seconds = (+a[0]) * 60 * 60;
            }
            return seconds;
        }
        return 0;
    },

    /**
    * Namrata : Convert the time into Required Format i.e HH:MM:ss/ HH:MM
    */
    convertTimeInRequiredFormat: function (time) {
        if (time != null) {
            return time.split('.').join(':');
        }
        return null;
    }
};

var app = angular.module("myapp", ['ngRoute', 'mm.acl', 'ngCookies', 'mentio', 'ng-breadcrumbs']);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    //$httpProvider.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    //$httpProvider.defaults.headers.post['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, PUT';
    //$httpProvider.defaults.headers.post['Access-Control-Allow-Credential'] = 'true';
    //$httpProvider.defaults.withOrigins = 'http://projectmgmt.syslogyx.com';
    //$httpProvider.defaults.withMethod = 'GET, POST, DELETE, PUT. OPTIONS';
    //$httpProvider.defaults.withCredentials = true;
}]);

app.filter('htmlToText', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});

// here we define our unique filter
app.filter('unique', function () {
    // we will return a function which will take in a collection
    // and a keyname
    return function (collection, keyname) {
        // we define our output and keys array;
        var output = [],
            keys = [];
        // we utilize angular's foreach function
        // this takes in our original collection and an iterator function
        angular.forEach(collection, function (item) {
            // we check to see whether our object exists
            var key = item[keyname];
            // if it's not already part of our keys array
            if (keys.indexOf(key) === -1) {
                // add it to our keys array
                keys.push(key);
                // push this item to our final output array
                output.push(item);
            }
        });
        // return our array which should be devoid of
        // any duplicates
        return output;
    };
});

app.filter('positive', function () {
    return function (input) {
        if (!input) {
            return 0;
        }

        return Math.abs(input);
    };
});

app.directive('contenteditable', ['$sce', function ($sce) {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html === '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }

            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function () {
                if (ngModel.$viewValue !== element.html()) {
                    element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                }
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function () {
                scope.$apply(read);
            });
            read(); // initialize
        }
    };
}]);

app.filter('words', function () {
    return function (input, words) {
        if (isNaN(words)) {
            return input;
        }
        if (words <= 0) {
            return '';
        }
        if (input) {
            var inputWords = input.split(/\s+/);
            if (inputWords.length > words) {
                input = inputWords.slice(0, words).join(' ') + '\u2026';
            }
        }
        return input;
    };
});

app.factory("menuService", ["$rootScope", function ($rootScope) {
    "use strict";
    return {
        menu: function () {
            $rootScope.globalMenu;
        },
        setMenu: function (menu) {
            $rootScope.globalMenu = menu;
        },
        getMenu: function () {
            return $rootScope.globalMenu;
        },
        setProjectMenu: function (menu) {
            $rootScope.projectMenu = menu;
        },
        getProjectMenu: function () {
            return $rootScope.projectMenu;
        },
        setResourceMatrixMenu: function (menu) {
            $rootScope.resourceMatrixMenu = menu;
        },
        getResourceMatrixMenu: function () {
            return $rootScope.resourceMatrixMenu;
        },
        setDashboardMenu: function (menu) {
            $rootScope.dashboardMenu = menu;
        },
        getDashboardMenu: function () {
            return $rootScope.dashboardMenu;
        },
        setDashboardContentMenu: function (menu) {
            $rootScope.dashboardContentMenu = menu;
        },
        getDashboardContentMenu: function () {
            return $rootScope.dashboardContentMenu;
        },
        setProjectInfo: function (info) {
            $rootScope.projectInfo = info;
        },
        getProjectInfo: function () {
            return $rootScope.projectInfo;
        }
    };
}])

app.factory("sidebarFactory", ["$rootScope", function ($rootScope) {
    "use strict";
    return {
        template: null,
        setMenu: function (menu) {
            $rootScope.globalMenu = menu;
        }
    };
}])

app.constant('RESOURCES', (function () {
    // Use the variable in your constants
    return {
        TOKEN: "null",
        HRMS_SERVER_API: Utility.hrmsBaseUrl,
        SERVER_API: Utility.apiBaseUrl,
        CONTENT_TYPE: 'application/x-www-form-urlencoded; charset=UTF-8',
        COMPANY_NAME: 'Syslogyx Technologies Pvt. Ltd.',
        COMPANY_ID: 3
        // CONTENT_TYPE: 'application/json; charset=UTF-8'
    }
})());

app.constant('IGNORE_LIST', (function () {
    // Use the variable in your constants
    return {
        list: ['/', '/all-feeds', '/project', '/project/add', '/project/info',
            '/eod/eod_list', '/eod/send', '/eod/view',
            '/matrix', '/client', '/client/add', '/client/edit', '/technology', '/technology/add', '/technology/edit',
            '/category', '/category/add', '/category/edit', '/user', '/user/info', '/roles', '/role/add', '/role/edit', '/role/permissions',
            '/permissions', '/permissions/add', '/permissions/edit', '/dashboard-users', '/dashboard-projects']
    }
})());

app.service('pagination', function (RESOURCES, $http, $cookieStore, $filter) {
    //set pagination limit here
    var paginationLimit = 10;
    this.getpaginationLimit = function () {
        return paginationLimit;
    };

    //apply pagination
    this.applyPagination = function (pageData, ctrlscope, $source = null) {
        $('#pagination-sec').twbsPagination({

            totalPages: pageData.last_page,
            visiblePages: 5,
            // first: '',
            // last: '',
            onPageClick: function (event, page) {
                //tec.pageno = page;
                if (ctrlscope.skip) {
                    ctrlscope.skip = false;
                    return;
                }
                //tec.search(page);
                if ($source != null) {
                    if ($source == 'Search1') {
                        ctrlscope.fetchList(page, $source);
                    }

                } else {
                    ctrlscope.fetchList(page, $source);
                }
                // if($source == "hme"){
                //     ctrlscope.fetchList(page);
                // }else{
                //     $("html, body").animate({ scrollTop: 0 }, "slow");
                // }
            }
        });
    }
});

app.service('checkAuthentication', function (RESOURCES, $http, $cookieStore, $filter, services, AclService) {
    this.checkPermission = function (q, permission) {
        if (services.getAuthKey() !== undefined) {
            if (permission == '' || AclService.can(permission)) {
                return true;
            } else {
                return q.reject('Unauthorized');
            }
        } else {
            // return q.reject('LoginRequired');
        }
    }
});

app.service('services', function (RESOURCES, $http, $cookieStore, $filter, $location) {
    this.setIdentity = function (identity) {
        this.user = identity;
    }
    this.getIdentity = function (identity) {
        // var identity = JSON.parse(atob(Utility.getCookie("identity"))); 
        // // debugger;
        // if(identity != null || identity != undefined){
        //     return JSON.parse(atob(Utility.getCookie("identity")));
        // }else
        //     $location.path('http://hrmstest.vyako.com/users/login');
        return this.user;
    }
    this.setMenuList = function (menuList) {
        this.menuList = menuList;
    }
    this.getMenuList = function () {
        return this.menuList;
    }

    this.setAuthKey = function (authkey) {
        var date = new Date();
        var minutes = 0.5;
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        $cookieStore.put('authkey', authkey, { expires: 60 * 60 * 1000, path: '/' });
    }

    this.getAuthKey = function () {
        return $cookieStore.get('authkey');
        // return Utility.getCookie("authkey1");
    }

    /*Login service*/
    this.logIn = function (email, password) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "authenticate",
            dataType: 'json',
            data: $.param({ "email": email, "password": password }),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Get all users*/
    this.getAllUsers = function (request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }

        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "users?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Sonal:Get all HRMS Manager/Lead List*/
    this.getAllManagersOrLeads = function (hrms_role_id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "user/manager_or_lead/" + hrms_role_id,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Monica:Get all logged in user data*/
    this.getLoggedInUserData = function (user_id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "user/login_data/" + user_id,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Get all users without other data*/
    this.getAllUsersDataWithoutPagination = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "users_data",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //get user by id service
    this.getUserById = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "user/" + id + "/view",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Delete User Service */
    this.deleteIndividualUser = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "user/" + id + "/delete?_method=DELETE",
            dataType: 'json',
            // data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Get all clients */
    this.getAllClients = function (request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }

        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "clients?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Client view service with id*/
    this.getClient = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "client/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Client create service*/
    this.saveClient = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "client/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Client update service with id*/
    this.updateClient = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "client/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //Delete specific client service
    this.deleteIndividualClient = function (clientId) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "client/" + clientId + "/delete",
            dataType: 'json',
            // data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Get all domain*/
    this.getAllDomains = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "domain",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    /*Get all status*/
    this.getAllStatus = function (type) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "status?type=" + type,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getDomain = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "domain/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Domain create service*/
    this.saveDomain = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "domain/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Domain update service with id*/
    this.updateDomain = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "domain/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Category */
    this.getAllCategory = function (request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }

        // Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "categories?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getCategory = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "category/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Category create service*/
    this.saveCategory = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "category/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Technology update service with id*/
    this.updateCategory = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "category/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Delete Category Service */
    this.deleteIndividualCategory = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "category/" + id + "/delete?_method=DELETE",
            dataType: 'json',
            // data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Get all technology */
    this.getAllTechnology = function (request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "technologies?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Technology view service with id*/
    this.getTechnology = function (req) {
        // Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "technology/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Technology create service*/
    this.saveTechnology = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "technology/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Technology update service with id*/
    this.updateTechnology = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "technology/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Delete Technology Service */
    this.deleteTechnologybyID = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "technology/" + id + "/delete?_method=DELETE",
            dataType: 'json',
            // data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Status view service with id*/
    this.getStatus = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "status/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Status create service*/
    this.saveStatus = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "status/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateStatus = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "status/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*For Project section*/
    this.getAllProjects = function (request) {
        var url = '?';
        if (request == undefined) {
            page = -1;
            limit = -1;

        } else {
            if (request.user_id != undefined) {
                url += 'user_id=' + request.user_id + '&';
            }
            page = request.page;
            limit = request.limit;
        }

        url += 'page=' + page + '&limit=' + limit;

        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "projects" + url,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //get projects with Id
    this.getProject = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "project/" + id + "/view",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.saveProject = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateProject = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateProjectStatus = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project/status_update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllMilestone = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "milestones",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getMilestone = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "milestone/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.saveMilestone = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "milestone/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateMilestone = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "milestone/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getMilestoneIndex = function (project_id) {
        Utility.startAnimation();
        return $http({
            method: 'get',
            url: RESOURCES.SERVER_API + "project/" + project_id + "/milestneIndex",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllTask = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "tasks",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getTask = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "task/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.saveTask = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "task/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateTask = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "task/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getTaskByMilestoneId = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "task/taskByMilestoneId/" + id,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllProjectResource = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "project-resources",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getProjectResource = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "project-resource/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Comment by sonal to remove pagination*/
    // this.viewProjectResourceByProjectID = function (id, request) {
    //     if(request == undefined){
    //         page = -1;
    //         limit = -1;
    //     }else{
    //         page = request.page;
    //         limit = request.limit;
    //     }

    //     Utility.startAnimation();
    //     return $http({
    //         method: 'GET',
    //         url: RESOURCES.SERVER_API + "project-resource/project/" + id + "/view?page=" + page + "&limit=" + limit,
    //         dataType: 'json',
    //         headers: {
    //             'Content-Type': RESOURCES.CONTENT_TYPE
    //         }
    //     })
    // };

    this.viewProjectResourceByProjectID = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "project-resource/project/" + id + "/view",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /* this.saveProjectResource = function (req) {
     Utility.startAnimation();
     return $http({
     method: 'POST',
     url: RESOURCES.SERVER_API + "project-resource/create",
     dataType: 'json',
     data: $.param(req),
     headers: {
     'Content-Type': RESOURCES.CONTENT_TYPE
     }
     })
     };*/

    this.saveProjectResource = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project-resource/add",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateProjectResource = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project-resource/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //for user-technology mapping section
    this.saveUserTechnology = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "user-technology-mapping/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //For user-technology-mapping edit service
    this.updateUserTechnology = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "user-technology-mapping/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //For user-technology-mapping edit service
    this.deleteUserTechnology = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "user-technology-mapping/" + req.id + "/delete?_method=DELETE",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //Function for filter search
    this.searchWithFilter = function (req, request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }

        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "search?page=" + page + "&limit=" + limit,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //For user-technology-mapping edit service
    this.addResourceMatrixLog = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "matrix/update-date",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };


    /*Get all project poc */
    this.getAllProjectPoc = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "project-poc",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Project poc view service with project id*/
    this.getProjectPocByProjId = function (id, request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + id + "/project-poc?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Project poc view service with id*/
    this.getProjectPoc = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "project-poc/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Project poc create service*/
    this.saveProjectPoc = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project-poc/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Client update service with id*/
    this.updateProjectPoc = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project-poc/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Change POC status*/
    this.changeStatusofPOC = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project-poc/change_status",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //for saving status
    this.saveStatus = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "status/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Get actiity status log with project id*/
    this.getActivityStatusProject = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project-activity-status-log/view-by-project-id",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    //for updating status
    // this.updateStatus = function (req) {
    //     Utility.startAnimation();
    //     return $http({
    //         method: 'POST',
    //         url: RESOURCES.SERVER_API + "status/" + req.id + "/update?_method=PUT",
    //         dataType: 'json',
    //         data: $.param(req),
    //         headers: {
    //             'Content-Type': RESOURCES.CONTENT_TYPE
    //         }
    //     })
    // };

    this.getStatusById = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "status/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    // //get all status
    // this.getAllStatus = function () {
    //     Utility.startAnimation();
    //     return $http({
    //         method: 'GET',
    //         url: RESOURCES.SERVER_API + "status",
    //         dataType: 'json',
    //         headers: {
    //             'Content-Type': RESOURCES.CONTENT_TYPE
    //         }
    //     })
    // };


    //Syn all users
    this.hitSyncCall = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "user/sync",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };


    //Sync user by id
    this.hitSyncByIdCall = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "user/sync/" + id,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getUserInfoFromHRMS = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: Utility.hrmsBaseUrl + "users/getByUserId/" + id,
            //            url: "http://hrms.syslogyx.com/users/getByUserId/" + id,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllRoles = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "roles",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllRolesWithPagination = function (request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "roles?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.createRoles = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "create/role",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateRoles = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "role/" + req.id + "/update",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.viewRoles = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "role/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllPermissions = function (request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "permissions?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.createPermissions = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "create/permission",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updatePermissions = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "permission/" + req.id + "/update",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.viewPermissions = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "permission/" + req.id + "/view",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Delete Permission Service */
    this.deleteIndividualPermission = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "permission/" + id + "/delete?_method=DELETE",
            dataType: 'json',
            // data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getPermissions = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "role/" + req.role_name + "/permissions",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.attachPermissions = function (req, role_name) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "role/" + role_name + "/permission/add",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getUserRoles = function (user_id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "users/" + user_id + "/roles",
            dataType: 'json',
            data: {},
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.attachRolesToUser = function (user_id, role_ids) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "users/" + user_id + "/add/roles/?ids=" + role_ids,
            dataType: 'json',
            data: {},
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.detachRoleFromUser = function (user_id, role_id) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "user/" + user_id + "/role/" + role_id + "?_method=DELETE",
            dataType: 'json',
            data: {},
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.categoryWiseTechnologyList = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "category/" + req.id + "/technologies",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.multipleCategoryWiseTechnologyList = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "category/technologies",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getCategoryWiseTechnologyList = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "project-category/" + req.id + "/technologies",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getProjectWiseDomain = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "project/" + req.id + "/domains",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.technologyWiseUsers = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "technology/users",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.saveUserDomainTechnology = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project/domain-technology/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //For deleting project resource
    this.deleteProjectResource = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project-resource/" + req.id + "/delete?_method=DELETE",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //For deleting project resource
    this.deleteDomain = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'DELETE',
            url: RESOURCES.SERVER_API + "project/domain/" + req.id + "/delete?_method=DELETE",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //For deleting specific technology
    this.deleteIndividualTechnology = function (req) {
        Utility.startAnimation();

        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project/domain/" + req.project_category_id + "/technology/" + req.technology_id + "/delete/" + req.user_id + "?_method=DELETE",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };


    //Get project list by user id
    this.getUserProjectList = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "user/" + req.uId + "/projects/" + "type/" + req.typeId,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //For saving specific domain technology
    this.saveDomainForTechnology = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project/domain-technology/add",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getUserCompanyInfoFromHRMS = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: Utility.hrmsBaseUrl + "company_experience/getCompanyByUserId/" + id,
            //            url: "http://hrms.syslogyx.com/users/getByUserId/" + id,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.domainWiseTechnologyList = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "users/" + req.id + "/domain/" + req.domain_id,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.userWiseDomainList = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "users/" + req.id + "/domains",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.resourceMatrixLogs = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "resource-matrix/logs",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getMoMList = function (request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }

        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "moms?page=" + page + "&limit=" + limit,
            dataType: 'json',
            data: {},
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.viewMoM = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "mom/" + id + "/view",
            dataType: 'json',
            data: {},
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateMoM = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "mom/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    /*Get all clients */
    this.getAllClientsOfMoM = function (request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }

        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "mom/clients?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };


    // this.updateMoMTask = function (id) {
    //     Utility.startAnimation();
    //     return $http({
    //         method: 'GET',
    //         url: RESOURCES.SERVER_API + "mom/" + id + "/view",
    //         dataType: 'json',
    //         data:{},
    //         headers: {
    //             'Content-Type': RESOURCES.CONTENT_TYPE
    //         }
    //     })
    // };

    this.createMoM = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "mom/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.createMoMTask = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "mom/task/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    //For deleting mom
    this.deleteMoMById = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "mom/" + id + "/remove",
            dataType: 'json',
            data: {},
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.changeStatusMomTask = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "mom/task-status/update",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };


    //For project manager updation
    this.updateManager = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project/update-manager",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateProjectDates = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project-resource/udate?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateStatusOfMilestoneAndTask = function (req, tag) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + tag + "/update_status?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.searchListOfTask = function (req, request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }

        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "tasks/list?page=" + page + "&limit=" + limit,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllUsersOfParticularProject = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project/list",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getMilestoneListByProject = function (req, request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }

        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "milestone/list?page=" + page + "&limit=" + limit,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateTaskStatus = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "task/update-status?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.projectFeedsList = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "project-logs/list",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.addComments = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "comment/add",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllEODs = function (req, request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }

        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "eod/list?page=" + page + "&limit=" + limit,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.viewEODById = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "eod/" + req.id + "/view",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    /* Sonal: API for View EOD Task and Meeting/break Data by eod_ID & user_id*/
    this.viewEODDataById = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "eod/" + req.id + "/view/" + req.user_id,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    this.viewEODTaskListss = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "eod/tasks/list",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    /* Sonal: API for View EOD Task and Meeting/break List*/
    this.viewEODTaskAndTimingLog = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "eod/todays_working_log",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Sonal:Get all users list under user wise/project wise lead*/
    this.getAllUsersUnderLead = function (user_id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "eod/" + user_id + "/user_list",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.addCommentOnEODTask = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "eod/task-comment/add?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    this.sendEODofUser = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "eod/create?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    /* Sonal: API for Sending EOD*/
    this.sendTodaysEOD = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "eod/createnew",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    this.updateEODofAdmin = function (id, req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "eod/" + id + "/update",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.filterMom = function (req, request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "mom/filter?page=" + page + "&limit=" + limit,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getFiveProjectListResouceWise = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "dashboard/projects",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    }

    this.getCategoryListwithResouceCount = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "dashboard/resource-matrix",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    }

    this.getProjectHighlights = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "dashboard/project-highlights",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    }

    this.getProjectTodayData = function (type) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "dashboard/delivery-schedule?type=" + type,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getDashboardTaskInfo = function (type, req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "dashboard/task-info?type=" + type,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getDashboardTaskInfoFilterData = function (req, request) {
        if (request == undefined) {
            page = -1;
            limit = -1;
        } else {
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "dashboard/task-info/filter?page=" + page + "&limit=" + limit,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.download = function (type, id) {
        window.open(RESOURCES.SERVER_API + type + '/' + id + '/pdf');
    };

    this.getServerTime = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "getTime",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    /*Sonal: Start HRMS break when Task is Pause*/
    this.startOrStopHRMSBreak = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.HRMS_SERVER_API + "attendanceBreakLogs/startPauseBreakTime",
            // dataType: 'json',
            data: "id=" + req.id + "&status=" + req.status + "&type=" + req.type + "&dataId=" + req.dataId + "&reason=" + req.reason + "&ipaddress=" + req.ipaddress,
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    /*Sonal:Get HRMS Break Reason List*/
    this.getHRMsBreakReasonList = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.HRMS_SERVER_API + "users/getBreakPauseReason",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    /*Sonal:Check Login User HRMS break status*/
    this.checkUserHRMSBreakStatus = function (user_id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.HRMS_SERVER_API + "AttendanceBreakLogs/checkUsersBreakStatus/" + user_id,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    /*Sonal:Get task creation users list*/
    this.getAllTaskCreationUsersList = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "user_list/task_creation",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };


    /**
    * Namrata : Request For Estimated Time Extension
    */
    this.updateTimeExtension = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "task/extend_time",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
});

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'homeCtrl',
            controllerAs: 'hme',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, '');
                }]
            },
            label: 'Home'
        })
        .when('/site/login', {
            templateUrl: 'views/site/login.html',
            controller: 'loginCtrl',
            controllerAs: 'lgc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', '$location', function ($q, checkAuthentication, $location) {
                    //return checkAuthentication.checkPermission($q,'');
                    if (checkAuthentication.checkPermission($q, '')) {
                        $location.path('/');
                        return true;
                    }
                }]
            }
        })
        .when('/all-feeds', {
            templateUrl: 'views/feed/all_feed.html',
            controller: 'allFeedCtrl',
            controllerAs: 'allfdc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.feed');
                }]
            },
            label: 'Feeds'
        })
        .when('/project', {
            templateUrl: 'views/project/project_table.html',
            controller: 'projectCtrl',
            controllerAs: 'pjc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects');
                }]
            },
            label: 'Project List'
        })
        .when('/project/add', {
            templateUrl: 'views/project/add_project.html',
            controller: 'projectCtrl',
            controllerAs: 'pjc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.add');
                }]
            },
            label: 'Add'
        })
        .when('/project/edit', {
            templateUrl: 'views/project/add_project.html',
            controller: 'projectCtrl',
            controllerAs: 'pjc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.edit');
                }]
            },
            label: 'Edit'
        })
        .when('/project/view/:id', {
            templateUrl: 'views/project/project_dashboard.html',
            controller: 'projectCtrl',
            controllerAs: 'pjc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.dashboard');
                }]
            },
            label: 'View'
        })
        .when('/project/info/:id', {
            templateUrl: 'views/project/project_info.html',
            controller: 'projectCtrl',
            controllerAs: 'pjc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects');
                }]
            },
            label: 'Info'
        })
        .when('/project/info/general-info/:id', {
            templateUrl: 'views/project/project_general_info.html',
            controller: 'projectCtrl',
            controllerAs: 'pjc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.project.info.general');
                }]
            },
            label: 'General Info'
        })
        .when('/project/info/domain-info/:id', {
            templateUrl: 'views/project/project_domain_info.html',
            controller: 'projectCtrl',
            controllerAs: 'pjc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.project.info.domain');
                }]
            },
            label: 'Domain Info'
        })
        .when('/project/resource/:id', {
            templateUrl: 'views/project_resource/add_project_resource.html',
            controller: 'projectResourceCtrl',
            controllerAs: 'prc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.resources');
                }]
            },
            label: 'Resource List'
        })
        .when('/project/edit_resource/:id', {
            templateUrl: 'views/project_resource/Edit_project_resource.html',
            controller: 'projectResourceCtrl',
            controllerAs: 'prc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, '');
                }]
            },
            label: 'Edit'
        })
        .when('/project/task/:id', {
            templateUrl: 'views/task/task_table.html',
            controller: 'taskCtrl',
            controllerAs: 'tsk',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.tasks');
                }]
            },
            label: 'Task List'
        })
        .when('/project/task/add/:id', {
            templateUrl: 'views/task/add_task.html',
            controller: 'taskCtrl',
            controllerAs: 'tsk',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.tasks.add');
                }]
            },
            label: 'Add'
        })
        .when('/project/task/edit/:id', {
            templateUrl: 'views/task/add_task.html',
            controller: 'taskCtrl',
            controllerAs: 'tsk',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.tasks.edit');
                }]
            },
            label: 'Edit'
        })
        .when('/project/task/view/:id', {
            templateUrl: 'views/task/view_task.html',
            controller: 'taskCtrl',
            controllerAs: 'tsk',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.tasks.view');
                }]
            },
            label: 'View'
        })
        .when('/project/allMilestone/:id', {
            templateUrl: 'views/milestone/milestone_table.html',
            controller: 'milestoneCtrl',
            controllerAs: 'mst',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.milestones');
                }]
            },
            label: 'Milestone List'
        })
        .when('/project/milestone/:id', {
            templateUrl: 'views/milestone/milestone_table.html',
            controller: 'milestoneCtrl',
            controllerAs: 'mst',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.milestones');
                }]
            },
            label: 'Milestone List'
        })
        .when('/project/milestone/add/:id', {
            templateUrl: 'views/milestone/add_milestone.html',
            controller: 'milestoneCtrl',
            controllerAs: 'mst',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.milestones.add');
                }]
            },
            label: 'Add'
        })
        .when('/project/milestone/edit/:id', {
            templateUrl: 'views/milestone/add_milestone.html',
            controller: 'milestoneCtrl',
            controllerAs: 'mst',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.milestones.edit');
                }]
            },
            label: 'Edit'
        })
        .when('/project/milestone/view/:id', {
            templateUrl: 'views/milestone/view_milestone.html',
            controller: 'milestoneCtrl',
            controllerAs: 'mst',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.milestones.view');
                }]
            },
            label: 'View'
        })
        .when('/project/document/:id', {
            templateUrl: 'views/document/document.html',
            controller: 'documentCtrl',
            controllerAs: 'dzc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.documents');
                }]
            },
            label: 'Documents'
        })
        .when('/project/feed/:id', {
            templateUrl: 'views/feed/feed.html',
            controller: 'feedCtrl',
            controllerAs: 'fdcc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.feeds');
                }]
            },
            label: 'Feed'
        })
        .when('/activity-log', {
            templateUrl: 'views/resource_matrix/activity_log.html',
            controller: 'resourceMatrixCtrl',
            controllerAs: 'rmx',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, '');
                }]
            },
            label: 'Activity Log'
        })
        .when('/project/project-poc/:id', {
            templateUrl: 'views/project_poc/project_poc_table.html',
            controller: 'projectPocCtrl',
            controllerAs: 'poc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.project.poc');
                }]
            },
            label: 'POC List'
        })
        .when('/project/project-poc/add/:id', {
            templateUrl: 'views/project_poc/add_project_poc.html',
            controller: 'projectPocCtrl',
            controllerAs: 'poc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.projectpoc.add');
                }]
            },
            label: 'Add'
        })
        .when('/project/project-poc/edit/:id', {
            templateUrl: 'views/project_poc/add_project_poc.html',
            controller: 'projectPocCtrl',
            controllerAs: 'poc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.projectpoc.edit');
                }]
            },
            label: 'Edit'
        })
        .when('/project/project-poc/view/:id', {
            templateUrl: 'views/project_poc/view_project_poc.html',
            controller: 'projectPocCtrl',
            controllerAs: 'poc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.projectpoc.view');
                }]
            },
            label: 'View'
        })
        .when('/project/activity-status/:id', {
            templateUrl: 'views/activity_status/activity_status_log.html',
            controller: 'activityStatusCtrl',
            controllerAs: 'act',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, '');
                }]
            },
            label: 'Activity Status'
        })
        .when('/time-sheet', {
            templateUrl: 'views/time_sheet/time_sheet.html',
            controller: 'timeSheetCtrl',
            controllerAs: 'tmc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.timesheet');
                }]
            },
            label: 'Time Sheet'
        })
        .when('/calendar', {
            templateUrl: 'views/calendar/calendar.html',
            controller: 'calendarCtrl',
            controllerAs: 'caldc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects.calendar');
                }]
            },
            label: 'calendar'
        })
        .when('/client', {
            templateUrl: 'views/client/client_table.html',
            controller: 'clientCtrl',
            controllerAs: 'clc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.clients');
                }]
            },
            label: 'Client List'
        })
        .when('/client/add', {
            templateUrl: 'views/client/add_client.html',
            controller: 'clientCtrl',
            controllerAs: 'clc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.clients.add');
                }]
            },
            label: 'Add'
        })
        .when('/client/edit', {
            templateUrl: 'views/client/add_client.html',
            controller: 'clientCtrl',
            controllerAs: 'clc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.clients.edit');
                }]
            },
            label: 'Edit'
        })
        .when('/client/view', {
            templateUrl: 'views/client/view_client.html',
            controller: 'clientCtrl',
            controllerAs: 'clc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.clients.view');
                }]
            },
            label: 'View'
        })
        .when('/technology', {
            templateUrl: 'views/master/technology_table.html',
            controller: 'technologyCtrl',
            controllerAs: 'tec',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.technologies');
                }]
            },
            label: 'Technology List'
        })
        .when('/technology/add', {
            templateUrl: 'views/master/add_technologies.html',
            controller: 'technologyCtrl',
            controllerAs: 'tec',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.technologies.add');
                }]
            },
            label: 'Add'
        })
        .when('/technology/edit', {
            templateUrl: 'views/master/add_technologies.html',
            controller: 'technologyCtrl',
            controllerAs: 'tec',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.technologies.edit');
                }]
            },
            label: 'Edit'
        })
        .when('/user/project-list/:id', {
            templateUrl: 'views/users/user_project_list.html',
            controller: 'userCtrl',
            controllerAs: 'usc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, '');
                }]
            },
            label: 'Project List'
        })
        .when('/user/info/:id', {
            templateUrl: 'views/users/add_user.html',
            controller: 'userCtrl',
            controllerAs: 'usc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.users.view');
                }]
            },
            label: 'User Info'
        })
        .when('/user', {
            templateUrl: 'views/users/user_index.html',
            controller: 'userCtrl',
            controllerAs: 'usc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.users');
                }]
            },
            label: 'User List'
        })
        .when('/matrix', {
            templateUrl: 'views/resource_matrix/resource_matrix_table.html',
            controller: 'resourceMatrixCtrl',
            controllerAs: 'rmx',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.dashboard');
                }]
            },
            label: 'Resource Matrix'
        })
        .when('/category/add', {
            templateUrl: 'views/master/add_category.html',
            controller: 'categoryCtrl',
            controllerAs: 'cate',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.domains.add');
                }]
            },
            label: 'Add'
        })
        .when('/category/edit', {
            templateUrl: 'views/master/add_category.html',
            controller: 'categoryCtrl',
            controllerAs: 'cate',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.domains.edit');
                }]
            },
            label: 'Edit'
        })
        .when('/category', {
            templateUrl: 'views/master/category_technology_table.html',
            controller: 'categoryCtrl',
            controllerAs: 'cate',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.domains');
                }]
            },
            label: 'Domain List'
        })
        .when('/roles', {
            templateUrl: 'views/roles_permission/roles_table.html',
            controller: 'rolesCtrl',
            controllerAs: 'rpc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.roles');
                }]
            },
            label: 'Role List'
        })
        .when('/role/add', {
            templateUrl: 'views/roles_permission/add_roles.html',
            controller: 'rolesCtrl',
            controllerAs: 'rpc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.roles.add');
                }]
            },
            label: 'Add'
        })
        .when('/role/edit', {
            templateUrl: 'views/roles_permission/add_roles.html',
            controller: 'rolesCtrl',
            controllerAs: 'rpc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.roles.edit');
                }]
            },
            label: 'Edit'
        })
        .when('/permissions', {
            templateUrl: 'views/roles_permission/permissions_table.html',
            controller: 'permissionCtrl',
            controllerAs: 'prc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.permissions');
                }]
            },
            label: 'Permission List'
        })
        .when('/permissions/add', {
            templateUrl: 'views/roles_permission/add_permissions.html',
            controller: 'permissionCtrl',
            controllerAs: 'prc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.permissions.add');
                }]
            },
            label: 'Add'
        })
        .when('/permissions/edit', {
            templateUrl: 'views/roles_permission/add_permissions.html',
            controller: 'permissionCtrl',
            controllerAs: 'prc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.permissions.edit');
                }]
            },
            label: 'Edit'
        })
        .when('/role/permissions', {
            templateUrl: 'views/roles_permission/manage_permissions.html',
            controller: 'attachPermissionCtrl',
            controllerAs: 'apc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.resourcematrix.roles.manage');
                }]
            },
            label: 'Add Permission'
        })
        .when('/mom/add', {
            templateUrl: 'views/Mom/create_mom.html',
            controller: 'momCtrl',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.mom.add');
                }]
            },
            label: 'Add'
        })
        .when('/mom/mom-list', {
            templateUrl: 'views/Mom/mom_table.html',
            controller: 'momCtrl',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.mom');
                }]
            },
            label: 'MoM List'
        })
        .when('/mom/edit', {
            templateUrl: 'views/Mom/editMoM.html',
            controller: 'momCtrl',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.mom.edit');
                }]
            },
            label: 'Edit'
        })
        .when('/mom/view/mom_task_list', {
            templateUrl: 'views/Mom/view_mom_taskList_table.html',
            controller: 'momCtrl',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, '');
                }]
            },
            label: 'Task List'
        })
        .when('/eod/eod_list', {
            templateUrl: 'views/EOD/eodList_table.html',
            controller: 'eodCtrl',
            controllerAs: 'eod',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.eod.history');
                }]
            },
            label: 'EOD List'
        })
        .when('/eod/view/:id', {
            templateUrl: 'views/EOD/view_eod.html',
            controller: 'eodCtrl',
            controllerAs: 'eod',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.eod.view');
                }]
            },
            label: 'View'
        })
        .when('/eod/send', {
            templateUrl: 'views/EOD/view_eod_task_list.html',
            controller: 'eodCtrl',
            controllerAs: 'eod',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.eod.send');
                }]
            },
            label: 'Send EOD'
        })
        .when('/dashboard-projects', {
            templateUrl: 'views/project/project_table_dashboard.html',
            controller: 'projectCtrl',
            controllerAs: 'pjc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, 'user.projects');
                }]
            },
            label: 'Project List'
        })
        .when('/dashboard-users', {
            templateUrl: 'views/users/user_table_dashboard.html',
            controller: 'userCtrl',
            controllerAs: 'usc',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, '');
                }]
            },
            label: 'User List'
        })
        .when('/error', {
            templateUrl: 'views/error.html',
            controller: 'errorCtrl',
            // controllerAs: 'err',
            resolve: {
                'acl': ['$q', 'checkAuthentication', function ($q, checkAuthentication) {
                    return checkAuthentication.checkPermission($q, '');
                }]
            },
            label: 'Error'
        })
        .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
});

app.run(function ($rootScope, $routeParams, AclService, $cookieStore, $location, services, menuService) {
    var authKey = services.getAuthKey();
    if (authKey == undefined) {
        $location.path('/site/login');
        // $location.path('http://hrmstest.vyako.com/users/login');

    } else {
        var role = "admin";

        var authPerm = localStorage.getItem('userPermission') == undefined ? [] : JSON.parse(atob(localStorage.getItem('userPermission')));
        var authIdentity = localStorage.getItem('identity') == undefined ? [] : JSON.parse(atob(localStorage.getItem('identity')));
        var projectMenuList = localStorage.getItem('projectMenuList') == undefined ? [] : JSON.parse(atob(localStorage.getItem('projectMenuList')));
        var dashoardMenuList = localStorage.getItem('dashoardMenuList') == undefined ? [] : JSON.parse(atob(localStorage.getItem('dashoardMenuList')));
        var resourceMenuList = localStorage.getItem('resourceMenuList') == undefined ? [] : JSON.parse(atob(localStorage.getItem('resourceMenuList')));
        var dashboardContentMenuList = localStorage.getItem('dashboardContentMenuList') == undefined ? [] : JSON.parse(atob(localStorage.getItem('dashboardContentMenuList')));


        menuService.setProjectMenu(projectMenuList);

        menuService.setResourceMatrixMenu(resourceMenuList);

        menuService.setDashboardMenu(dashoardMenuList);

        menuService.setDashboardContentMenu(dashboardContentMenuList);

        var menuList = {
            project: projectMenuList,
            dashoard: dashoardMenuList,
            resource: resourceMenuList,
            dashboardContent: dashboardContentMenuList
        }

        var aclData = { admin: authPerm };
        AclService.setAbilities(aclData);

        services.setMenuList(menuList);
        services.setIdentity(authIdentity);
        // Attach the member role to the current user
        AclService.attachRole(role);
    }

    // If the route change failed due to our "Unauthorized" error, redirect them
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        if (rejection === 'Unauthorized') {
            //Suvrat Issue#3171
            // $location.path('/error');    //This was commented before #3171
            // window.location.href = '/error'; //This was commented before #3171
            window.location.replace("views/error.html");
            // $("#viewPort").load("views/error.html");  //This was uncommented before #3171
        } else if (rejection === 'LoginRequired') {
            $location.path('/site/login');
        }
    });

    $rootScope.status = [
        { id: "1", name: "Active" },
        { id: "2", name: "InActive" },
        { id: "3", name: "Archived" }
    ];

    $rootScope.$on('$locationChangeSuccess', function () {
        $rootScope.actualLocation = $location.path();
    });

    $rootScope.$watch(function () { return $location.path() }, function (newLocation, oldLocation) {
        if ($rootScope.actualLocation === newLocation) {
            $(".select2-dropdown").remove();
            $(".datepicker").remove();
            $(".sm_container").hide();
        }
    });
});

jQuery.validator.addMethod("customEmail", function (value, element) {
    return this.optional(element) || /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
}, "Please enter a valid email address.");

app.controller('sidebarCtrl', function ($scope, $rootScope, $filter, sidebarFactory, services) {
    $scope.data = '';

    //method to change date format to dd/mm/yyyy
    convertDateStraight = function (input) {
        if (input != null) {
            return $filter('date')(new Date(input), 'dd/MM/yyyy');
        }
    }

    // $scope.template = sidebarFactory.template;
    $scope.$on('templateData', function (event, data) {
        $scope.templateData = data;
        //convering month into year and month separately
        /* angular.forEach(userTechArray, function (value, key) {
         var month = userTechArray[key]["duration_in_month"];
         var years = Math.floor(month / 12);
         month = month % 12;
         userTechArray[key]["duration"] = years + " year & " + month + " month";
         });*/

        $scope.userTechArray = data.data;

        if (data.title == 'User Info') {
            $scope.showTemp = 'mdi mdi-account-circle';
        } else if (data.title == 'Project') {
            $scope.showTemp = 'fa fa-file-powerpoint-o';
        } else if (data.title == 'Technology') {
            $scope.showTemp = 'fa fa-code';
        } else if (data.title == '') {
            $scope.showTemp = 'mdi mdi-view-headline';
        }

    });

    $scope.showTab = function (data) {
        $scope.showTemp = data;
    }

    //function will be called when we view specific time allocation log of a project
    $scope.viewTimeAllocLog = function (data, index) {
        $scope.endDateTimeAlloc = "";
        $scope.updatedByTimeAlloc = "";
        $scope.remarkTimeAlloc = "";
        // angular.forEach(data.time_allocation_log,function(value,key){
        //     var endDate = convertDateStraight(data.time_allocation_log[key].due_date);
        //     data.time_allocation_log[key].due_date = endDate;
        // });
        $("#viewTimeAllocLog_" + index).attr('disabled', 'disabled');
        $("#viewActivityLogModal").modal('toggle');
        setTimeout(function () { setCSS(); }, 500);
        //        $scope.dataArray = data;
        $scope.projectNameTimeAlloc = data.name;

        var req = {
            "project_id": data.id,
            "user_id": data.user_id,
            "domain_id": data.domain[0].id,
        };
        var promise = services.resourceMatrixLogs(req);
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            if (response.data.status_code == 200) {
                $scope.dataArray = response.data.data;
                $scope.endDateTimeAlloc = response.data.data.due_date;
                $scope.updatedByTimeAlloc = response.data.data.created_by_name;
                $scope.remarkTimeAlloc = response.data.data.remark;
            }
        }, function myError(r) {
            toastr.error(r.data.message);
            Utility.stopAnimation();
        });
    }

    $scope.dismissViewTimeAllocLogModal = function () {
        $("#viewActivityLogModal").modal('hide');
        $('*[id*=viewTimeAllocLog]:visible').each(function () {
            $(this).removeAttr('disabled');
        });
    }

    $scope.collapseDiv = function (index) {
        $scope.ind = index;
    }
});

app.controller('errorCtrl', function ($scope, $rootScope, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
});