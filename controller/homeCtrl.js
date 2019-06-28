app.controller('homeCtrl', function ($scope, AclService, menuService, services, $cookieStore, $rootScope, breadcrumbs, pagination) {

    $scope.breadcrumbs = breadcrumbs;
    var hme = this;
    hme.name = "";
    hme.istrue = false;
    hme.isopen = true;
    $scope.breadcrumbs = breadcrumbs;
    $scope.can = AclService.can;
    // $rootScope.$emit("menuCtrlMethod",{});

    hme.projectName = null;
    hme.taskStatusName = null;
    hme.taskAssignedTo = null;
    hme.taskAssignedBy = null;
    hme.taskType = "assigned_to_me";
    hme.taskInfo = [];
    hme.sort_by = "latest_update";

    hme.remark = null;
    hme.taskId = null;
    hme.totalEntries = null;
    hme.fromValue = null;
    hme.toValue = null;

    var loggedInUser = services.getIdentity();
    hme.userId = loggedInUser.id;

    // To draw menus
    // $scope.$root.$broadcast("myEvent", {projectName: ""});
    var menu = menuService.getDashboardMenu();
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'Dashboard') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }
    menuService.setMenu(menu);

    hme.dashboardContent = menuService.getDashboardContentMenu();
    // menus end

    setTimeout(function () {
        $('#table_length').on('change', function () {
            hme.getTaskInfo(hme.taskType);
        });
    }, 100);

    hme.init = function () {
        setTimeout(function () {
            hme.limit = $('#table_length').val();
        }, 100);
        // $scope.$root.$broadcast("myEvent", {});
        var token = services.getAuthKey();
        hme.name = loggedInUser.identity.name;
        hme.designation = loggedInUser.identity.designation;

        // for projects
        var promise = services.getFiveProjectListResouceWise();
        promise.success(function (result) {
            // Utility.stopAnimation();
            if (result.data != null) {
                var PieData = [];
                for (var i = 0; i < result.data.length; i++) {
                    if (i == 0) {
                        obj = {
                            value: result.data[i]["count"],
                            color: '#f56954',
                            highlight: '#f56954',
                            Browser: result.data[i]["name"],
                            label: result.data[i]["resource_desc"],
                            id: result.data[i]["resource_ids"],
                        };
                        PieData.push(obj);
                    } else if (i == 1) {
                        obj = {
                            value: result.data[i]["count"],
                            color: '#00a65a',
                            highlight: '#00a65a',
                            Browser: result.data[i]["name"],
                            label: result.data[i]["resource_desc"],
                            id: result.data[i]["resource_ids"]
                        };
                        PieData.push(obj);
                    } else if (i == 2) {
                        obj = {
                            value: result.data[i]["count"],
                            color: '#f39c12',
                            highlight: '#f39c12',
                            Browser: result.data[i]["name"],
                            label: result.data[i]["resource_desc"],
                            id: result.data[i]["resource_ids"]
                        };
                        PieData.push(obj);
                    } else if (i == 3) {
                        obj = {
                            value: result.data[i]["count"],
                            color: '#00c0ef',
                            highlight: '#00c0ef',
                            Browser: result.data[i]["name"],
                            label: result.data[i]["resource_desc"],
                            id: result.data[i]["resource_ids"]
                        };
                        PieData.push(obj);
                    } else if (i == 4) {
                        obj = {
                            value: result.data[i]["count"],
                            color: '#3c8dbc',
                            highlight: '#3c8dbc',
                            Browser: result.data[i]["name"],
                            label: result.data[i]["resource_desc"],
                            id: result.data[i]["resource_ids"]
                        };
                        PieData.push(obj);
                    } else if (i == 5) {
                        obj = {
                            value: result.data[result.data.length - 1]["other_data"]["resource_remaining_count"],
                            color: '#d3d8df',
                            highlight: '#d3d8df',
                            Browser: 'Others (' + result.data[result.data.length - 1]["other_data"]["project_remaining_count"] + ')',
                            label: result.data[result.data.length - 1]["other_data"]["project_remaining_name"],
                            // label : result.data[i]["resource_desc"],
                            id: result.data[i]["resource_ids"]
                        };
                        PieData.push(obj);
                    }
                }
                $scope.proj_data = PieData;

                var toolTipCustomFormatFn = function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                    var dataItem = PieData[itemIndex];
                    for (i = 0; i < dataItem.label.length; i++) {
                        var temp = "<a href = '/user/info/" + dataItem.id[i] + "'>" + dataItem.label[i] + "</a>";
                        dataItem.label[i] = temp;
                    }
                    return "<div style='text-align:left'>" + dataItem.label.join(", <br/> ") + "</div>";
                };

                //Suvrat Issue#2817 Fix charts layout and legeng placement

                if (screen.width >= 320 && screen.width <= 360) {
                    var settings = {
                        title: "Projects",
                        description: "",
                        showToolTips: true,
                        enableAnimations: true,
                        showLegend: true,
                        showBorderLine: true,
                        legendLayout: { left: 320, top: 150, width: 150, height: 300, flow: 'vertical' },
                        padding: { left: 5, top: 5, right: 5, bottom: 5 },
                        titlePadding: { left: 0, top: 50, right: 30, bottom: 10 },
                        source: PieData,
                        colorScheme: 'scheme02',
                        seriesGroups:
                            [
                                {
                                    type: 'donut',
                                    offsetX: 110,
                                    showLabels: true,
                                    toolTipFormatFunction: toolTipCustomFormatFn,
                                    series:
                                        [
                                            {
                                                dataField: 'value',
                                                displayText: 'Browser',
                                                labelRadius: 70,
                                                initialAngle: 15,
                                                radius: 100,
                                                innerRadius: 35,
                                                centerOffset: 0,
                                                formatSettings: { decimalPlaces: 0 }
                                            }
                                        ]
                                }
                            ]
                    };
                } else if (screen.width > 360 && screen.width <= 370) {
                    var settings = {
                        title: "Projects",
                        description: "",
                        showToolTips: true,
                        enableAnimations: true,
                        showLegend: true,
                        showBorderLine: true,
                        legendLayout: { left: 320, top: 150, width: 150, height: 300, flow: 'vertical' },
                        padding: { left: 5, top: 5, right: 5, bottom: 5 },
                        titlePadding: { left: 0, top: 50, right: 30, bottom: 10 },
                        source: PieData,
                        colorScheme: 'scheme02',
                        seriesGroups:
                            [
                                {
                                    type: 'donut',
                                    offsetX: 130,
                                    showLabels: true,
                                    toolTipFormatFunction: toolTipCustomFormatFn,
                                    series:
                                        [
                                            {
                                                dataField: 'value',
                                                displayText: 'Browser',
                                                labelRadius: 70,
                                                initialAngle: 15,
                                                radius: 120,
                                                innerRadius: 35,
                                                centerOffset: 0,
                                                formatSettings: { decimalPlaces: 0 }
                                            }
                                        ]
                                }
                            ]
                    };
                } else if (screen.width > 370) {
                    var settings = {
                        title: "Projects",
                        description: "",
                        showToolTips: true,
                        enableAnimations: true,
                        showLegend: true,
                        showBorderLine: true,
                        legendLayout: { left: 320, top: 200, width: 150, height: 300, flow: 'vertical' },
                        padding: { left: 5, top: 5, right: 5, bottom: 5 },
                        titlePadding: { left: 0, top: 50, right: 0, bottom: 10 },
                        source: PieData,
                        colorScheme: 'scheme02',
                        seriesGroups:
                            [
                                {
                                    type: 'donut',
                                    offsetX: 150,
                                    showLabels: true,
                                    toolTipFormatFunction: toolTipCustomFormatFn,
                                    series:
                                        [
                                            {
                                                dataField: 'value',
                                                displayText: 'Browser',
                                                labelRadius: 70,
                                                initialAngle: 15,
                                                radius: 120,
                                                innerRadius: 35,
                                                centerOffset: 0,
                                                formatSettings: { decimalPlaces: 0 }
                                            }
                                        ]
                                }
                            ]
                    };
                }

                if ($scope.can('user.dashboard.content.projects')) {
                    // setup the chart
                    $('#chartContainer').jqxChart(settings);
                }

                // $('#chartContainer').find('.jqx-chart-legend-text').each(function(){
                //   if($(this).attr('opacity')=='0.5'){
                //      $(this).attr({'cursor':'','x':'130','y':'295'});
                //       $(this).css({'cursor':'pointer','color':'blue','font-size': '18px','font-weight':'700'});
                //     $(this).html('<a href="/dashboard-projects" style="color:blue;text-decoration: none;outline: 0;">View</a>');
                //   }

                // })
            }
        }, function myError(r) {
            toastr.error(r.message, 'Sorry!');
            Utility.stopAnimation();
        });

        //for resource matrix
        var promise = services.getCategoryListwithResouceCount();
        promise.success(function (result) {
            // Utility.stopAnimation();
            if (result.data != null) {
                var PieData = result.data;
                for (var i = 0; i < PieData.length; i++) {
                    PieData[i]["Browser"] = result.data[i]["name"] + ' (' + result.data[i]["count"] + ')';
                    if (result.data[i]["count"] == 0) {
                        result.data[i]["count"] = "";
                    }
                }

                $scope.proj_data = PieData;
                var toolTipCustomFormatFn = function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                    var dataItem = PieData[itemIndex];
                    for (i = 0; i < dataItem.user_name.length; i++) {
                        var temp = "<a href = '/user/info/" + dataItem.user_ids[i] + "'>" + dataItem.user_name[i] + "</a>";
                        dataItem.user_name[i] = temp;
                    }
                    return "<div style='text-align:left'>" + dataItem.user_name.join(",<br/> ") + "</div>";
                };

                //Suvrat Issue#2817 Fix charts layout and legend placement
                if (screen.width >= 320 && screen.width <= 360) {
                    var settings = {
                        title: "Resource Matrix",
                        description: "",
                        enableAnimations: true,
                        showLegend: true,
                        showBorderLine: true,
                        legendLayout: { left: 320, top: 150, width: 150, height: 300, flow: 'vertical' },
                        padding: { left: 5, top: 5, right: 5, bottom: 5 },
                        titlePadding: { left: 0, top: 50, right: 30, bottom: 10 },
                        source: PieData,
                        colorScheme: 'scheme01',
                        seriesGroups:
                            [
                                {
                                    type: 'donut',
                                    offsetX: 110,
                                    showLabels: true,
                                    toolTipFormatFunction: toolTipCustomFormatFn,
                                    series:
                                        [
                                            {
                                                dataField: 'count',
                                                displayText: 'Browser',
                                                labelRadius: 70,
                                                initialAngle: 15,
                                                radius: 100,
                                                innerRadius: 35,
                                                centerOffset: 0,
                                                formatSettings: { decimalPlaces: 0 }
                                            }
                                        ]
                                }
                            ]
                    };
                } else if (screen.width > 360 && screen.width <= 370) {
                    var settings = {
                        title: "Resource Matrix",
                        description: "",
                        enableAnimations: true,
                        showLegend: true,
                        showBorderLine: true,
                        legendLayout: { left: 320, top: 150, width: 150, height: 300, flow: 'vertical' },
                        padding: { left: 5, top: 5, right: 5, bottom: 5 },
                        titlePadding: { left: 0, top: 50, right: 30, bottom: 10 },
                        source: PieData,
                        colorScheme: 'scheme01',
                        seriesGroups:
                            [
                                {
                                    type: 'donut',
                                    offsetX: 130,
                                    showLabels: true,
                                    toolTipFormatFunction: toolTipCustomFormatFn,
                                    series:
                                        [
                                            {
                                                dataField: 'count',
                                                displayText: 'Browser',
                                                labelRadius: 70,
                                                initialAngle: 15,
                                                radius: 120,
                                                innerRadius: 35,
                                                centerOffset: 0,
                                                formatSettings: { decimalPlaces: 0 }
                                            }
                                        ]
                                }
                            ]
                    };
                } else if (screen.width > 370) {
                    var settings = {
                        title: "Resource Matrix",
                        description: "",
                        enableAnimations: true,
                        showLegend: true,
                        showBorderLine: true,
                        legendLayout: { left: 320, top: 120, width: 150, height: 300, flow: 'vertical' },
                        padding: { left: 5, top: 5, right: 5, bottom: 5 },
                        titlePadding: { left: 0, top: 50, right: 0, bottom: 10 },
                        source: PieData,
                        colorScheme: 'scheme01',
                        seriesGroups:
                            [
                                {
                                    type: 'donut',
                                    offsetX: 150,
                                    showLabels: true,
                                    toolTipFormatFunction: toolTipCustomFormatFn,
                                    series:
                                        [
                                            {
                                                dataField: 'count',
                                                displayText: 'Browser',
                                                labelRadius: 70,
                                                initialAngle: 15,
                                                radius: 120,
                                                innerRadius: 35,
                                                centerOffset: 0,
                                                formatSettings: { decimalPlaces: 0 }
                                            }
                                        ]
                                }
                            ]
                    };
                }

                if ($scope.can('user.dashboard.content.resourcematrix')) {
                    // setup the chart
                    // $('#chartContainer').jqxChart(settings);
                    $('#chartContainer1').jqxChart(settings);
                }

                // $('#chartContainer').find('.jqx-chart-legend-text').each(function(){
                //     var cthis=this;
                //     var count=1;
                //      if($(cthis).attr('opacity')!='0.5'){
                //         // $(this).attr({'cursor':'','x':'130','y':'295'});
                //         //$(this).css({'display':'none'});
                //         if(count==1){
                //         $(cthis).wrap("<a href='#'>"+$(cthis).parent().html()+"</a>");
                //         }
                //         count++;
                //         //$(cthis).wrap("<a href='#'>"+$(cthis).parent().html()+"</a>");   
                //         // $(this).html('<a href="/dashboard-projects" style="color:blue;text-decoration: none;outline: 0;">View</a>');
                //     }
                //   })
            }
        }, function myError(r) {
            toastr.error(r.message, 'Sorry!');
            Utility.stopAnimation();
        });

        //for project Highlights
        var promise = services.getProjectHighlights();
        promise.success(function (result) {
            // Utility.stopAnimation();
            if (result.data != null) {
                hme.projectHighlightData = result.data.data;
                // var POCstring ='';
                // for(var j=0;j<hme.projectHighlightData.length;j++){
                //   for(var i=0;i<hme.projectHighlightData[j].project_poc.length;i++){
                //     POCstring = POCstring+hme.projectHighlightData[j].project_poc[i].name+',';
                //   }
                //   hme.projectHighlightData[j].POCString =  POCstring;
                // }
                // console.log(hme.projectHighlightData);
            }
        }, function myError(r) {
            toastr.error(r.message, 'Sorry!');
            Utility.stopAnimation();
        });

        hme.limitP = 200;
        hme.pagenoP = 1;

        var requestParam = {
            page: hme.pagenoP,
            limit: hme.limitP,
            user_id: loggedInUser.id
        }

        for (var role = 0; role < loggedInUser.identity.role.length; role++) {
            if (loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') {
                requestParam.user_id = null;
                break;
            }
        }

        /* Getting all the projects and displaying in table*/
        var promise = services.getAllProjects(requestParam);
        promise.success(function (result) {
            if (result.data != null) {
                hme.allProjects = result.data.data;
            }
        }, function myError(r) {
            toastr.error(r.message, 'Sorry!');
            Utility.stopAnimation();

        });

        var promise = services.getAllStatus("task");
        promise.success(function (result) {
            hme.taskStatus = result.data;
        });

        /* Getting all users and displaying in task assign_to dropdown*/
        var promise = services.getAllUsersDataWithoutPagination();
        promise.success(function (response) {
            if (response.data) {
                hme.userList = response.data.data;
                Utility.stopAnimation();
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        /* Getting users list and displaying in task assign_by dropdown*/
        var promise = services.getAllTaskCreationUsersList();
        promise.success(function (response) {
            if (response.data) {
                hme.taskCreationUserList = response.data;
                Utility.stopAnimation();
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        setTimeout(function () {
            hme.updateUpcomingDeliveryData('today');
            hme.getTaskInfo('assigned_to_me');
        }, 100);
    }

    hme.updateUpcomingDeliveryData = function (type) {
        var promise = services.getProjectTodayData(type);
        promise.success(function (result) {
            if (result.data != null) {
                for (i = 0; i < result.data.data.length; i++) {
                    result.data.data[i].m_due_date = Utility.formatDate(result.data.data[i].m_due_date);
                }
                hme.todayProjectData = result.data.data;
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    hme.enableFilters = function () {
        $("#taskAssignedBy").parent().parent().css("display", "none");
        $("#taskAssignedTo").parent().parent().css("display", "none");
        $("#taskStatus").parent().parent().css("display", "none");
        $("#projectName").parent().parent().css("display", "none");

        if (hme.taskType == "assigned_to_me") {
            $("#taskStatus").parent().parent().css("display", "block");
            $("#projectName").parent().parent().css("display", "block");
            $("#taskAssignedBy").parent().parent().css("display", "block");
        }
        if (hme.taskType == "assigned_by_me") {
            $("#taskStatus").parent().parent().css("display", "block");
            $("#projectName").parent().parent().css("display", "block");
        }
        if (hme.taskType == "pending") {
            $("#taskAssignedBy").parent().parent().css("display", "block");
            $("#taskStatus").parent().parent().css("display", "block");
            $("#projectName").parent().parent().css("display", "block");
            $("#taskAssignedTo").parent().parent().css("display", "block");
        }
        if (hme.taskType == "all") {
            $("#taskAssignedBy").parent().parent().css("display", "block");
            $("#taskStatus").parent().parent().css("display", "block");
            $("#projectName").parent().parent().css("display", "block");
            $("#taskAssignedTo").parent().parent().css("display", "block");
        }
    }

    hme.fetchList = function (page, sort_by) {
        hme.limit = $('#table_length').val();
        if (sort_by == null) {
            sort_by = hme.sort_by;
        } else {
            hme.sort_by = sort_by;
        }
        // hme.limit = 5;
        if (hme.limit == undefined) {
            hme.limit = -1;
        }
        if (page == -1) {
            hme.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            hme.pageno = page;
        }

        hme.taskInfo = [];
        var req = {
            "project_id": hme.projectName,
            "status_id": hme.taskStatusName,
            "assigned_to": hme.taskAssignedTo,
            "assigned_by": hme.taskAssignedBy,
            "type": hme.taskType,
            "user_id": loggedInUser.id,
            "sort_by": sort_by
        };

        if (hme.taskType == 'all') {
            for (var role = 0; role < loggedInUser.identity.role.length; role++) {
                if (loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') {
                    req.user_id = null;
                    break;
                }
            }
        }

        var requestParam = {
            page: hme.pageno,
            limit: hme.limit
        }

        var promise = services.getDashboardTaskInfoFilterData(req, requestParam);
        promise.success(function (result) {
            if (result.data != null) {
                if (result.data.data.length > 0) {
                    // Suvrat Issue#3170
                    var len = result.data.data.length;
                    for (var i = 0; i < len; i++) {
                        var temp = 0;
                        temp = result.data.data[i].estimated_time;
                        temp = temp.split('.');
                        if (isNaN(temp[1])) {
                            temp[1] = "00";
                        }
                        temp = temp[0] + ":" + temp[1];
                        result.data.data[i].estimated_time = temp;
                    }
                    hme.taskInfo = result.data.data;
                    hme.fromValue = result.data.from;
                    hme.toValue = result.data.to;
                    hme.totalEntries = result.data.total;
                    pagination.applyPagination(result.data, hme);
                }

            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    hme.filterTaskData = function (value = null) {
        hme.enableFilters();
        hme.fetchList(-1, value);
    }

    hme.getTaskInfo = function (type) {
        hme.taskType = type;
        hme.filterTaskData(hme.sort_by);
    }

    hme.refreshfilter = function () {
        hme.projectName = null;
        hme.taskStatusName = null;
        hme.taskAssignedTo = null;
        hme.taskAssignedBy = null;
        // hme.taskType = "assigned_to_me";
        applySelect2();
        hme.filterTaskData(hme.sort_by);
    }

    hme.init();

    /**
    * Namrata : Process the Extension Time Approval 
    */
    hme.approveTimeExtension = function () {
        if ($("#approveTimeExtension").valid()) {

            var req = {
                "task_id": hme.taskId,
                // "extension_time": (tsk.taskEstimationInHr != null && tsk.taskEstimationInMin != null) ? tsk.taskEstimationInHr + '.' + tsk.taskEstimationInMin : ((tsk.taskEstimationInHr != null && tsk.taskEstimationInMin == null) ? tsk.taskEstimationInHr : null),
                "updated_by": hme.userId,
                "remark": hme.remark,
                "is_approved": 1
            };

            var promise = services.updateTimeExtension(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    toastr.success(response.data.message);
                    $("#approveTimeExtensionModal").modal("toggle");
                    hme.getTaskInfo('pending');

                } catch (e) {
                    toastr.error(response.data.message);
                    Raven.captureException(e);
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    /**
    * Namrata : Store the task Id and Open Time Estimation Approval Modal
    */
    hme.openApproveTimeEstimationModal = function (task_id) {
        hme.taskId = task_id;
        $("#approvalRemark").val("");

        var validator = $("#approveTimeExtension").validate();
        validator.resetForm();

        $("#approveTimeExtensionModal").modal("show");
        setTimeout(function () {
            setCSS();
        }, 500);
    }
});
