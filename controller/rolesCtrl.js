app.controller('rolesCtrl', function ($scope, $rootScope, $http, AclService, services, $location, menuService, breadcrumbs, pagination) {

    $scope.breadcrumbs = breadcrumbs;
    var rpc = this;
    $scope.can = AclService.can;
    rpc.title = 'Add New Role';
    rpc.id = null;
    rpc.roleName = "";
    rpc.roleDisplayName = "";
    rpc.roleDescription = "";
    rpc.data = [];
    rpc.pageno = 0;
    rpc.limit = 0;
    rpc.totalEntries = null;
    rpc.fromValue = null;
    rpc.toValue = null;
    // $rootScope.$emit("menuCtrlMethod",{});
    // var menu=menuService.getResourceMatrixMenu();
    var menu = menuService.getDashboardMenu();
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'Roles') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }
    menuService.setMenu(menu);

    setTimeout(function () {
        $('#table_length').on('change', function () {
            rpc.fetchList(-1);
        });
    }, 100);

    rpc.fetchList = function (page) {
        rpc.limit = $('#table_length').val();
        if (rpc.limit == undefined) {
            rpc.limit = -1;
        }
        if (page == -1) {
            rpc.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            rpc.pageno = page;
        }
        var requestParam = {
            page: rpc.pageno,
            limit: rpc.limit,
        };

        var promise = services.getAllRolesWithPagination(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data) {
                rpc.allRoles = result.data.data;
                rpc.fromValue = result.data.from;
                rpc.toValue = result.data.to;
                rpc.totalEntries = result.data.total;
                pagination.applyPagination(result.data, rpc);
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    rpc.init = function () {
        rpc.limit = $('#table_length').val();
        rpc.fetchList(-1);

        rpc.id = $location.search()["id"];

        if (rpc.id > 0) {
            rpc.title = 'Update Role';
            var promise = services.viewRoles({ id: rpc.id });
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                rpc.roleName = response.data.data.name;
                rpc.roleDisplayName = response.data.data.display_name;
                rpc.roleDescription = response.data.data.description;
            }, function myError(r) {
                toastr.error(r.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    rpc.init();

    rpc.saveRole = function () {
        if ($("#rolesForm").valid()) {
            var req = {
                "name": rpc.roleName,
                "display_name": rpc.roleDisplayName,
                "description": rpc.roleDescription
            };

            var promise;
            if (rpc.id) {
                req.id = rpc.id;
                var operationMessage = " updated ";
                promise = services.updateRoles(req);
            } else {
                promise = services.createRoles(req);
                operationMessage = " created ";
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    $location.url('/roles', false);
                    toastr.success('Roles' + operationMessage + 'successfully..');
                } catch (e) {
                    toastr.error("Date not saved successfully..");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                if (r.data.errors) {
                    if (r.data.errors.name) {
                        toastr.error(r.data.errors.name);
                    }
                } else {
                    toastr.error(r.data.message, 'Sorry!');
                }
                // toastr.error(r.data.errors.name, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    rpc.addNewRoles = function () {
        $location.path('/role/add');
    }

    $scope.resetForm = function () {
        $('div.form-group').removeClass('has-error');
        $('span[id^="roleName-error"]').remove();
        $('span[id^="roleDisplayName-error"]').remove();
        $('span[id^="roleDescription-error"]').remove();
        $scope.user = angular.copy($scope.rpc);
    };

});
