
app.controller('projectCtrl', function ($scope, $rootScope, $routeParams, pagination, RESOURCES, $http, $filter, services, $cookieStore, $location, menuService, $window, $route, AclService, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var pjc = this;
    $scope.can = AclService.can;
    pjc.title = 'Add New Project';
    pjc.id = null;
    pjc.projectName = "";
    pjc.startDate = "";
    pjc.endDate = "";
    pjc.description = "";
    pjc.projectAccess = "";
    pjc.projectOwner = "";
    pjc.projectManager = "";
    pjc.projectLead = "";
    $scope.ProjectsLists = null;
    $scope.MilestonesLists = null;
    $scope.TasksLists = null;
    pjc.clientid = null;
    pjc.projectDomain = "";
    pjc.projectTechnology = "";
    pjc.projectStatus = "Pending";
    pjc.status = "";
    pjc.milestoneCount = "";
    pjc.taskCount = "";

    pjc.totalEntries = null;
    pjc.fromValue = null;
    pjc.toValue = null;

    pjc.uniqueDomain = false;
    pjc.hgt = Math.round($window.innerHeight / 2.2);
    pjc.pageno = 0;
    pjc.limit = 0;
    // $rootScope.$emit("menuCtrlMethod",{});
    pjc.domainList = [{
        domain_name: '',
        tech_name: ''
    }];

    applySelect2();

    var loggedInUser = services.getIdentity();

    pjc.addNewProject = function () {
        $location.path('/project/add');
    };

    pjc.addNewMilestone = function () {
        $location.path('/project/milestone/add');
    };

    // Suvrat to perform copy from domain name to alias
    pjc.copyAddress = function () {
        if (pjc.copyAddress) {
            pjc.categoryAlias = angular.copy(pjc.categoryName);
        }
    };

    pjc.fetchInfo = function (data) {
        pjc.technologies = [];
        Utility.stopAnimation();
        if (pjc.projectForm.projectDomain) {
            pjc.errMessage = "";
            pjc.highlightcolor2 = "";
        }
        if (data.id > 0) {
            var req = {
                "id": data.id
            };
            var promise = services.categoryWiseTechnologyList(req);
            promise.success(function (result) {
                //categoriesTechnologyData = result.categories_technology_mappings;
                var mainTechArray = [];
                result.categories_technology_mappings = result.data.data;
                if (result.categories_technology_mappings) {
                    for ($i = 0; $i < result.categories_technology_mappings.length; $i++) {
                        if (result.categories_technology_mappings[$i]['technology']['id']) {
                            var techArray = [];
                            techArray['id'] = result.data.data[$i]['technology']['id'];
                            techArray['name'] = result.data.data[$i]['technology']['name'];
                        }
                        mainTechArray.push(techArray);
                    }
                }
                Utility.stopAnimation();
                pjc.technologies = mainTechArray;
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                //Utility.stopAnimation();
            });
        }
    };

    var viewPath = $location.path().split("/")[2] || "Unknown";

    // Suvrat Issue#2930 This routine is not needed
    // pjc.redirectToProjectView=function(url,prId){
    //     window.location.href=url+prId;
    // }

    setTimeout(function () {
        $('#table_length').on('change', function () {
            pjc.fetchList(-1);
        });
    }, 100);

    pjc.fetchList = function (page) {
        pjc.limit = $('#table_length').val();
        if (pjc.limit == undefined) {
            pjc.limit = -1;
        }
        if (page == -1) {
            pjc.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            pjc.pageno = page;
        }
        // var loggedInUser = services.getIdentity();
        var requestParam = {
            page: pjc.pageno,
            // limit:pagination.getpaginationLimit(),
            limit: pjc.limit,
            user_id: loggedInUser.id
        };

        for (var role = 0; role < loggedInUser.identity.role.length; role++) {
            if (loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') {
                requestParam.user_id = null;
                break;
            }
        }

        /* Getting all the projects and displaying in table*/
        var promise = services.getAllProjects(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data != null) {
                for (var i = 0; i < result.data.data.length; i++) {
                    result.data.data[i].start_date = Utility.formatDate(result.data.data[i].start_date);
                    result.data.data[i].due_date = Utility.formatDate(result.data.data[i].due_date);
                }
                pjc.allProjects = result.data.data;
                pjc.totalEntries = result.data.total;
                pjc.fromValue = result.data.from;
                pjc.toValue = result.data.to;
                //Suvrat store the project list in scope variable
                $scope.ProjectsLists = pjc.allProjects;
                pagination.applyPagination(result.data, pjc);
            }
            //pjc.domainList = result.data.data.domain;
        }, function myError(r) {
            toastr.error(r.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    pjc.init = function () {
        //fetch all project list
        $('#projectMain').trigger('click');
        pjc.domainTechnology = [];
        // Utility.startAnimation();
        // $scope.$root.$broadcast("myEvent", {projectName: ""});
        projectId = $routeParams.id || "Unknown";
        pjc.projectId = projectId;

        /* Getting all technologies and displaying in technology dropdown*/
        var promise = services.getAllTechnology();
        promise.success(function (result) {
            Utility.stopAnimation();
            pjc.allTechnologies = result.data.data;
        });

        /* Getting all domains and displaying in domain dropdown*/
        var promise = services.getAllCategory();
        promise.success(function (result) {
            Utility.stopAnimation();
            pjc.domains = result.data.data;
        });

        /* Getting all status and displaying in status dropdown*/
        var promise = services.getAllStatus("project");
        promise.success(function (result) {
            Utility.stopAnimation();
            pjc.status = result.data;
        });

        //Checking if we are in edit page than set the project id from edit page url
        pjc.id = $location.search()["id"];
        if (projectId == "edit") {
            projectId = pjc.id;
        }

        var path = $location.path().split("/")[2] || "Unknown";
        if (projectId > 0) {
            var promise = services.getProject(projectId);
            // Suvrat Issue#3172
            var promise2 = services.getMilestoneListByProject({ "project_id": projectId });
            promise2.success(function (result) {
                pjc.milestoneList = result.data.data;
            });

            promise.then(function mySuccess(response) {
                // Suvrat Issue#3166  Store the project name in root scope
                $rootScope.project_name = response.data.data.name;
                Utility.stopAnimation();
                pjc.projectStatusId = response.data.data.status_id;
                var startDate = Utility.formatDate(response.data.data.start_date);
                var endDate = Utility.formatDate(response.data.data.due_date);
                pjc.title = 'Update Project';
                pjc.projectName = response.data.data.name;
                // menuService.setProjectInfo({projectName:pjc.projectName,projectId:projectId});
                // $scope.projectInfo= menuService.getProjectInfo();
                // $rootScope.$emit("menuCtrlMethod",$scope.projectInfo);
                // $scope.$root.$broadcast("myEvent", {projectName: pjc.projectName});
                // $scope.$root.$broadcast("myIdEvent", {projectId: pjc.projectId});
                pjc.startDate = startDate;
                pjc.endDate = endDate;
                pjc.Old_startDate = startDate;
                pjc.Old_endDate = endDate;
                pjc.description = response.data.data.description;
                pjc.projectOwner = response.data.data.client.id;
                pjc.projectManager = response.data.data.user.id;
                pjc.projectLead = response.data.data.lead_id;
                pjc.projectManagerName = response.data.data.user.name;
                pjc.projectStatus = response.data.data.status_id;
                pjc.projectDomain = response.data.data.domain.id;
                pjc.clientName = response.data.data.client.name;
                pjc.milestoneCount = response.data.data.milestones.length;
                pjc.milestoneData = response.data.data.milestones;
                pjc.domainTechnology = pjc.getProjectDomainList(response.data.data.domain);
                var task_count = 0;
                for (i = 0; i < pjc.milestoneData.length; i++) {
                    task_count = task_count + pjc.milestoneData[i].task.length;
                }
                pjc.taskCount = task_count;
                var technologiesArr = response.data.data.technology;
                var techArr = [];
                if (technologiesArr) {
                    for ($i = 0; $i < technologiesArr.length; $i++) {
                        if (technologiesArr[$i]['id']) {
                            techArr.push(technologiesArr[$i]['id']);
                        }
                    }
                }
                setTimeout(function () {
                    pjc.description = response.data.data.description;
                    if (pjc.description && path == 'edit') {
                        CKEDITOR.instances.description.setData(pjc.description);
                    }
                }, 700);

                pjc.projectTechnology = { id: [] };
                pjc.projectTechnology.id = techArr;
                applySelect2();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }

        if (projectId != "Unknown") {
            if (projectId == "edit") {
                projectId = $location.search()["id"];
            }
            id = projectId;
            var dashboard_menu = menuService.getDashboardMenu();
            var project_menu = menuService.getProjectMenu();

            for (var i = 0; i < dashboard_menu.length; i++) {
                if (dashboard_menu[i].menu_name == 'Projects') {
                    dashboard_menu[i].url = '';
                    dashboard_menu[i].child = [];
                    dashboard_menu[i].active = 'active';
                    for (var j = 0; j < project_menu.length; j++) {
                        if (project_menu[j].menu_name !== 'Project Info') {
                            project_menu[j].active = 'deactive';
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
                        project_menu[j].projectId = id;
                        if (viewPath == "view" || projectId == "edit") {
                            if (project_menu[j].menu_name == 'Project Dashboard') {
                                project_menu[j].active = 'active';
                            } else {
                                project_menu[j].active = 'deactive';
                            }
                        }
                        dashboard_menu[i].child.push(project_menu[j]);
                    }
                } else {

                }
            }
            var menu = dashboard_menu;

            // for (var i = 0; i <menu.length; i++) {
            //      menu[i].projectId=id;
            //     if (viewPath == "view" || projectId == "edit") {
            //         if(menu[i].menu_name=='Project Dashboard'){
            //             menu[i].active='active';
            //         }else{
            //             menu[i].active='deactive';
            //         }
            //     }else if( viewPath == "info" ){
            //         var path = $location.path().split("/")[3] == "general-info"?'General Information':'Domain/Technology Information';
            //         for(var j=0;j<menu[i].child.length;j++){
            //           if(menu[i].child[j].menu_name==path){
            //               menu[i].child[j].active='active';
            //           }else{
            //               menu[i].child[j].active='deactive';
            //           }
            //         }
            //         if(menu[i].menu_name=='Project Info'){
            //             menu[i].active='active';
            //         }else{
            //             menu[i].active='deactive';
            //         }
            //     }else{
            //         menuService.setMenu([]);
            //     }

            // }
            menuService.setMenu(menu);

        } else {
            pjc.limit = $('#table_length').val();
            pjc.fetchList(-1);
            menu = menuService.getDashboardMenu();
            for (var i = 0; i < menu.length; i++) {
                if (menu[i].menu_name == 'Projects') {
                    if (menu[i].child.length > 0) {
                        menu[i].child = [];
                    }
                    menu[i].active = 'active';
                } else {
                    menu[i].active = 'deactive';
                }
            }
            menuService.setMenu(menu);
        }
    };

    pjc.init();

    pjc.addNewTask = function () {
        // $location.path('/project/task/add');
        //Suvrat Issue#3172
        pjc.resetAddTaskModal();
        $("#taskOptionModal").modal("show");
        setTimeout(function () {
            applySelect2();
            setCSS();
        }, 500);
    };

    // Suvrat Issue#3172
    pjc.resetAddTaskModal = function () {
        pjc.taskOptionSelected = "new";
        pjc.milestoneIdForTask = null;
        pjc.taskListId = null;
        // Suvrat Issue#3175
        pjc.milestoneTask = null;
        pjc.taskLst = null;
        pjc.projectIdForMilestone = null;
        //////////////////////////////////
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        applySelect2();
    };

    //Suvrat Issue#3172
    pjc.getTaskListByMilestoneID = function (id) {
        $("#milestoneLists").on("select2:close", function (e) {
            $(this).valid();
        });
        var promise = services.getTaskByMilestoneId(id);
        promise.success(function (response) {
            if (response.tasks) {
                pjc.taskListOfMilestone = response.tasks;
                applySelect2();
                $("#taskList").on("select2:close", function (e) {
                    $(this).valid();
                });
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    //Suvrat Issue#3172
    pjc.saveSelectedOption = function () {
        if ($("#taskOptionForm").valid()) {
            if (pjc.taskOptionSelected == "new") {
                $window.location.href = '/project/task/add/' + projectId;
            }
            if (pjc.taskOptionSelected == "copy_from_existing") {
                if (pjc.taskListId > 0) {
                    URL = '/project/task/add/' + projectId + '?copy=' + pjc.taskListId;
                    $window.location.href = URL;
                }
            }
            if (pjc.taskOptionSelected == "copy_from_default") {
                if (pjc.taskListId > 0) {
                    URL = '/project/task/add/' + projectId + '?copy=' + pjc.taskListId;
                    $window.location.href = URL;
                }
            }
            //Suvrat Issue#3175
            if (pjc.taskOptionSelected == "copy_from_project") {
                if (pjc.taskLst > 0) {
                    URL = '/project/task/add/' + projectId + '?copy=' + pjc.taskLst;
                    $window.location.href = URL;
                }
            }
            ////////////////////
            //Suvrat Issue#3175
            // $("#taskOptionModal").modal("hide");
            //////////////////////
            // $location.path('/project/task/add/'+projectId);
        }
    };

    /*Fetching all users for displaying dropdown of managers*/
    pjc.getUsersAndClients = function () {
        // var promise = services.getAllUsers();
        // promise.success(function (result) {
        //     Utility.stopAnimation();
        //     pjc.managers = result.data.data;
        // }, function myError(r) {
        //     toastr.error(r.data.message, 'Sorry!');
        //     Utility.stopAnimation();
        // });

        var promise = services.getAllManagersOrLeads(3);
        promise.success(function (result) {
            Utility.stopAnimation();
            pjc.managers = result.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        var promise = services.getAllManagersOrLeads(4);
        promise.success(function (result) {
            Utility.stopAnimation();
            pjc.leads = result.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        var promise = services.getAllClients();
        promise.success(function (result) {
            Utility.stopAnimation();
            var clientid = $location.search().client;
            pjc.clients = result.data.data;
            for (var i = 0; i < pjc.clients.length; i++) {
                if (clientid != '' && clientid == pjc.clients[i].id) {
                    pjc.projectOwner = clientid;
                    applySelect2();
                }
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    pjc.getUsersAndClients();

    pjc.saveProject = function () {
        if ((pjc.domainTechnology.length) == 0) {
            pjc.errMessage = 'Please select at least one domain & its technology';
            pjc.highlightcolor2 = "#dd4b39";
        } else {
            pjc.highlightcolor2 = "";
        }

        if ($("#projectAddForm").valid() && pjc.addMoreDomainTechnology()) {
            var startDate = Utility.formatDate(pjc.startDate, "Y/m/d");
            var endDate = Utility.formatDate(pjc.endDate, "Y/m/d");
            var desc = CKEDITOR.instances.description.getData();
            var mainTecAddhArray = [];
            if (pjc.domainTechnology) {
                var domainData = pjc.getDomainwithTechnologyArray(pjc.domainTechnology);
            }

            var duration = pjc.getDuration(startDate, endDate);
            var req = {
                "name": pjc.projectName,
                "user_id": pjc.projectManager, // manager_id should go into user_id
                "lead_id": pjc.projectLead,
                "client_id": pjc.projectOwner,
                "status_id": pjc.projectStatus,
                "start_date": startDate,
                "due_date": endDate,
                "revised_date": endDate,
                "duration_in_days": 0,
                "description": desc,
                "current_milestone_index": 0,
                "project_type": "new",
                "domain": domainData,
                "type": 2,
                "company_name": RESOURCES.COMPANY_NAME,
                "company_id": RESOURCES.COMPANY_ID,
                "company_start_date": null,
                "company_due_date": null,
                // "duration_in_years": duration
            };

            if (pjc.projectId > 0) {
                delete req["domain"];
                req["updated_by"] = loggedInUser.id;
                req.id = pjc.projectId;
                var forToasterTemp = false;
                var promise = services.updateProject(req);
            } else {
                req["created_by"] = loggedInUser.id;
                req["updated_by"] = loggedInUser.id;
                forToasterTemp = true;
                var promise = services.saveProject(req);
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    if (forToasterTemp) {
                        swal({
                            title: 'Project created successfully',
                            text: "Do you want to set milestone now?",
                            type: 'success',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            cancelButtonText: "Not Now",
                            confirmButtonText: "Yes",
                            animation: false,
                            customClass: 'animated tada'
                        }).then(function () {
                            window.location.href = "/project/milestone/add/" + response.data.data.id;
                        }, function (dismiss) {
                            Utility.startAnimation();
                            window.location.href = "/project";
                        });
                    } else {
                        toastr.success('Project updated successfully..');
                        if (pjc.Old_startDate != pjc.startDate || pjc.Old_endDate != pjc.endDate) {
                            $location.url("/project/edit_resource/" + response.data.data.id);
                        }
                        else {
                            $location.url("/project/view/" + response.data.data.id);
                        }
                    }
                } catch (e) {
                    toastr.error("Unable to save project..");
                    Raven.captureException(e);
                }
            }, function myError(response) {
                if (r.data.errors) {
                    if (r.data.errors.name) {
                        toastr.error(r.data.errors.name);
                    }
                } else {
                    toastr.error(r.data.message, 'Sorry!');
                }
                //toastr.error(r.data.errors.name);
                Utility.stopAnimation();
            });
        }
    };

    //Calculate duration in years by passing start & end date.
    pjc.getDuration = function (sDate, eDate) {
        // var startDate = Utility.formatDate(sDate, "Y/m/d");
        // var endDate = Utility.formatDate(eDate, "Y/m/d");
        var d1 = new Date(sDate);
        var d2 = new Date(eDate);
        if (Date.parse(d1) < Date.parse(d2)) {
            var months = d2.getMonth() - d1.getMonth() + (12 * (d2.getFullYear() - d1.getFullYear()));
            var years = Math.floor(months / 12);

            if (years != 0) {
                months = months - (years * 12);
            } else {
                months = months;
            }

            var result = years + '.' + months;
            return result;
        }
    };

    $scope.resetForm = function () {
        pjc.projectForm = {};
        $('#prstartDate').datepicker('setDate', '');
        $('#prendDate').datepicker('setDate', '');
        $("#dateSection").delegate('.date', 'focusin', function () {
            $(this).datepicker({
                autoclose: true,
                viewMode: 'days',
                todayHighlight: true
            });
        });
        CKEDITOR.instances.description.setData('', function () {
            $("div.form-group").each(function () {
                $(this).removeClass('has-error');
                $('span.help-block-error').remove();
                $('#cke_1_top,#cke_1_bottom').css('border-color', '');
            });
        });
        $scope.user = angular.copy($scope.pjc);
        pjc.projectTechnology.id = [];
        pjc.domainTechnology = [];
        pjc.checkValidation = false;
        applySelect2();
        pjc.errMessage = "";
        pjc.highlightcolor2 = "";
        pjc.technologyDomainArray = [];
    };

    //method to load status data on modal
    pjc.loadStatus = function (statusData) {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });

        pjc.changedStatus = statusData.name;
        pjc.status_comment = "";
        setTimeout(function () {
            setCSS();
        }, 500);
    };

    //method for saving changed status comment
    pjc.updateComment = function () {
        if ($("#changeStatusForm").valid()) {
            $("#updateComment").attr("disabled", "disabled");
            var req = {
                "project_id": pjc.projectId,
                "status_id": pjc.changedStatus,
                "comment": pjc.status_comment,
                "updated_by": loggedInUser.id,
                "created_by": loggedInUser.id
            };

            var promise = services.updateProjectStatus(req);
            promise.then(function mysuccess(result) {
                Utility.stopAnimation();
                toastr.success(result.data.message);
                $("#updateComment").removeAttr("disabled");
                $("#changeStatusModal").modal("hide");
                pjc.projectStatusId = result.data.data.status_id; //to be changed
            }, function myError(r) {
                Utility.stopAnimation();
                toastr.error(r.data.message, 'Sorry!');
            });
        }
    };

    pjc.newPart = function () {
        pjc.domainList.push({
            domain_name: '',
            tech_name: ''
        });
    };

    pjc.addMoreTechnologyExperirence = function () {
        if (pjc.technologyForm.technology_id && (pjc.technologyForm.duration_years >= 0) && (pjc.technologyForm.duration_months >= 0)) {
            pjc.technologyDurationArray.push(pjc.technologyForm);
            pjc.technologyForm = {};
        }

        var req = {
            "user_id": pjc.userId,
            "userTechnology": pjc.technologyDurationArray,
            "created_by": loggedInUser.id,
            "updated_by": loggedInUser.id,
        };

        var promise = services.saveUserTechnology(req);
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            toastr.success("Added Successfully ...");
            pjc.getUserwithId();
        }, function myError(response) {
            Utility.stopAnimation();
            pjc.getUserwithId();
            toastr.error("Unsuccessful..");
        });
    };

    //method will be called when final update is performed from table
    pjc.update = function () {
        pjc.temp = 0;
        var req = {
            "id": pjc.editTechArray[0].id,
            "technology": pjc.editTechArray[0].user_id,
            "technology_id": pjc.editTechArray[0].technology_id,
            "duration_months": pjc.editTechArray[0].duration_months,
            "duration_years": pjc.editTechArray[0].duration_years,
            "created_by": loggedInUser.id,
            "updated_by": loggedInUser.id
        };

        var promise = services.updateUserTechnology(req);
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            pjc.technologyForm = {};
            toastr.success("Updated successfully...");
            pjc.getUserwithId();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    //getting data from technology section and pushing into array
    pjc.projectForm = {};
    pjc.technologyDomainArray = [];
    pjc.addMoreDomainTechnology = function () {
        if ((pjc.projectForm.projectDomain)) {
            pjc.technologyDomainArray.push(pjc.projectForm);
        }
        pjc.projectForm = {};
        applySelect2();
        pjc.domainTechnology = pjc.technologyDomainArray;
        var result = pjc.checkDuplication(pjc.domainTechnology);
        if (pjc.uniqueDomain) {
            // pjc.checkValidation = "border: 1px solid red;";
            toastr.error("Domain duplication not allowed !!");
            pjc.domainTechnology.splice(-1, 1);
            return false;
        } else {
            pjc.checkValidation = "";
            return true;
        }
    };

    //Suvrat to show the add client modal
    pjc.addNewClient = function () {
        // Suvrat Issue#3350
        pjc.resetNewClientModal();
        ////////////////////
        $('#addClientModal').modal('show');
    };

    // Suvrat Issue#3350
    pjc.resetNewClientModal = function () {
        // $('input[type=text]').val('');
        pjc.companyName = null;
        pjc.contactEmail = null;
        pjc.mobileNo = null;
        pjc.address = null;
        pjc.business = null;
        pjc.bType = null;
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
    }
    ////////////////////

    // Suvrat to show the add domain modal
    pjc.addNewDomain = function () {
        //Suvrat Issue#3350
        pjc.resetNewDomainModal();
        ///////////////////
        $('#addDomainModal').modal('show');
    };

    // Suvrat Issue#3350
    pjc.resetNewDomainModal = function () {
        pjc.categoryName = null;
        pjc.categoryAlias = null;
        setTimeout(function () {
            $("#technology").val("");
            $("#technology").trigger("change");
            $('select[id=technology]').val($('select option:eq(1)').val()).trigger('change');
        }, 100);
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
    }
    ////////////////////

    pjc.checkDuplication = function (values) {
        var valueArr = values.map(function (item) {
            return item.projectDomain.id;
        });
        var isDuplicate = valueArr.some(function (item, idx) {
            if (valueArr.indexOf(item) != idx) {
                pjc.uniqueDomain = true;
            } else {
                pjc.uniqueDomain = false;
            }
        });
    };

    //Function to remove individual technology from table
    pjc.removeTableTech = function (domainId, techId) {
        if (pjc.domainTechnology[domainId].projectTechnology.length < 2) {
            pjc.domainTechnology = pjc.domainTechnology.splice(domainId, 1);
            toastr.success("Deleted successfully...");
        } else {
            pjc.domainTechnology = pjc.domainTechnology[domainId].projectTechnology.splice(techId, 1);
            toastr.success("Deleted successfully...");
        }
        pjc.addMoreDomainTechnology();
    };

    //getting data from technology section and pushing into array
    pjc.projectForm = {};
    pjc.technologyDomainArray = [];
    pjc.updateMoreDomainTechnology = function () {
        if ((pjc.projectForm.projectDomain)) {
            pjc.technologyDomainArray.push(pjc.projectForm);
        }
        pjc.projectForm = {};
        applySelect2();

        pjc.domainTechnology = pjc.technologyDomainArray;

        if (pjc.projectId) {
            var domainData = pjc.getDomainwithTechnologyArray(pjc.technologyDomainArray);
            var req = {
                "domain_id": domainData[0].id,
                "technology": domainData[0].technology,
                "project_id": pjc.projectId,
                "type": "New",
                "created_by": loggedInUser.id,
                "updated_by": loggedInUser.id
            };
            var promise = services.saveUserDomainTechnology(req);
            promise.then(function mySuccess(response) {
                pjc.init();
                domainData = [];
                pjc.technologyDomainArray = [];
                Utility.stopAnimation();
                if (response.data.data) {
                    toastr.success("Added Successfully!!");
                } else {
                    toastr.error(response.data.message);
                }
                // pjc.addMoreDomainTechnology();
            }, function myError(response) {
                Utility.stopAnimation();
                toastr.error(response.data.message);
            });
        }
    };

    //method will be called when editing domain technology data
    pjc.editDomainTech = function (data) {
        pjc.projectForm.projectDomain = data.projectDomain;
        //pjc.projectForm.projectTechnology = data.projectTechnology;
        applySelect2();
    };

    //method will be called when deleting domain technology data
    pjc.removeRowDomainTechnology = function (domainId) {
        projectId = $routeParams.id || "Unknown";
        if (projectId == "Unknown") {
            pjc.domainTechnology.splice(domainId, 1);
            // pjc.addMoreDomainTechnology();
            toastr.success("Deleted Successfully...!!");
        } else {
            var req = {
                "id": domainId
            };
            swal({
                title: "Sure?",
                text: "Delete this Domain and associated Technologies?",
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
                var promise = services.deleteDomain(req);
                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    pjc.init();
                    if (response.data.message == "Record Deleted Successfully...!!") {
                        toastr.success(response.data.message);
                    } else {
                        toastr.error(response.data.message);
                    }
                }, function myError(response) {
                    Utility.stopAnimation();
                    toastr.error(response.data.message);
                });
            }).catch(swal.noop);
        }
    };

    pjc.removeTechnology = function (projectCategoryId, techId) {
        var req = {
            "project_category_id": projectCategoryId,
            "technology_id": techId,
            "user_id": null
        };
        var promise = services.deleteIndividualTechnology(req);
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            pjc.init();
            if (response.data.message == "Record Deleted Successfully...!!") {
                toastr.success(response.data.message);
            } else {
                toastr.error(response.data.message);
            }
        }, function myError(response) {
            Utility.stopAnimation();
            toastr.error(response.data.message);
        });
    };

    //Fetching all users with it's specific id and getting its user_technology_mapping data
    pjc.getDomainwithTechnologyArray = function (data) {
        if (data) {
            var mainTecAddhArray = [];
            var technologiesArr = data;
            for ($i = 0; $i < technologiesArr.length; $i++) {
                var techArray = {};
                if (technologiesArr[$i]['projectDomain']['id']) {
                    var id = technologiesArr[$i]['projectDomain']['id'];
                    techArray["id"] = id;
                }
                var technology = technologiesArr[$i]['projectTechnology'];

                if (technology) {
                    var techIds = [];
                    // var techId = {
                    //         "id":""
                    // }
                    for ($techInd = 0; $techInd < technology.length; $techInd++) {
                        var techId = {};
                        techId.id = technology[$techInd]['id'];
                        // console.log(techId);
                        techIds.push(techId);
                        // console.log(techIds);
                    }
                    techArray["technology"] = techIds;
                }
                mainTecAddhArray.push(techArray);
            }
            return mainTecAddhArray;
        }
    };

    pjc.getProjectDomainList = function (data) {
        if (data) {
            var mainTecAddhArray = [];
            var technologiesArr = data;
            for ($i = 0; $i < technologiesArr.length; $i++) {
                var techArray = {};
                if (technologiesArr[$i]['id']) {
                    techArray["projectDomain"] = technologiesArr[$i];
                }
                techArray["projectTechnology"] = technologiesArr[$i]['technology'];
                mainTecAddhArray.push(techArray);
            }
            return mainTecAddhArray;
        }
    };

    pjc.addTechToDomain = function (domainId, projectCategoryId, existingTechnologyArray) {
        pjc.domain_idMod = domainId;
        pjc.project_category_idMod = projectCategoryId;
        pjc.technologiesForModal = [];
        pjc.technology_idMod = "";
        Utility.stopAnimation();
        if (domainId) {
            var req = {
                "id": domainId
            };

            var promise = services.categoryWiseTechnologyList(req);
            promise.success(function (result) {
                //categoriesTechnologyData = result.categories_technology_mappings;
                result.categories_technology_mappings = result.data.data;
                var mainTechArrayy = [];
                if (result.categories_technology_mappings) {
                    for ($i = 0; $i < result.categories_technology_mappings.length; $i++) {
                        if (result.categories_technology_mappings[$i]['technology']['id']) {
                            var techArray = [];
                            techArray['id'] = result.categories_technology_mappings[$i]['technology']['id'];
                            techArray['name'] = result.categories_technology_mappings[$i]['technology']['name'];
                        }
                        mainTechArrayy.push(techArray);
                    }
                }

                Utility.stopAnimation();
                pjc.technologiesForModal = mainTechArrayy;
                for ($i = 0; $i < mainTechArrayy.length; $i++) {
                    for ($j = 0; $j < existingTechnologyArray.length; $j++) {
                        if ((mainTechArrayy[$i].name) == (existingTechnologyArray[$j].name)) {
                            mainTechArrayy.splice($i, 1);
                            $i--;
                            break;
                        }
                    }
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
        setTimeout(function () {
            setCSS();
        }, 500);
    };

    //Method to save specific technology for a category from table
    pjc.saveTechToDomain = function () {
        var req = {
            "project_id": pjc.projectId,
            "project_category_id": pjc.project_category_idMod,
            "technology_id": pjc.technology_idMod,
            "created_by": loggedInUser.id,
            "updated_by": loggedInUser.id,
        };

        if (req) {
            var promise = services.saveDomainForTechnology(req);
            promise.then(function mySuccess(response) {
                pjc.init();
                $("#addTechModal").modal("hide");
                Utility.stopAnimation();
                /* if(response.data.data){
                 toastr.success("Added Successfully!!");
                 }else{*/
                toastr.success(response.data.message);
                /* }*/
                // pjc.addMoreDomainTechnology();
            }, function myError(response) {
                Utility.stopAnimation();
                toastr.error(response.data.message);
            });
        }
    };

    pjc.saveTechToDomainArray = function () {
        for (var i = 0; i < pjc.domainTechnology.length; i++) {
            if (pjc.domainTechnology[i].projectDomain.id == pjc.domain_idMod) {
                for (j = 0; j < pjc.technology_idMod.length; j++) {
                    pjc.domainTechnology[i].projectTechnology.push(pjc.technology_idMod[j]);
                }
            }
        }
        $("#addTechModal").modal("hide");
        toastr.success("Added Successfully!!");
    };

    // Suvrat add a new domain from modal
    pjc.saveCategory = function () {
        if ($("#domainForm").valid()) {
            var req = {
                "name": pjc.categoryName,
                "alias": pjc.categoryAlias,
                "technology": pjc.technology
            };
            cat_name = pjc.categoryName;
            var promise = services.saveCategory(req);
            promise.then(function mySuccess(response) {
                var promise2 = services.getAllCategory();
                promise2.success(function (result) {
                    Utility.stopAnimation();
                    pjc.domains = result.data.data;
                });
                Utility.stopAnimation();
                toastr.success('Category created successfully!');
                $('#addDomainModal').modal('hide');
                $(".modal-body input").val("");
                pjc.technology = [];
                applySelect2();
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

    // Suvrat add a new client from modal
    pjc.createClient = function () {
        if ($("#clientForm").valid()) {
            var req = {
                "name": pjc.companyName,
                "mobile": pjc.mobileNo.replace(/\s+/g, ''),
                "pincode": 789789,
                "tel_number": 7777777777,
                "city": "Nagpur",
                "state": "Maharashtra",
                "country": "India",
                "address": pjc.address,
                "type": pjc.bType,
                "business": pjc.business,
                "email": pjc.contactEmail,
                "created_by": loggedInUser.id,
                "updated_by": loggedInUser.id
            };

            promise = services.saveClient(req);
            operationMessage = " created ";
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    toastr.success('Client' + operationMessage + 'successfully..');
                    var promise = services.getAllClients();
                    promise.success(function (result) {
                        Utility.stopAnimation();
                        var clientid = $location.search().client;
                        pjc.clients = result.data.data;
                        for (var i = 0; i < pjc.clients.length; i++) {
                            if (clientid != '' && clientid == pjc.clients[i].id) {
                                pjc.projectOwner = clientid;
                                applySelect2();
                            }
                        }
                    }, function myError(r) {
                        toastr.error(r.data.message, 'Sorry!');
                        Utility.stopAnimation();
                    });
                    $('#addClientModal').modal('hide');
                    $(".modal-body input").val("");
                    $(".modal-body textarea").val("");
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

    //Suvrat get milestone list by project id
    $scope.getMilestoneListID = function (arg) {
        Utility.startAnimation();
        var promise = services.getMilestoneListByProject({ "project_id": arg });
        promise.success(function (result) {
            pjc.milestoneList = result.data.data;
            $scope.MilestonesLists = pjc.milestoneList;
            applySelect2();
            Utility.stopAnimation();
        });
        Utility.stopAnimation();
    }

    $scope.getTasksFromMilestone = function (arg) {
        Utility.startAnimation();
        var promise = services.getTaskByMilestoneId(arg);
        promise.success(function (response) {
            pjc.taskListOfMilestone = response.tasks;
            $scope.TasksLists = pjc.taskListOfMilestone;
            applySelect2();
            Utility.stopAnimation();
        });
        Utility.stopAnimation();
    }

    $scope.dismissModal = function () {
        $('.modal').modal('hide');
        $('select').val($('select option:eq(1)').val()).trigger('change');
    }

    $scope.show = function (x) {
        return x.id > 1;
    };

    pjc.scrollbarSetting = function () {
        $("html, body").animate({ scrollTop: 0 }, "fast");
    };
    //Download PDF
    pjc.download = function (id) {
        var promise = services.download('project', id);
    };

    // Suvrat Issue#3175
    pjc.getProjectList = function () {
        $("#projectLists").on("select2:close", function (e) {
            $(this).valid();
        });
        var requestParam = {
            page: 1,
            limit: -1
        };
        var promise = services.getAllProjects(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data != null) {
                for (var i = 0; i < result.data.data.length; i++) {
                    result.data.data[i].start_date = Utility.formatDate(result.data.data[i].start_date);
                    result.data.data[i].due_date = Utility.formatDate(result.data.data[i].due_date);
                }
                pjc.projectList = result.data.data;
            }
            $("#projectLists").on("select2:close", function (e) {
                $(this).valid();
            });
        }, function myError(r) {
            toastr.error(r.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    pjc.getMilestoneForProject = function (project) {
        $("#milestoneLst").on("select2:close", function (e) {
            $(this).valid();
        });
        var promise = services.getMilestoneListByProject({ "project_id": project });
        promise.success(function (result) {
            pjc.projectMilestone = result.data.data;
            applySelect2();
            $("#milestoneLst").on("select2:close", function (e) {
                $(this).valid();
            });
        });
        Utility.stopAnimation();
    };

    pjc.getTaskForMilestone = function (milestone) {
        $("#taskLst").on("select2:close", function (e) {
            $(this).valid();
        });
        var promise = services.getTaskByMilestoneId(milestone);
        promise.success(function (response) {
            if (response.tasks) {
                pjc.milestoneTaskL = response.tasks;
                applySelect2();
                $("#taskLst").on("select2:close", function (e) {
                    $(this).valid();
                });
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };
    ////////////////////

});