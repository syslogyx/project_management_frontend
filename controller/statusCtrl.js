app.controller('statusCtrl', function ($scope, RESOURCES, $http, services, $cookieStore, $location, menuService, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var stc = this;
    stc.title = 'Add New Status';
    stc.id = null;
    stc.name = '';
    stc.activity_type_id = "PROJECT";

    stc.activityTypeList = [
        { id: "PROJECT", name: "Project" },
        { id: "MILESTONE", name: "Milestone" },
        { id: "TASK", name: "Task" }
    ];

    stc.statusNameList = [
        { id: "Ongoing", name: "On going" },
        { id: "Onhold", name: "On hold" },
        { id: "Closed", name: "Closed" },
        { id: "Pending", name: "Pending" }
    ];

    stc.addNewStatus = function () {
        $location.path('/status/add');
    }

    menuService.setMenu([{ "Title": "Dashboard", "Link": "matrix", "icon": "fa fa-dashboard", "active": "deactive" },
    { "Title": "Clients", "Link": "client", "icon": "fa  fa-user-plus", "active": "deactive" },
    { "Title": "Technologies", "Link": "technology", "icon": "fa fa-file-text", "active": "deactive" },
    { "Title": "Domains", "Link": "category", "icon": "fa fa-diamond", "active": "deactive" },
    { "Title": "Users", "Link": "user", "icon": "fa fa-user", "active": "deactive" },
    // {"Title": "Status", "Link": "status", "icon": "fa fa-info-circle", "active":"active"},
    { "Title": "Roles", "Link": "roles", "icon": "fa fa-child", "active": "deactive" },
    { "Title": "Permissions", "Link": "permissions", "icon": "fa fa-plus-circle", "active": "deactive" }
    ]);

    stc.init = function () {
        var promise = services.getAllStatus();
        promise.success(function (result) {
            Utility.stopAnimation();
            stc.allStatusList = result.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        stc.id = $location.search()["id"];
        if (stc.id > 0) {
            var promise = services.getStatusById({ id: stc.id });
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                stc.title = 'Update status';
                stc.activity_type_id = response.data.data.activity_type_id;
                stc.name = response.data.data.name;
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    stc.init();

    stc.saveStatus = function () {
        if ($("#statusForm").valid()) {
            $("#saveStatus").attr("disabled", "disabled");
            var req = {
                "activity_type_id": stc.activity_type_id,
                "name": stc.name
            };
            //*** instead of repeating the variable declaration. define it on one place and user thereafter.
            var promise = null;
            if (stc.id) {
                req.id = stc.id;
                promise = services.updateStatus(req);
                var operationMessage = " updated ";
            } else {
                promise = services.saveStatus(req);
                operationMessage = " created ";
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    $location.url('/status', false);
                    toastr.success('Status' + operationMessage + 'successfully..');
                    toastr.options = { onclick: function () { $("#saveStatus").removeAttr("disabled"); } }
                    setTimeout(function () {
                        $("#saveStatus").removeAttr("disabled");
                    }, 5000);
                } catch (e) {
                    toastr.error("Unable to save status");
                    toastr.options = { onclick: function () { $("#saveStatus").removeAttr("disabled"); } }
                    setTimeout(function () {
                        $("#saveStatus").removeAttr("disabled");
                    }, 5000);
                    Raven.captureException(e)
                }
            }, function myError(r) {
                toastr.error(r.data.errors.name, 'Sorry!');
                toastr.options = { onclick: function () { $("#saveStatus").removeAttr("disabled"); } }
                setTimeout(function () {
                    $("#saveStatus").removeAttr("disabled");
                }, 5000);
                Utility.stopAnimation();
            });
        }
    }

    stc.resetForm = function () {
        $('div.form-group').removeClass('has-error');
        $('span[id^="stcgoryName-error"]').remove();
        $scope.user = angular.copy($scope.stc);
    };

});
