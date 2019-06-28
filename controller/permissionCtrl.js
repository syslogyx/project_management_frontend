app.controller('permissionCtrl', function ($scope, $rootScope, AclService, $http, services, $location, menuService, pagination, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var prc = this;
    $scope.can = AclService.can;
    prc.title = 'Add New Permissions';
    prc.id = null;
    prc.permissionsName = "";
    prc.permissionsDisplayName = "";
    prc.permissionsDescription = "";

    prc.totalEntries = null;
    prc.fromValue = null;
    prc.toValue = null;

    prc.data = [];
    // $rootScope.$emit("menuCtrlMethod",{});

    // var menu=menuService.getResourceMatrixMenu();
    var menu = menuService.getDashboardMenu();
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'Permissions') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }
    menuService.setMenu(menu);

    setTimeout(function () {
        $('#table_length').on('change', function () {
            prc.fetchList(-1);
        });
    }, 100);

    prc.fetchList = function (page) {
        prc.limit = $('#table_length').val();
        if (prc.limit == undefined) {
            prc.limit = -1;
        }
        if (page == -1) {
            prc.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            prc.pageno = page;
        }
        var requestParam = {
            page: prc.pageno,
            // limit:pagination.getpaginationLimit(),
            limit: prc.limit,
        }
        var promise = services.getAllPermissions(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data) {
                prc.allPermissions = result.data.data;
                prc.totalEntries = result.data.total;
                prc.fromValue = result.data.from;
                prc.toValue = result.data.to;
                pagination.applyPagination(result.data, prc);
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    prc.init = function () {
        prc.limit = $('#table_length').val();
        prc.fetchList(-1);
        prc.id = $location.search()["id"];
        if (prc.id > 0) {
            prc.title = 'Update Permission';
            var promise = services.viewPermissions({ id: prc.id });
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                prc.permissionsName = response.data.data.name;
                prc.permissionsDisplayName = response.data.data.display_name;
                prc.permissionsDescription = response.data.data.description;
            }, function myError(r) {
                toastr.error(r.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    prc.init();

    prc.savePermissions = function () {
        if ($("#permissionsForm").valid()) {
            var req = {
                "name": prc.permissionsName,
                "display_name": prc.permissionsDisplayName,
                "description": prc.permissionsDescription
            };

            var promise;
            if (prc.id) {
                req.id = prc.id;
                var operationMessage = " updated ";
                promise = services.updatePermissions(req);
            } else {
                promise = services.createPermissions(req);
                operationMessage = " created ";
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    $location.url('/permissions', false);
                    toastr.success('Permission' + operationMessage + 'successfully..');
                } catch (e) {
                    toastr.error("Date not saved successfully..");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                if (r.data.errors) {
                    if (r.data.errors.name) {
                        toastr.error(r.data.errors.name[0], 'Sorry!');
                    }
                } else {
                    toastr.error(r.data.message, 'Sorry!');
                }
                Utility.stopAnimation();
            });
        }
    }

    prc.addNewPermissions = function () {
        $location.path('/permissions/add');
    }

    $scope.resetForm = function () {
        $('div.form-group').removeClass('has-error');
        $('span[id^="permissionsName-error"]').remove();
        $('span[id^="permissionsDisplayName-error"]').remove();
        $('span[id^="permissionsDescription-error"]').remove();
        $scope.user = angular.copy($scope.prc);
    };

    /*Sonal: Delete Permission function*/
    prc.deletePermission = function (permissionId) {
        swal({
            title: "Sure?",
            text: "Do you want to delete permission?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: true,
            confirmButtonText: "Yes",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: '#d33',
            cancelButtonText: "No",
            animation: false,
            customClass: 'animated tada',
            allowOutsideClick: false,
        }).then(function (isConfirm) {
            if (isConfirm) {
                var promise = services.deleteIndividualPermission(permissionId);
                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    try {
                        if (response.data.status_code == 200) {
                            toastr.success('Permission deleted successfully.');
                            setTimeout(function () {
                                prc.init();
                            }, 100);
                        } else if (response.data.status_code == 201) {
                            toastr.error(response.data.message, 'Sorry!');
                        }
                    } catch (e) {
                        Raven.captureException(e)
                    }
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                });
            } else {
                // console.log("cancel");
            }
        }).catch(swal.noop);
    }

});
