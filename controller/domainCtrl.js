app.controller('domainCtrl', function ($scope, $http, services, $location, menuService, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var dmc = this;
    dmc.title = 'Add New Domain';
    dmc.id = null;
    dmc.domainName = "";
    dmc.domainAlias = "";
    dmc.data = [];

    // var menu=menuService.getResourceMatrixMenu();
    var menu = menuService.getDashboardMenu();
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'Domains') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }
    menuService.setMenu(menu);

    dmc.copyAddress = function () {
        if (dmc.copyAddress) {
            dmc.domainAlias = angular.copy(dmc.domainName);
        }
    }

    var promise = services.getAllDomains();
    promise.success(function (result) {
        Utility.stopAnimation();
        dmc.allDomains = result.data.data;
    }, function myError(r) {
        toastr.error(r.data.message, 'Sorry!');
        Utility.stopAnimation();

    });

    dmc.init = function () {
        dmc.id = $location.search()["id"];
        if (dmc.id > 0) {
            dmc.title = 'Update Domain';
            var promise = services.getDomain({ id: dmc.id });
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                dmc.domainName = response.data.data.name;
                dmc.domainAlias = response.data.data.alias;
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    dmc.init();

    dmc.saveDomain = function () {
        if ($("#domainForm").valid()) {
            var req = {
                "name": dmc.domainName,
                "alias": dmc.domainAlias
            };
            var promise;
            if (dmc.id) {
                req.id = dmc.id;
                var operationMessage = " updated ";
                promise = services.updateDomain(req);
            } else {
                promise = services.saveDomain(req);
                operationMessage = " created ";
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    $location.url('/domain', false);
                    toastr.success('Domain' + operationMessage + 'successfully..');

                } catch (e) {
                    toastr.error("Date not saved successfully..");
                    Raven.captureException(e)
                }
                /*swal({
                    title: 'Domain' + operationMessage + 'successfully',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Done'
                }).then(function () {
                    window.location.href = "/domain";
                })*/
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();

            });
        }
    }

    dmc.addNewDomain = function () {
        $location.path('/domain/add');
    }

    $scope.resetForm = function () {
        $('div.form-group').removeClass('has-error');
        $('span[id^="domainName-error"]').remove();
        $scope.user = angular.copy($scope.dmc);
    };

});
