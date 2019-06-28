app.controller('projectPocCtrl', function ($scope, $routeParams, AclService, $rootScope, RESOURCES, $http, $filter, services, $cookieStore, $location, menuService, breadcrumbs, pagination) {

    $scope.breadcrumbs = breadcrumbs;
    var poc = this;
    $scope.can = AclService.can;
    poc.id = null;
    poc.title = 'Add New';
    poc.pocName = "";
    poc.pocStatus = 0;
    poc.pocPrimaryContactNo = "";
    poc.pocSecondaryContactNo = "";
    poc.pocPersonalEmail = "";
    poc.pocOfficialEmail = "";
    poc.address = "";
    poc.projectName = "";
    poc.totalEntries = null;
    poc.fromValue = null;
    poc.toValue = null;
    poc.project_id = $routeParams.id || "Unknown";

    poc.addNewProjectPoc = function () {
        $location.path('/project/project-poc/add/' + poc.project_id);
    }

    id = poc.project_id;
    var dashboard_menu = menuService.getDashboardMenu();
    var project_menu = menuService.getProjectMenu();

    for (var i = 0; i < dashboard_menu.length; i++) {
        if (dashboard_menu[i].menu_name == 'Projects') {
            dashboard_menu[i].url = '';
            dashboard_menu[i].child = [];
            dashboard_menu[i].active = 'active';
            for (var j = 0; j < project_menu.length; j++) {
                if (project_menu[j].menu_name !== 'Project Info') {
                    // project_menu[j].url += id;
                    url_id = project_menu[j].url.split("/");
                    // url_id[((url_id.length)-1)] = id;
                    for (var k = 0; k < url_id.length; k++) {
                        if (url_id[k] == 'id' || !isNaN(url_id[k])) {
                            if (url_id[k] != '') {
                                url_id[k] = id;
                            }
                        }
                    }
                    url_id = url_id.join('/');
                    project_menu[j].url = url_id;
                }
                project_menu[j].projectId = poc.project_id;
                if (project_menu[j].menu_name == 'Project POC') {
                    project_menu[j].active = 'active';
                } else {
                    project_menu[j].active = 'deactive';
                }
                dashboard_menu[i].child.push(project_menu[j]);
            }
        }
    }
    var menu = dashboard_menu;

    // var menu=menuService.getProjectMenu();
    //   for (var i = 0; i <menu.length; i++) {
    //       menu[i].projectId=poc.project_id;
    //       if(menu[i].menu_name=='Project POC'){
    //           menu[i].active='active';
    //       }else{
    //           menu[i].active='deactive';
    //       }
    //   }
    menuService.setMenu(menu);
    if (poc.project_id > 0) {
        setTimeout(function () {
            $('#table_length').on('change', function () {
                poc.fetchList(-1);
            });
        }, 100);
    }

    poc.fetchList = function (page) {
        poc.limit = $('#table_length').val();
        if (poc.limit == undefined) {
            poc.limit = -1;
        }
        if (page == -1) {
            poc.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            poc.pageno = page;
        }
        var requestParam = {
            page: poc.pageno,
            limit: poc.limit,
        };

        if (poc.project_id > 0) {
            var promise = services.getProjectPocByProjId(poc.project_id, requestParam);
            promise.success(function (result) {
                Utility.stopAnimation();
                if (result.data) {
                    poc.allProjectPoc = result.data.data;
                    poc.fromValue = result.data.from;
                    poc.toValue = result.data.to;
                    poc.totalEntries = result.data.total;
                    pagination.applyPagination(result.data, poc);
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    };

    poc.init = function () {
        poc.fetchList(-1);

        //this if section is for displaying project name in header
        if (poc.project_id > 0) {
            var promise = services.getProject(poc.project_id);
            promise.success(function (response) {
                //Suvrat Issue#3166
                $rootScope.project_name = response.data.name;
                Utility.stopAnimation();
                var projectName = response.data.name;
                // $scope.$root.$broadcast("myEvent", {projectName: projectName});
                // $scope.$root.$broadcast("myIdEvent", {projectId:  poc.project_id});
                // menuService.setProjectInfo({projectName:projectName,projectId:poc.project_id});
                // $scope.projectInfo= menuService.getProjectInfo();
                // $rootScope.$emit("menuCtrlMethod",$scope.projectInfo);
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }

        poc.id = $location.search()["id"];

        if (poc.id > 0) {
            var promise = services.getProjectPoc({ id: poc.id });
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                poc.title = 'Update';
                poc.project_id = response.data.data.project.id;
                poc.pocName = response.data.data.name;
                poc.pocPrimaryContactNo = response.data.data.mobile_primary;
                poc.pocSecondaryContactNo = response.data.data.mobile_secondary;
                poc.pocPersonalEmail = response.data.data.email_personal;
                poc.pocOfficialEmail = response.data.data.email_official;
                poc.address = response.data.data.address;
                poc.pocStatus = response.data.data.status;
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    poc.init();

    poc.createProjectPoc = function () {
        if ($("#form-project-poc").valid()) {
            var req = {
                "project_id": poc.project_id,
                "name": poc.pocName,
                "mobile_primary": poc.pocPrimaryContactNo.replace(/\s+/g, ''),
                "mobile_secondary": poc.pocSecondaryContactNo.replace(/\s+/g, ''),
                "email_personal": poc.pocPersonalEmail,
                "email_official": poc.pocOfficialEmail,
                "address": poc.address,
                "status": poc.pocStatus
            };

            var promise;
            if (poc.id) {
                req.id = poc.id;
                promise = services.updateProjectPoc(req);
                var operationMessage = " updated ";
            } else {
                promise = services.saveProjectPoc(req);
                operationMessage = " created ";
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    $location.path('/project/project-poc/' + poc.project_id, false);
                    toastr.success('Project POC' + operationMessage + 'successfully..');

                } catch (e) {
                    toastr.error("Project POC not saved successfully..");
                    Raven.captureException(e)
                }

            }, function myError(r) {
                if (r.data.hasOwnProperty("errors")) {
                    if (r.data.errors.hasOwnProperty("name")) {
                        toastr.error(r.data.errors.name);
                    }
                } else {
                    toastr.error(r.data.message);
                }
                Utility.stopAnimation();
            });
        }
    }

    $scope.resetForm = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        $scope.user = angular.copy($scope.poc);
    };

    /* Sonal: Function to change Project POC status */
    poc.changePOCStatus = function (status, pocId, index) {
        var pocStatus = '';
        if (status == 0) {
            pocStatus = 1;
        }
        var req = {
            "poc_id": pocId,
            "status": pocStatus
        };

        swal({
            title: "Sure?",
            text: "Do you want to delete POC?",
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
                var promise = services.changeStatusofPOC(req);
                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    try {
                        toastr.success('POC is deleted successfully.');
                        setTimeout(function () {
                            poc.init();
                        }, 100);
                    } catch (e) {
                        // toastr.error('POC status is changed successfully.');
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
