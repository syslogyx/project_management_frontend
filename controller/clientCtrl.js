app.controller('clientCtrl', function ($scope, AclService, $http, pagination, services, $location, menuService, $rootScope, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
    var clc = this;
    $scope.can = AclService.can;
    clc.id = null;
    clc.title = 'Add New Client Company';
    clc.companyName = "";
    clc.contactEmail = "";
    clc.mobileNo = "";
    clc.address = "";
    clc.business = "";
    clc.bType = "";
    clc.projectName = "";
    clc.pageno = 0;
    clc.limit = 0;

    clc.totalEntries = null;
    clc.fromValue = null;
    clc.toValue = null;

    var loggedInUser = services.getIdentity();
    // $rootScope.$emit("menuCtrlMethod",{});
    // clc.projects = [
    //     {id: "1", pname: "VyakoHrms"},
    //     {id: "2", pname: "SmartFactory"},
    //     {id: "3", pname: "TBM"},
    //     {id: "4", pname: "Wordpress"}
    // ];

    clc.addNewClient = function () {
        $location.path('/client/add');
        //tec.refresh();
    };

    // var menu=menuService.getResourceMatrixMenu();
    var menu = menuService.getDashboardMenu();
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'Clients') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }
    menuService.setMenu(menu);

    setTimeout(function () {
        $('#table_length').on('change', function () {
            clc.fetchList(-1);
        });
    }, 100);

    clc.fetchList = function (page) {
        clc.limit = $('#table_length').val();
        if (clc.limit == undefined) {
            clc.limit = -1;
        }
        if (page == -1) {
            clc.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            clc.pageno = page;
        }
        var requestParam = {
            page: clc.pageno,
            // limit:pagination.getpaginationLimit(),
            limit: clc.limit,
        };

        var promise = services.getAllClients(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data != null) {
                clc.allClients = result.data.data;
                clc.fromValue = result.data.from;
                clc.toValue = result.data.to;
                clc.totalEntries = result.data.total;
                pagination.applyPagination(result.data, clc);
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    clc.init = function () {
        // clc.limit = pagination.getpaginationLimit();
        clc.limit = $('#table_length').val();
        clc.fetchList(-1);
        clc.id = $location.search()["id"];
        // clc.id = $routeParams.id || "Unknown";;
        if (clc.id > 0) {
            var promise = services.getClient({ id: clc.id });
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                clc.title = 'Update Client Company';
                clc.companyName = response.data.data.name;
                clc.contactEmail = response.data.data.email;
                clc.mobileNo = response.data.data.mobile;
                clc.address = response.data.data.address;
                clc.business = response.data.data.business;
                clc.bType = response.data.data.type;
                // clc.projectName = clc.projects[response.data.data.project_id];
                clc.projectNames = clc.prepareProjectNameString(response.data.data.project);
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    };

    clc.init();

    clc.createClient = function () {
        if ($("#clientForm").valid()) {
            var req = {
                "name": clc.companyName,
                "mobile": clc.mobileNo.replace(/\s+/g, ''),
                "pincode": 789789,
                "tel_number": 7777777777,
                "city": "Nagpur",
                "state": "Maharashtra",
                "country": "India",
                "address": clc.address,
                "type": clc.bType,
                "business": clc.business,
                "email": clc.contactEmail,
            };
            var promise;
            if (clc.id) {
                req.id = clc.id;
                req["updated_by"] = loggedInUser.id;
                promise = services.updateClient(req);
                var operationMessage = " updated ";
            } else {
                req["created_by"] = loggedInUser.id;
                req["updated_by"] = loggedInUser.id;
                promise = services.saveClient(req);
                operationMessage = " created ";
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    toastr.success('Client' + operationMessage + 'successfully..');
                    var isConfirmFlag = false;
                    swal({
                        // title: "Sure?",
                        text: "Do you want to create project for this client?",
                        type: "warning",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        confirmButtonText: "Yes",
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: '#d33',
                        cancelButtonText: "No",
                        animation: false,
                        customClass: 'animated tada'
                    }).then(function (isConfirm) {
                        isConfirmFlag = isConfirm;
                        window.location.href = '/project/add?client=' + response.data.data.id;

                    });
                    if (!isConfirmFlag) {
                        $location.url('/client');
                    }
                } catch (e) {
                    toastr.error("Client not saved successfully..");
                    Raven.captureException(e);
                }
            }, function myError(r) {
                if (r.data.errors) {
                    if (r.data.errors.email) {
                        toastr.error(r.data.errors.email);
                    }
                    if (r.data.errors.name) {
                        toastr.error(r.data.errors.name);
                    }
                } else {
                    toastr.error(r.data.message, 'Sorry!');
                }
                Utility.stopAnimation();
            });
        }
    };

    clc.resetForm = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        //$('div.form-group').removeClass('has-error');
        $scope.user = angular.copy($scope.clc);
    };

    /*Sonal: Delete Client function*/
    clc.deleteClient = function (clientId) {
        swal({
            title: "Sure?",
            text: "Do you want to delete client?",
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
                var promise = services.deleteIndividualClient(clientId);
                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    try {
                        if (response.data.status_code == 200) {
                            toastr.success('Client is deleted successfully.');
                            setTimeout(function () {
                                clc.init();
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

    /**
    * Namrata : Function for looping through the Project list and Prepare the Comma separated Project name String
    * @param : projectList : List of Projects for looping
    * @return : Return the comma separated Project name String
    */
    clc.prepareProjectNameString = function (projectList) {
        if (projectList != null && projectList.length > 0) {
            // define variable to store project names
            var projectNames = '';
            for (var index = 0; index < projectList.length; index++) {
                projectNames += index == 0 ? projectList[index].name : ', ' + projectList[index].name;
            }
            return projectNames;
        }
        return '';
    }

    clc.toolTipCustomFormatFn = function (projectList) {
        var dataItem = projectList;
        clc.projectDataLst = [];
        for (i = 0; i < dataItem.length; i++) {
            var temp = "<a href = '/project/view/" + dataItem[i].id + "'>" + dataItem[i].name + "</a>";
            clc.projectDataLst.push(temp);
        }
        return "<div class='prodiv' style='text-align:left'>" + clc.projectDataLst.join(", <br/> ") + "</div>";
    };
});
