app.controller('technologyCtrl', function ($scope, AclService, $rootScope, pagination, RESOURCES, $http, services, $location, menuService, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var tec = this;
    $scope.can = AclService.can;
    tec.title = 'Add New Technology';
    tec.id = null;
    tec.technologyName = '';
    tec.technologyAlias = '';
    tec.technology = "";
    tec.data = [];
    tec.pageno = 0;
    tec.limit = 0;
    tec.skip = true;

    tec.totalEntries = null;
    tec.fromValue = null;
    tec.toValue = null;

    // $rootScope.$emit("menuCtrlMethod",{});

    tec.copyAddress = function () {
        if (tec.copyAddress) {
            tec.technologyAlias = angular.copy(tec.technologyName);
        }
    }

    // var menu=menuService.getResourceMatrixMenu();
    var menu = menuService.getDashboardMenu();
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'Technologies') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }
    menuService.setMenu(menu);

    tec.addNewTechnology = function () {
        $location.path('/technology/add');
        //tec.refresh();
    }

    /* tec.goBack = function () {
     $location.path('/technology');
     }*/

    tec.fetchList = function (page) {
        tec.limit = $('#table_length').val();
        if (tec.limit == undefined) {
            tec.limit = -1;
        }
        if (page == -1) {
            tec.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            tec.pageno = page;
        }
        var requestParam = {
            page: tec.pageno,
            limit: tec.limit,
        }

        var promise = services.getAllTechnology(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data != null) {
                // var promise = services.getTechnology({id: tec.id});
                tec.allTechnology = result.data.data;
                tec.totalEntries = result.data.total;
                tec.fromValue = result.data.from;
                tec.toValue = result.data.to;
                pagination.applyPagination(result.data, tec);
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    // tec.applyPagination = function (pageData) {
    //     $('#pagination-sec').twbsPagination({
    //         totalPages: pageData.last_page,
    //         visiblePages: 5,
    //         first: '',
    //         last: '',
    //         onPageClick: function (event, page) {
    //             //tec.pageno = page;
    //             if (tec.skip) {
    //                 tec.skip = false;
    //                 return;
    //             }
    //             //tec.search(page);
    //             tec.fetchList(page);
    //             $("html, body").animate({ scrollTop: 0 }, "slow");
    //         }
    //     });
    // }

    tec.init = function () {
        tec.limit = $('#table_length').val();
        tec.fetchList(-1);
        tec.id = $location.search()["id"];
        if (tec.id) {
            tec.title = 'Update Technology';
            var promise = services.getTechnology({ id: tec.id });
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                tec.technologyName = response.data.data.name;
                tec.technologyAlias = response.data.data.alias;
                tec.technology = response.data.data.parent_id;
                applySelect2();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    tec.init();
    setTimeout(function () {
        $('#table_length').on('change', function () {
            tec.fetchList(-1);
        });
    }, 100);

    tec.saveTechnology = function () {
        if ($("#technologyForm").valid()) {
            var parent = '';
            if (tec.technology != null) {
                parent = tec.technology;
            }

            var req = {
                "name": tec.technologyName,
                "alias": tec.technologyAlias,
                "parent_id": parent
            };

            if (tec.id) {
                req.id = tec.id;
                var operationMessage = " updated ";
                var promise = services.updateTechnology(req);
            } else {
                var promise = services.saveTechnology(req);
                operationMessage = " created ";
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    $location.url('/technology', false);
                    toastr.success('Technology' + operationMessage + 'successfully..');

                } catch (e) {
                    toastr.error("Technology not saved successfully..");
                    Raven.captureException(e)
                }
                Utility.stopAnimation();
                /*swal({
                    title: 'Technology' + operationMessage +'successfully',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Done'
                }).then(function () {
                    window.location.href = "/technology";
                })*/
            }, function myError(r) {
                if (r.data.errors) {
                    if (r.data.errors.name) {
                        toastr.error(r.data.errors.name[0], 'Sorry!');
                    }
                } else {
                    toastr.error(r.data.message, 'Sorry!');
                }
                // toastr.error(r.data.errors.name[0], 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }


    $scope.resetForm = function () {
        $('div.form-group').removeClass('has-error');
        $('span[id^="technologyName-error"]').remove();
        $scope.user = angular.copy($scope.tec);
    };

    tec.deleteTechnology = function (technologyId) {
        swal({
            title: "Sure?",
            text: "Do you want to delete technology?",
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
                var promise = services.deleteTechnologybyID(technologyId);
                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    try {
                        if (response.data.status_code == 200) {
                            toastr.success('Technology deleted successfully.');
                            setTimeout(function () {
                                tec.init();
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
