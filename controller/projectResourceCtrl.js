app.controller('projectResourceCtrl', function ($scope, AclService, $http, $routeParams, pagination, services, $location, menuService, $cookieStore, $rootScope, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var prc = this;
    $scope.can = AclService.can;
    prc.id = null;
    prc.title = "Add new project resource";
    prc.user_id = "";
    prc.domain_id = "";
    prc.role = "";
    prc.pageno = 0;
    prc.limit = 0;
    prc.totalEntries = null;

    applySelect2();

    var loggedInUser = services.getIdentity();

    prc.projectId = $routeParams.id || "Unknown";

    if (prc.projectId != "Unknown") {
        id = prc.projectId;
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
                    project_menu[j].projectId = prc.project_id;
                    if (project_menu[j].menu_name == 'Resources') {
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
        // for (var i = 0; i <menu.length; i++) {
        //     menu[i].projectId=prc.projectId;
        //     if(menu[i].menu_name=='Resources'){
        //         menu[i].active='active';
        //     }else{
        //         menu[i].active='deactive';
        //     }
        // }
        menuService.setMenu(menu);
    } else {
        //$scope.$root.$broadcast("myEvent", {projectName: ""});
        menuService.setMenu([]);
    }

    prc.designations = [
        { id: "1", dename: "Sr. Software Engineer" },
        { id: "2", dename: "Sr. Android Developer" },
        { id: "3", dename: "Graphic Lead" },
        { id: "4", dename: "Web Developer" },
        { id: "5", dename: "Backend Developer" },
        { id: "6", dename: "Sr. Quality Engineer" },
        { id: "7", dename: "Quality Engineer" },
        { id: "8", dename: "Android Developer" },
        { id: "9", dename: "Software Engineer" },
        { id: "10", dename: "Trainee" }
    ];

    prc.add = function (type) {
        if (type == 0) {
            prc.projectResourceName = "";
            prc.domainName = "";
            prc.designationName = "";
            prc.title = "Add new project resource";
        }
    }

    prc.editProjectResource = function (editId) {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });

        if (editId != null) {
            prc.title = "Update project resource";
        }

        prc.id = editId;
        if (prc.id > 0) {
            var promise = services.getProjectResource({ id: prc.id });
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    prc.user_id = response.data.data.user.id;
                    prc.domain_id = response.data.data.domain.id;
                    prc.role = response.data.data.user.designation;
                    $("#addModal").modal("show");

                } catch (e) {
                    Raven.captureException(e)
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    //Method to get project resource from project with it's specific id
    prc.projectResourceById = function () {
        //prc.oldManagerId="";
        var projectId = prc.projectId;
        /*Comment by sonal to remove pagination*/
        // var requestParam = {
        //     page:prc.pageno,
        //     limit:prc.limit,
        // }
        var promise = services.viewProjectResourceByProjectID(projectId);
        /*Comment by sonal to remove pagination*/
        // var promise = services.viewProjectResourceByProjectID(projectId, requestParam);
        promise.then(function mySucces(res) {
            //Suvrat Issue#3166
            $rootScope.project_name = res.data.data[0].project.name;
            Utility.stopAnimation();
            if (res.data.data != null && res.data.data != "") {
                var mainObj;
                if (res.data.data !== null && res.data.data.length === undefined) {

                    prc.project_resources = res.data.data.data;
                    var mainObj = res.data.data.data;
                }
                else {
                    prc.project_resources = res.data.data;
                    // prc.fromValue = res.data.from;
                    // prc.toValue = res.data.to;
                    var mainObj = res.data.data;
                }

                for (var j = 0; j < prc.project_resources.length; j++) {
                    if (prc.project_resources[j].role == "Manager") {
                        prc.statusId = prc.project_resources[j].status_id;
                    }
                }
                prc.project_resources = prc.getProjectResourcesArray(prc.project_resources);
                var url = $location.path().split("/")[2] || "Unknown";
                if (url == 'edit_resource') {
                    setTimeout(function () { setDatepicker(); setResourceDate(); }, 500);
                }

                prc.projectName = mainObj[0]['project']['name'];
                prc.projectStartDate = Utility.formatDate(mainObj[0].project.start_date);
                prc.projectEndDate = Utility.formatDate(mainObj[0].project.due_date);
                // $scope.$root.$broadcast("myEvent", {projectName: prc.projectName});
                // $scope.$root.$broadcast("myIdEvent", {projectId: prc.projectId});
                // menuService.setProjectInfo({projectName:prc.projectName,projectId:prc.projectId});
                // $scope.projectInfo= menuService.getProjectInfo();
                // $rootScope.$emit("menuCtrlMethod",$scope.projectInfo);

                for (var i = 0; i < prc.project_resources.length; i++) {
                    if (prc.project_resources[i].manager == "Manager" && prc.project_resources[i].active == "active") {
                        prc.oldManagerId = prc.project_resources[i].id;
                        prc.oldManagerName = prc.project_resources[i].users.name;
                        for (var j = 0; j < prc.project_resources[i].domains.length; j++) {
                            if (prc.project_resources[i].domains[j].alias == "Manager") {
                                prc.oldManagerStartDate = prc.project_resources[i].domains[j].start_date;
                                prc.oldManagerEndDate = prc.project_resources[i].domains[j].due_date;
                            }
                        }
                    }
                }
                /*Comment by sonal to remove pagination*/
                // pagination.applyPagination(res.data.data, prc);
            } else {
                //console.log("Status code is not 200");
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    prc.getProjectResourcesArray = function (data) {
        for (var i = 0; i < data.length; i++) {
            var proj_res_id = data[i].id;
            var sDate = Utility.formatDate(data[i].start_date);
            var eDate = Utility.formatDate(data[i].due_date);
            if (data[i].project_resource_technology.length > 0) {
                for (var j = 0; j < data[i].project_resource_technology.length; j++) {
                    data[i].project_resource_technology[j].start_date = Utility.formatDate(data[i].project_resource_technology[j].start_date);
                    data[i].project_resource_technology[j].due_date = Utility.formatDate(data[i].project_resource_technology[j].due_date);
                }
                var technologies = data[i].project_resource_technology;
                var manager = "Manager";
                data[i]["domain"]["technologies"] = technologies;
                data[i]["domain"]["tech_length"] = technologies.length;
                data[i]["domain"]["proj_res_id"] = proj_res_id;
                data[i]["domain"]["start_date"] = sDate;
                data[i]["domain"]["due_date"] = eDate;
                data[i]["domain"]["start_date"] = sDate;
                data[i]["domain"]["due_date"] = eDate;
                data[i]["domain"]["active_status"] = data[i].active_status;
                data[i]["domain"]["project_resources_id"] = data[i].id;
                data[i]["domain"]["role"] = data[i].role;
                data[i]["domain"]["task_list"] = data[i].task;
            } else {
                data[i]["domain"]["manager"] = "Manager";
                data[i]["domain"]["role"] = data[i].role;
                data[i]["domain"]["start_date"] = sDate;
                data[i]["domain"]["due_date"] = eDate;
                data[i]["domain"]["active_status"] = data[i].active_status;
                data[i]["domain"]["project_resources_id"] = data[i].id;
                data[i]["domain"]["task_list"] = data[i].task;
            }
        }

        var groups = {};
        for (var i = 0; i < data.length; i++) {
            var groupName = data[i].user_id;
            var users = data[i].user;
            if (!groups[groupName]) {
                groups[groupName] = [];
                groups[groupName][users] = [];
            }
            groups[groupName].push(data[i].domain);
            groups[groupName][users] = users;
        }
        data = [];
        for (var groupName in groups) {
            var tech_len = 0;
            var manager = "";
            var active = "";
            var role = "";
            var group = groups[groupName];
            for (i = 0; i < group.length; i++) {
                if (group[i] != null) {
                    if (group[i].tech_length > 0) {
                        tech_len += group[i].tech_length;
                    }
                    if (group[i].manager != undefined && group[i].manager == "Manager") {
                        manager = "Manager";
                        role = group[i].role;
                    }
                    if (group[i].manager != undefined && group[i].manager == "Manager" && group[i].active_status == 1) {
                        active = "active";
                    }
                }
            }
            data.push({ id: groupName, manager: manager, role: role, active: active, tech_len: tech_len, domains: groups[groupName], users: groups[groupName][users] });
        }
        return data;
    }

    prc.projectResourceById();
    /*Comment by sonal to remove pagination*/
    // setTimeout(function(){
    //     $('#table_length').on('change',function(){
    //         prc.fetchList(-1);
    //     });
    // },100);

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

        prc.projectResourceById();
    }

    prc.init = function () {
        /*Comment by sonal to remove pagination*/
        prc.projectResourceById();
        // prc.fetchList(-1);

        // prc.limit = $('#table_length').val();

        /* Getting all the Domains of this project  and displaying in dropdown*/
        if (prc.projectId) {
            var req = {
                "id": prc.projectId
            };
            var promise = services.getProjectWiseDomain(req);
            promise.success(function (result) {
                var projectDomainArray = [];
                if (result.project_category_mappings) {
                    for ($i = 0; $i < result.project_category_mappings.length; $i++) {
                        if (result.project_category_mappings[$i]['category']['id']) {
                            var domainArray = [];
                            domainArray['project_category_mappings_id'] = result.project_category_mappings[$i]['id'];
                            domainArray['id'] = result.project_category_mappings[$i]['category']['id'];
                            domainArray['name'] = result.project_category_mappings[$i]['category']['name'];
                        }
                        projectDomainArray.push(domainArray);
                    }
                }
                Utility.stopAnimation();
                prc.domains = projectDomainArray;
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
            });
        }

        var promise = services.getAllUsers();
        promise.success(function (response) {
            if (response.data) {
                prc.userName = response.data.data;
                pagination.applyPagination(response.data, prc);
            }
            //Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        /*Get all managers list*/
        var promise = services.getAllManagersOrLeads(3);
        promise.success(function (result) {
            Utility.stopAnimation();
            prc.managersList = result.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    prc.init();

    /*Getting technologies - domain wise and displaying in technology dropdown*/
    prc.fetchInfo = function (data) {
        Utility.stopAnimation();
        prc.technologies = [];
        prc.technology_id = "";
        prc.user_id = [];
        if (data) {
            var req = {
                "id": data.project_category_mappings_id
            };
            var promise = services.getCategoryWiseTechnologyList(req);
            promise.success(function (result) {
                var mainTechArray = [];
                if (result.project_category_technology_mappings) {
                    for ($i = 0; $i < result.project_category_technology_mappings.length; $i++) {
                        if (result.project_category_technology_mappings[$i]['technology']['id']) {
                            var techArray = [];
                            techArray['categories_technology_mappings_id'] = result.project_category_technology_mappings[$i]['id'];
                            techArray['id'] = result.project_category_technology_mappings[$i]['technology']['id'];

                            techArray['name'] = result.project_category_technology_mappings[$i]['technology']['name'];

                        }
                        mainTechArray.push(techArray);
                    }
                }
                Utility.stopAnimation();
                prc.technologies = mainTechArray;
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');

            });
        }
    }

    var projectId = $routeParams.id || "Unknown";
    prc.saveProjectResource = function (event) {
        if ($("#projectResourceForm").valid()) {
            var startDate = Utility.formatDate(prc.projectStartDate, "Y/m/d");
            var endDate = Utility.formatDate(prc.projectEndDate, "Y/m/d");
            var req = {
                "project_id": projectId,
                "domain_id": prc.domain_id.id,
                "technologies": prc.technology_id,
                "user_id": prc.user_id,
                "start_date": startDate,
                "due_date": endDate,
                "created_by": loggedInUser.id,
                "updated_by": loggedInUser.id,
            };

            if (prc.id) {
                req.id = prc.id;
                var promise = services.updateProjectResource(req);
            } else {
                var promise = services.saveProjectResource(req);
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                toastr.success(response.data.message);
                prc.projectResourceById();
                prc.user_id = null;
                prc.domain_id = null;
                prc.technology_id = null;
                $("#addModal").modal("hide");
            }, function myError(r) {
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
        } else {
            event.preventDefault();
            return false;
        }
    }

    //method will be called when add project Resource button is clicked to clear the form
    prc.clearForm = function () {
        applySelect2();
        /* $('#projectResourceForm')[0].reset();*/
        prc.technologies = [];
        prc.technology_id = "";
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        prc.title = "Add new project resource";
        prc.id = null;
        prc.user_id = "";
        prc.domain_id = "";
        prc.role = "";
        prc.managerStartDate = "";
        prc.managerEndDate = "";
        prc.newManagerId = "";
        prc.developerCheck = "";
        prc.projectResourceById();
        setTimeout(function () {
            setCSS();
            setData();
        }, 500);
    }

    //Method to get technology wise user and displaying in resource drop down
    prc.getProjectResource = function () {
        if ($('#technology').valid()) {
            prc.user_id = [];
            prc.resources = [];
            if (prc.technology_id.length > 0) {
                var req = {
                    "tech_id": prc.technology_id,
                    "domain_id": prc.domain_id.id
                };
                var promise = services.technologyWiseUsers(req);
                promise.success(function (result) {
                    Utility.stopAnimation();
                    if (result.data == null) {
                        prc.resources = [];
                    } else {
                        prc.resources = result.data;
                    }
                    applySelect2();
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                });
            }
        }
    }

    //Method to check is resource is valid
    prc.checkResource = function () {
        $('#projectTechnology').valid();
    }

    //Method to remove a project resource
    prc.removeResource = function (projectResourceId, index) {
        if (projectResourceId) {
            var req = {
                "id": projectResourceId
            };
            swal({
                title: "Sure?",
                text: "Delete this Resource?",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Yes",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: '#d33',
                cancelButtonText: "No",
                animation: false,
                customClass: 'animated tada'
            }).then(function () {
                var promise = services.deleteProjectResource(req);
                promise.then(function mySuccess(result) {
                    prc.projectResourceById();
                    Utility.stopAnimation();
                    toastr.success('Project resource deletion successful..');
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                });
            }).catch(swal.noop);
        }
    }

    prc.saveNewManager = function () {
        if ($("#ChangeManagerDate").valid()) {
            var oldManagerDueDate = Utility.formatDate(prc.oldManagerEndDate, "Y/m/d");
            var newManagerStartDate = Utility.formatDate(prc.managerStartDate, "Y/m/d");
            var newManagerEndDate = Utility.formatDate(prc.managerEndDate, "Y/m/d");

            var req = {
                "project_id": projectId,
                "user_id": prc.newManagerId,
                "status_id": prc.statusId,
                "start_date": newManagerStartDate,
                "due_date": newManagerEndDate,
                "old_due_date": oldManagerDueDate,
                "old_user_id": prc.oldManagerId,
                "isChecked": prc.developerCheck,
                "updated_by": loggedInUser.id,
                "created_by": loggedInUser.id,
            }

            var promise = services.updateManager(req);
            promise.then(function mySuccess(result) {
                Utility.stopAnimation();
                toastr.success('Manager updation successful..');
                $("#addManagerModal").modal("toggle");
                prc.init();
                prc.projectResourceById();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
            });
        }
    }

    prc.saveResourceDate = function () {
        if ($("#projectResourceDatesEditForm").valid() && checkValidForStart() && checkValidForEnd()) {
            //  var projectId = $location.path().split("/")[2] || "Unknown";
            var projectId = prc.projectId
            var resource_data = [];
            for (var i = 0; i < prc.project_resources.length; i++) {
                for (var j = 0; j < prc.project_resources[i].domains.length; j++) {
                    var startDate = "";
                    var endDate = "";
                    var data = {};
                    if (prc.project_resources[i].domains[j].hasOwnProperty('start_date') || prc.project_resources[i].domains[j].hasOwnProperty('due_date')) {
                        startDate = Utility.formatDate(prc.project_resources[i].domains[j].start_date, "Y/m/d");
                        endDate = Utility.formatDate(prc.project_resources[i].domains[j].due_date, "Y/m/d");
                        data = {
                            "proj_res_id": prc.project_resources[i].domains[j].project_resources_id,
                            "domain_id": prc.project_resources[i].domains[j].id,
                            "start_date": startDate,
                            "due_date": endDate
                        };
                        resource_data.push(data);
                    }
                }
            }
            var req = {
                "project_id": projectId,
                "project_res_data": resource_data
            }
            var promise = services.updateProjectDates(req);
            promise.then(function mySuccess(result) {
                Utility.stopAnimation();
                // toastr.success("Dates save successfully");
                toastr.success(result.data.message);
                $location.url("/project/view/" + projectId);
            }, function myError(r) {
                toastr.error('Sorry!');
            });
        }
    }

    prc.isDisabled = function (oldManagerID) {
        return oldManagerID == prc.oldManagerId;
    }

    prc.disableNwMngrDates = function () {
        $("#managerStartDate").css({ "cursor": "default", "background-color": "#ededed" });
        $("#managerEndDate").css({ "cursor": "default", "background-color": "#ededed" });
        $("#managerStartDate").attr("disabled", "disabled");
        $("#managerEndDate").attr("disabled", "disabled");
        $("#saveNewManagerButton").attr('disabled', true);
        // $("#saveNewManagerButton").css({"pointer-events":"auto"});
    }

    prc.enableNwMngrDates = function () {
        $("#saveNewManagerButton").attr('disabled', false);
        // $("#saveNewManagerButton").css({"pointer-events":"none"});
        $("#managerStartDate").removeAttr("disabled");
        $("#managerEndDate").removeAttr("disabled");
        $("#managerStartDate").attr("readonly", "true");
        $("#managerStartDate").css({ "cursor": "default", "background-color": "white" });
        $("#managerEndDate").attr("readonly", "true");
        $("#managerEndDate").css({ "cursor": "default", "background-color": "white" });
    }
});
