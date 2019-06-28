app.controller('attachPermissionCtrl', function ($scope, $http, services, $location, menuService, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
    var apc = this;
    apc.id = null;
    apc.permissionsArray = [];
    apc.assignedPermissionsArray = [];
    apc.unassignedPermissionsArray = [];
    apc.selectedValue = false;

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

    apc.init = function () {
        apc.role_name = $location.search()["role_name"];
        var requestParam = {
            page: -1,
            // limit:pagination.getpaginationLimit(),
            limit: -1,
        }
        var promise = services.getAllPermissions(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data) {
                apc.allPermissions = result.data.data;
                var req = {
                    "role_name": apc.role_name
                };
                var promise = services.getPermissions(req);
                promise.success(function (result) {
                    Utility.stopAnimation();
                    // if (result.permissions) {
                    apc.assignedPermissionsArray = prepareAssignedPermissionList(result.permissions);
                    apc.unassignedPermissionsArray = prepareUnassignedPermissionList(apc.allPermissions);
                    // }
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                    Utility.stopAnimation();
                });
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    apc.init();

    var prepareUnassignedPermissionList = function (data) {
        var res = [];
        angular.forEach(data, function (pv, pk) {
            var check = isPermissionAssigned(pv.id);
            if (check !== true) {
                pv.isSelected = false;
                res.push(pv);
            }
        })
        return res;
    }

    var isPermissionAssigned = function (permissionId) {
        dataArray = apc.assignedPermissionsArray;
        for (i = 0; i < dataArray.length; i++) {
            if (dataArray[i]["id"] == permissionId) {
                return true;
            }
        }
        return false;
    }

    var prepareAssignedPermissionList = function (data) {
        var res = [];
        angular.forEach(data, function (pv, pk) {
            pv.isSelected = false;
            res.push(pv);
        })
        return res;
    }

    apc.assign = function (type) {
        var data = null;
        if (type == "A") {
            data = apc.unassignedPermissionsArray;
        } else if (type == "U") {
            data = apc.assignedPermissionsArray;
        }

        var len = data.length;

        for (var i = (len - 1); i >= 0; i--) {
            if (data[i]['isSelected'] == true) {
                apc.selectedValue = true;
                var temp = {
                    isSelected: false,
                    description: data[i]['description'],
                    id: data[i]['id'],
                    name: data[i]['name'],
                    display_name: data[i]['display_name'],
                };
                insertPermission(temp, type);
                data.splice(i, 1);
            }
        }
    }

    var insertPermission = function (obj, type) {
        var data = [];
        if (type == 'U') {
            data = apc.unassignedPermissionsArray;
        } else if (type == 'A') {
            data = apc.assignedPermissionsArray;
        }

        var len = data.length;
        var isInserted = false;

        for (var i = 0; i < len; i++) {
            if (data[i]['id'] == obj['id']) {
                data.push(obj);
                isInserted = true;
            }
        }

        if (isInserted == false) {
            data.push(obj);
        }
    }

    apc.setActive = function (permissionId, type) {
        var data = [];
        if (type == 'U') {
            // $("#addPermission").removeAttr("disabled");
            data = apc.unassignedPermissionsArray;
        } else if (type == 'A') {
            // $("#revPermission").removeAttr("disabled");
            data = apc.assignedPermissionsArray;
        }
        var len = data.length;
        for (var i = 0; i < len; i++) {
            if (data[i]['id'] == permissionId) {
                var status = data[i]['isSelected'] == true ? false : true;
                data[i]['isSelected'] = status;
                return;
            }
        }
    }

    apc.save = function () {
        var obj = {};
        var arr = [];

        dataArray = apc.assignedPermissionsArray;
        for (i = 0; i < dataArray.length; i++) {
            arr.push(dataArray[i]['id']);
        }
        obj.ids = arr;

        var promise = services.attachPermissions(obj, apc.role_name);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data) {
                toastr.success("Updated successfully.");
                apc.selectedValue = false;
                // apc.assignedPermissionsArray = result.permissions;
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }
});
