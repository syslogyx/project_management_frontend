app.controller('resourceMatrixCtrl', function ($scope, $rootScope, AclService, pagination, RESOURCES, $http, $filter, services, $location, menuService, sidebarFactory, menuService, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var rmx = this;
    $scope.can = AclService.can;
    rmx.pageno = 0;
    rmx.limit = 0;

    $scope.componentBodyData;
    rmx.formEditWorkDate = {
        endDate: null,
        remark: null,
        userId: null,
        projectId: null,
    }
    // $rootScope.$emit("menuCtrlMethod",{});
    //method will be called when filter find is clicked
    rmx.matrixForm = {};
    rmx.matrixFilterArray = [];
    rmx.matrixForm.technology = [];
    rmx.userList = [];

    rmx.totalEntries = null;
    // $rootScope.$emit("menuCtrlMethod",{});

    // var menu=menuService.getResourceMatrixMenu();
    var menu = menuService.getDashboardMenu();
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'Resource Matrix') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }
    menuService.setMenu(menu);

    rmx.months = [
        { id: 0, name: "0 month" },
        { id: 1, name: "1 month" },
        { id: 2, name: "2 months" },
        { id: 3, name: "3 months" },
        { id: 4, name: "4 months" },
        { id: 5, name: "5 months" },
        { id: 6, name: "6 months" },
        { id: 7, name: "7 months" },
        { id: 8, name: "8 months" },
        { id: 9, name: "9 months" },
        { id: 10, name: "10 months" },
        { id: 11, name: "11 months" }
    ];
    rmx.years = [
        { id: 0, name: "0 year" },
        { id: 1, name: "1 year" },
        { id: 2, name: "2 years" },
        { id: 3, name: "3 years" },
        { id: 4, name: "4 years" },
        { id: 5, name: "5 years" },
        { id: 6, name: "6 years" },
        { id: 7, name: "7 years" },
        { id: 8, name: "8 years" },
        { id: 9, name: "9 years" },
        { id: 10, name: "10 years" },
        { id: 11, name: "11 years" },
        { id: 12, name: "12 years" }
    ];
    rmx.projectStatus = [
        //        {id: "", name: ""},
        { id: "active", name: "Active" },
        { id: "deactive", name: "Deactive" }
    ];

    //Suvrat Issue#2930: Routine no longer needed
    // rmx.redirectToProjectView=function(url,prId){
    //     window.location.href=url+prId;
    // }

    rmx.showActiveTab = function () {
        $('.showDeactive').removeClass('active');
        $('.showActive').addClass('active');
    }

    rmx.showActiveTechTab = function () {
        $('.showDeactive').removeClass('active');
        $('.showActive').removeClass('active');
        $('.showTech').addClass('active');
    }

    rmx.showMore = function (data, title) {
        if ($(".sm_container").is(":visible")) {
            $(".sm_container").hide();
        } else {
            $(".sm_container").show();
        }

        templateData = {
            "title": title,
            "data": [
                {
                    name: "User Info",
                    id: "userInfo",
                    icon: "mdi mdi-account-circle",
                    data: data
                },
                {
                    name: "Projects",
                    id: "projects",
                    icon: "fa fa-file-powerpoint-o",
                    data: data.project
                },
                {
                    name: "Technology",
                    id: "technology",
                    icon: "fa fa-code",
                    data: data.technology
                },
                {
                    name: "Activity Log",
                    id: "activityLog",
                    icon: "mdi mdi-view-headline",
                    data: data.resource_matrix_log
                }
            ],
            "template": "resourceMatrix"
        };
        $rootScope.$broadcast('templateData', templateData);
    }

    rmx.fetchList = function (page) {
        if (page == -1) {
            rmx.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            rmx.pageno = page;
        }
        var requestParam = {
            page: rmx.pageno,
            limit: pagination.getpaginationLimit(),
        }

        var blankForm = {};

        //Suvrat Issue#2697
        var p2 = services.searchWithFilter(blankForm, { page: -1, limit: -1 });
        p2.success(function (response) {
            rmx.totalEntries = response.data.length;
        });
        ////////////////////////////

        var promise = services.searchWithFilter(blankForm, requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            $scope.convertWorkEndDate(result.data);
            rmx.userArrayList = result.data;
            $scope.converttimeAlloDueDate(rmx.userArrayList);
            // pagination.applyPagination(result.data, rmx);
        });
    }


    /* function for getting the list of all users*/
    rmx.init = function () {
        rmx.fetchList(-1);
        rmx.limit = pagination.getpaginationLimit();
        // $scope.$root.$broadcast("myEvent", {});
        // Getting all the Users name and displaying in table
        var promise = services.getAllUsers();
        promise.success(function (result) {
            Utility.stopAnimation();
            try {
                var userArray = result.data.data;
                angular.forEach(userArray, function (value, key) {
                    angular.forEach(userArray[key].user_technology_mapping, function (value2, key2) {
                        var month = value2.duration_in_month;
                        var years = Math.floor(month / 12);
                        month = month % 12;
                        userArray[key].user_technology_mapping[key2]["duration"] = month + " month & " + years + " year";
                    });
                });
                rmx.userList = userArray;
            } catch (e) {
                Raven.captureException(e)
            }
        });


        //Getting all project list and displaying in dropdown
        var promise = services.getAllProjects();
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data != null) {
                rmx.projectList = result.data.data;
            }

        });
        //Getting all technology list and displaying in dropdown
        var promise = services.getAllTechnology();
        promise.success(function (result) {
            Utility.stopAnimation();
            rmx.technologyList = result.data.data;
        });
        //Getting all technologyGroup list and displaying in dropdown
        var promise = services.getAllCategory();
        promise.success(function (result) {
            Utility.stopAnimation();
            rmx.categoryList = result.data.data;
        });
    }

    rmx.fetchInfo = function (data) {
        rmx.technologyList = [];
        if (data) {
            var req = {
                "id": data
            };
            var promise = services.multipleCategoryWiseTechnologyList(req);
            promise.success(function (result) {
                categoriesTechnologyData = result.categories_technology_mappings;
                // result.categories_technology_mappings=result.data.data;
                var mainTechArray = [];
                if (result.categories_technology_mappings) {
                    for ($i = 0; $i < result.categories_technology_mappings.length; $i++) {
                        if (result.categories_technology_mappings[$i]['technology']['id']) {
                            var techArray = [];
                            techArray['id'] = result.categories_technology_mappings[$i]['technology']['id'];
                            techArray['name'] = result.categories_technology_mappings[$i]['technology']['name'];
                        }
                        mainTechArray.push(techArray);
                    }
                    rmx.technologyList = mainTechArray;
                } else {
                    rmx.technologyList = result.technologies;
                }
                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                //Utility.stopAnimation();
            });
        }
    }

    rmx.init();
    rmx.findWithFilter = function () {
        if ($("#filterDataForm").valid()) {
            if (rmx.matrixForm.project && rmx.matrixForm.project.length > 0 && rmx.matrixForm.name !== null) {
                if (rmx.matrixForm.name == "active" || rmx.matrixForm.name == "deactive") {
                    rmx.matrixForm["status"] = {
                        "name": rmx.matrixForm["name"],
                        "project": rmx.matrixForm["project"]
                    }
                    rmx.matrixForm.name == "";
                }
            }

            if (rmx.matrixForm.hasOwnProperty("duration")) {
                if (rmx.matrixForm.duration.hasOwnProperty("start_year")) {

                } else {
                    rmx.matrixForm.duration.start_year = 0;
                }
                if (rmx.matrixForm.duration.hasOwnProperty("start_month")) {

                } else {
                    rmx.matrixForm.duration.start_month = 0;
                }

                if (rmx.matrixForm.duration.start_year == 0 && rmx.matrixForm.duration.start_month == 0) {
                    rmx.matrixForm.duration = {};
                }
            }
            var promise = services.searchWithFilter(rmx.matrixForm);
            promise.then(function mySucces(res) {
                Utility.stopAnimation();
                try {
                    if (res.data != null) {
                        $scope.convertWorkEndDate(res.data.data);
                        rmx.userArrayList = res.data.data;
                        $scope.converttimeAlloDueDate(rmx.userArrayList);
                        rmx.matrixForm["status"] = {};
                    }
                    if (res.data.data.length == 0) {
                        toastr.error("No matching results found.", 'Sorry!');
                    }
                } catch (e) {
                    Raven.captureException(e)
                }
            });
        }
    }

    rmx.loadDueDate = function (userId, projectId, currentWorkEndDate, domainId, proDueDate) {
        rmx.proDueDate = "";
        rmx.formEditWorkDate.userId = userId;
        rmx.formEditWorkDate.projectId = projectId;
        rmx.formEditWorkDate.domainId = domainId;
        rmx.formEditWorkDate.endDate = currentWorkEndDate;
        rmx.formEditWorkDate.remark = null;
        rmx.workEndDate = rmx.formEditWorkDate.endDate; //this is only for setting value to date picker input element
        var r = proDueDate;
        var pdate = proDueDate.split(" ", 1)
        rmx.proDueDate = new Date(pdate[0]);
        $("#dateChangeModal").modal("toggle");
        $('#end_Date').datepicker('setEndDate', rmx.proDueDate);
        $('#end_Date').datepicker('setDate', rmx.workEndDate);
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        $('.error').hide();
        setTimeout(function () {
            setCSS();
        }, 500)
    }

    rmx.updateDueDate = function () {
        var modalReq = {
            "project_id": rmx.formEditWorkDate.projectId,
            "user_id": rmx.formEditWorkDate.userId,
            "due_date": Utility.formatDate(rmx.formEditWorkDate.endDate, "Y/m/d"),
            "remark": rmx.formEditWorkDate.remark,
            "domain_id": rmx.formEditWorkDate.domainId
        }

        if ($("#formEditWorkDate").valid()) {
            $("#updateDueDateBtn").attr("disabled", "disabled");
            var promise = services.addResourceMatrixLog(modalReq);
            promise.then(function mySuccess(r) {
                Utility.stopAnimation();
                try {
                    var cnt = rmx.userArrayList.length;
                    for (var i = 0; i < cnt; i++) {
                        if (rmx.userArrayList[i]["id"] == rmx.formEditWorkDate.userId) {
                            var cnt1 = rmx.userArrayList[i]["project"].length;
                            for (var j = 0; j < cnt1; j++) {
                                if (rmx.userArrayList[i]["project"][j]["id"] == rmx.formEditWorkDate.projectId) {
                                    rmx.userArrayList[i]["project"][j]["work_end_date"] = rmx.formEditWorkDate.endDate; //y/m/d
                                    rmx.userArrayList[i]["project"][j]["work_end_date_old"] = rmx.formEditWorkDate.endDate.split("/").join("-");
                                    break;
                                }
                            }
                            break;
                        }
                    }

                    $("#dateChangeModal").modal("hide");
                    $("#updateDueDateBtn").removeAttr("disabled");
                    toastr.success("Date saved successfully..");
                    //calling filter agian so that activity task log gets updated
                    var blankForm = {};
                    var promise = services.searchWithFilter(blankForm);
                    promise.success(function (result) {
                        Utility.stopAnimation();
                        $scope.convertWorkEndDate(result.data);
                        rmx.userArrayList = result.data;
                        $scope.converttimeAlloDueDate(rmx.userArrayList);
                    });
                } catch (e) {
                    Raven.captureException(e);
                }
            }, function myError(response) {
                // console.log(response.data);
            });
        }
    }

    $scope.converttimeAlloDueDate = function (allData) {
        angular.forEach(allData, function (value, key) {
            angular.forEach(value.project, function (value1, key1) {
                angular.forEach(value1.time_allocation_log, function (value2, key2) {
                    var edate = Utility.formatDate(value2.due_date);
                    value2.due_date = edate;
                });
            });
        });
    }

    $scope.convertWorkEndDate = function (allData) {
        angular.forEach(allData, function (value, key) {
            angular.forEach(value.project, function (value1, key1) {
                value1.work_end_date_old = value1.work_end_date;
                var work_end_date = Utility.formatDate(value1.work_end_date);
                value1.work_end_date = work_end_date;
            });
        });
    }

    //method to clear filter dropdown if duration checkbox is unchecked
    rmx.clearDuration = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        $(".error").hide();
        if (rmx.matrixForm.hasOwnProperty("duration") && rmx.matrixForm.duration.start_year) {
            rmx.matrixForm.duration.start_year = 0;
        }
        if (rmx.matrixForm.hasOwnProperty("duration") && rmx.matrixForm.duration.start_month) {
            rmx.matrixForm.duration.start_month = 0;
        }
    }

    $scope.changeColor = function (name) {
        if (name == "Onhold") {
            $scope.color = "Onhold";
        } else if (name == "Ongoing") {
            $scope.color = "Ongoing";
        } else if (name == "Pending") {
            $scope.color = "Pending";
        } else if (name == "Closed") {
            $scope.color = "Closed";
        }
        return $scope.color;
    }

    //method for refreshing the filter form
    rmx.refreshfilter = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        $(".error").hide();
        $('#filterDataForm')[0].reset();
        rmx.duration = false;
        rmx.matrixForm.project = [];
        rmx.matrixForm.technology_group = [];
        rmx.matrixForm.technology = [];
        rmx.matrixForm.name = "";
        applySelect2();
        rmx.matrixForm = {};
        var promise = services.searchWithFilter(rmx.matrixForm);
        promise.success(function (result) {
            Utility.stopAnimation();
            $scope.convertWorkEndDate(result.data);
            rmx.userArrayList = result.data;
            $scope.converttimeAlloDueDate(rmx.userArrayList);
        });
    }
    //method for reset duration
    rmx.resetDuration = function () {
        if (rmx.matrixForm.technology.length <= 0) {
            if (rmx.matrixForm.hasOwnProperty("duration") && rmx.matrixForm.duration.start_year) {
                rmx.matrixForm.duration.start_year = 0;
            }
            if (rmx.matrixForm.hasOwnProperty("duration") && rmx.matrixForm.duration.start_month) {
                rmx.matrixForm.duration.start_month = 0;
            }
            $('#durationCB').prop('checked', false);
        }
    }

    // rmx.proDatePicker(due_date){
    //             rmx.proDueDate = due_date;
    //             $("#dateChangeModal").modal("toggle");
    //             $('#end_Date').datepicker('setEndDate', rmx.proDueDate);
    // }

});
