app.controller('categoryCtrl', function ($scope, AclService, RESOURCES, $http, pagination, services, $cookieStore, $location, menuService, $rootScope, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var cate = this;
    $scope.can = AclService.can;
    cate.title = 'Add New Domain With Technology';
    cate.id = null;
    cate.categoryName = '';
    cate.categoryAlias = '';
    cate.technology = "";
    cate.data = [];
    cate.pageno = 0;
    cate.limit = 0;

    cate.totalEntries = null;
    cate.fromValue = null;
    cate.toValue = null;

    // $rootScope.$emit("menuCtrlMethod",{});
    cate.copyAddress = function () {
        if (cate.copyAddress) {
            cate.categoryAlias = angular.copy(cate.categoryName);
        }
    };

    //*** this kind of calls must be wrapped inside the function and call from init method.
    cate.getTechnologies = function () {
        $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "technologies",
            data: 'json'
        }).success(function (result) {
            cate.technologies = result.data.data;
        });
    };

    cate.addNewCategory = function () {
        $location.path('/category/add');
    };

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

    setTimeout(function () {
        $('#table_length').on('change', function () {
            cate.fetchList(-1);
        });
    }, 100);

    cate.fetchList = function (page) {
        cate.limit = $('#table_length').val();
        if (cate.limit == undefined) {
            cate.limit = -1;
        }
        if (page == -1) {
            cate.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            cate.pageno = page;
        }
        var requestParam = {
            page: cate.pageno,
            // limit:pagination.getpaginationLimit(),
            limit: cate.limit,
        };

        /* Getting all the projects and displaying in table*/
        var promise = services.getAllCategory(requestParam);
        cate.getTechnologies();
        promise.success(function (result) {
            if (result.data != null) {
                Utility.stopAnimation();
                cate.allCategories = result.data.data;
                cate.fromValue = result.data.from;
                cate.toValue = result.data.to;
                cate.totalEntries = result.data.total;
                pagination.applyPagination(result.data, cate);
            }
        }, function myError(r) {
            Utility.stopAnimation();
            toastr.error(r.message);
        });
    };

    cate.init = function () {
        cate.limit = $('#table_length').val();
        cate.fetchList(-1);
        // cate.limit = pagination.getpaginationLimit();

        cate.id = $location.search()["id"];
        if (cate.id > 0) {
            var promise = services.getCategory({ id: cate.id });
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                cate.title = 'Update Domain With Technology';
                cate.categoryName = response.data.data.name;
                cate.categoryAlias = response.data.data.alias;
                // cate.technologies = {id: []};
                var technologiesArr = response.data.data.technology;

                var techArr = [];
                for ($i = 0; $i < technologiesArr.length; $i++) {
                    if (technologiesArr[$i]['id']) {
                        techArr.push(technologiesArr[$i]['id']);
                    }
                }
                if (techArr) {
                    cate.technology = techArr;
                }
                applySelect2();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    };

    cate.init();

    cate.saveCategory = function () {
        if ($("#categoryForm").valid()) {
            var req = {
                "name": cate.categoryName,
                "alias": cate.categoryAlias,
                "technology": cate.technology
            };
            //*** instead of repeating the variable declaration. define it on one place and user thereafter.
            var promise = null;
            if (cate.id) {
                req.id = cate.id;
                var operationMessage = " updated ";
                promise = services.updateCategory(req);
            } else {
                promise = services.saveCategory(req);
                operationMessage = " created ";
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                /*  swal({
                    title: 'Category' + operationMessage + 'successfully',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Done'
                }).then(function () {
                    window.location.href = "/category";
                })
                */
                try {
                    $location.url('/category', false);
                    toastr.success('Domain ' + operationMessage + 'successfully..');

                } catch (e) {
                    toastr.error("Domain not saved successfully..");
                    Raven.captureException(e);
                }
            }, function myError(r) {
                if (r.data.error) {
                    if (r.data.error.name) {
                        toastr.error(r.data.error.name, 'Sorry!');
                    }
                    if (r.data.error.alias) {
                        toastr.error(r.data.error.alias, 'Sorry!');
                    }
                } else {
                    toastr.error(r.data.message, 'Sorry!');
                }
                Utility.stopAnimation();
            });
        }
    };

    cate.resetForm = function () {
        $('div.form-group').removeClass('has-error');
        $('span[id^="categoryName-error"]').remove();
        $scope.user = angular.copy($scope.cate);
        cate.technology = [];
        applySelect2();
    };
    /*Sonal: Delete Category function*/
    cate.deleteCategory = function (categoryId) {
        swal({
            title: "Sure?",
            text: "Do you want to delete domain?",
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
                var promise = services.deleteIndividualCategory(categoryId);
                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    try {
                        if (response.data.status_code == 200) {
                            toastr.success('Domain deleted successfully.');
                            setTimeout(function () {
                                cate.init();
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
