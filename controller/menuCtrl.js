app.controller("menuCtrl", function ($scope, $rootScope, IGNORE_LIST, services, AclService, menuService, $http, $location, $cookieStore, RESOURCES, $routeParams, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
    //$scope.token = null;
    $scope.menuList = [];
    $scope.can = AclService.can;
    $scope.ignoreList = IGNORE_LIST.list;
    $scope.projectNewTask = null;
    $scope.projectIDForMilestone = null;
    $scope.milestoneIdForTask = null;
    $scope.milestoneProjectId = null;
    $scope.taskListId = null;
    // $scope.globalMenu=services.getMenuList().project;
    // $rootScope.$on("menuCtrlMethod", function(data){
    // var flag=false;
    // for(var i=0;i<$scope.ignoreList.length;i++){
    //   var tempVal=data.currentScope.actualLocation.split('/');
    //   var url='';
    //   for (var k =0;k< tempVal.length ;k++) {
    //     if(isNaN(tempVal[k])){
    //       url+='/'+tempVal[k];
    //     }
    //   }
    //   if( url==''){
    //     url='/'
    //   }
    //   if(url==$scope.ignoreList[i]){
    //     flag=true;
    //   }
    // }
    // if(flag){
    //   $scope.projectInfo= {};
    // }else{
    //   $scope.projectInfo= data.currentScope.projectInfo;
    // }
    // setTimeout(function(){
    // $scope.projectInfo= menuService.getProjectInfo();
    // },100);
    // });

    setTimeout(function () {
        $scope.projectInfo = menuService.getProjectInfo();
    }, 100);

    // $scope.subMenuClick=function(id){
    //   var add='fa-angle-left';
    //   var remove='fa-angle-down';
    //   if($('#'+id).hasClass('fa-angle-left')){
    //       remove='fa-angle-left';
    //       add='fa-angle-down';
    //   }
    //   $('#'+id).removeClass(remove);
    //   $('#'+id).addClass(add);
    // }

    // setTimeout(function(){
    //     $scope.projectInfo= menuService.getProjectInfo();
    // },100);


    // $scope.menu=function(id){
    // console.log($(this));/
    // }

    $scope.init = function () {
        $scope.token = services.getAuthKey();
        if ($scope.token != undefined) {
            $scope.user = services.getIdentity();
            $scope.name = $scope.user.identity.name;
            $scope.userId = $scope.user.id;
            $scope.avatar = $scope.user.identity.avatar;

            var requestParam = {
                page: 1,
                limit: -1,
                user_id: $scope.userId
            };
            var promise = services.getAllProjects(requestParam);
            promise.success(function (result) {
                Utility.stopAnimation();
                //Suvrat store the project list in scope variable
                applySelect2();
                $scope.ProjectsLists = result.data.data;
            });
            if ($cookieStore.get('menuInit') != 1) {

                var promise = services.getLoggedInUserData($scope.userId);
                promise.success(function (r) {
                    Utility.stopAnimation();
                    var role = 'admin';
                    var abilities = [];
                    var data = r.data;

                    for (var i = 0; i < data.permissionGroupList.length; i++) {
                        abilities.push(data.permissionGroupList[i].name);
                    }

                    var menuList = {};
                    var project = [];
                    var dashoard = [];
                    var resource = [];
                    var dashboardContent = [];
                    for (i = 0; i < data.menu_list.length; i++) {
                        data.menu_list[i].child = [];
                        if (1 == data.menu_list[i].type_id) {
                            project.push(data.menu_list[i]);
                        }
                        if (2 == data.menu_list[i].type_id) {
                            dashoard.push(data.menu_list[i]);
                        }
                        if (3 == data.menu_list[i].type_id) {
                            resource.push(data.menu_list[i]);
                        }
                        if (4 == data.menu_list[i].type_id) {
                            dashboardContent.push(data.menu_list[i]);
                        }
                    }

                    for (i = 0; i < project.length; i++) {
                        if (project[i].permissionTag == '') {
                            var child = [];
                            for (j = 0; j < project.length; j++) {
                                if (project[i].parent_id == project[j].parent_id && project[j].permissionTag != '') {
                                    child.push(project[j]);
                                    project.splice(j, 1);
                                    --j;
                                }
                            }
                            project[i].child = child;
                        }
                    }

                    for (i = 0; i < dashoard.length; i++) {
                        if (dashoard[i].permissionTag == '') {
                            var child = [];
                            var status = false;
                            for (j = 0; j < dashoard.length; j++) {
                                if (dashoard[i].parent_id == dashoard[j].parent_id && dashoard[j].permissionTag != '') {
                                    dashoard[i].permissionTag = dashoard[j].permissionTag;
                                    child.push(dashoard[j]);
                                    dashoard.splice(j, 1);
                                    --j;
                                }
                            }
                            dashoard[i].child = child;
                        }
                    }

                    for (i = 0; i < dashoard.length; i++) {
                        var status = false;
                        for (j = 0; j < dashoard[i].child.length; j++) {
                            for (per = 0; per < abilities.length; per++) {
                                if (abilities[per] == dashoard[i].child[j].permissionTag) {
                                    status = true;
                                }
                            }
                            dashoard[i].status = status;
                        }
                    }

                    menuList.project = project;
                    menuList.dashoard = dashoard;
                    menuList.resource = resource;
                    menuList.dashboardContent = dashboardContent;

                    var aclData = { admin: abilities }

                    AclService.setAbilities(aclData);
                    var identity = {
                        id: data.id,
                        authToken: data.authToken,
                        identity: {
                            name: data.name,
                            email: data.email,
                            gender: data.gender,
                            designation: data.designation,
                            role: data.roleName,
                            avtar: data.avatar
                        }
                    };
                    services.setIdentity(identity);
                    services.setMenuList(menuList);

                    // $cookieStore.put('userPermission', JSON.stringify(abilities));
                    // $.cookie("userPermission", JSON.stringify(abilities));
                    // $.cookie("projectMenuList", btoa(JSON.stringify(menuList.project)));
                    // $.cookie("dashoardMenuList", btoa(JSON.stringify(menuList.dashoard)));
                    // $.cookie("resourceMenuList", btoa(JSON.stringify(menuList.resource)));
                    // $.cookie("dashboardContentMenuList", btoa(JSON.stringify(menuList.dashboardContent)));

                    localStorage.setItem('userPermission', btoa(JSON.stringify(abilities)));
                    localStorage.setItem('projectMenuList', btoa(JSON.stringify(menuList.project)));
                    localStorage.setItem('dashoardMenuList', btoa(JSON.stringify(menuList.dashoard)));
                    localStorage.setItem('resourceMenuList', btoa(JSON.stringify(menuList.resource)));
                    localStorage.setItem('dashboardContentMenuList', btoa(JSON.stringify(menuList.dashboardContent)));

                    // $cookieStore.put('projectMenuList', JSON.stringify(menuList.project));
                    // $cookieStore.put('dashoardMenuList', JSON.stringify(menuList.dashoard));
                    // $cookieStore.put('resourceMenuList', JSON.stringify(menuList.resource));
                    // $cookieStore.put('dashboardContentMenuList', JSON.stringify(menuList.dashboardContent));
                    // $cookieStore.put('permissionList', JSON.stringify(abilities));
                    localStorage.setItem('identity', btoa(JSON.stringify(identity)));
                    AclService.attachRole(role);
                    location.reload();
                });
                $cookieStore.put('menuInit', 1);
            }
        }
    };

    $scope.init();

    /*Function to clear token*/
    $scope.clearToken = function () {
        localStorage.removeItem('userPermission');
        localStorage.removeItem('projectMenuList');
        localStorage.removeItem('dashoardMenuList');
        localStorage.removeItem('resourceMenuList');
        localStorage.removeItem('dashboardContentMenuList');
        localStorage.removeItem('identity');
        $cookieStore.remove('authkey');
        window.location.href = "/site/login";
    };

    $scope.addTask = function () {
        $('#taskSelModal').modal('show');
        applySelect2();
    };

    $scope.addMilestone = function () {
        $('#milestoneModal').modal('show');
        applySelect2();
    };

    $scope.select2Initialisation = function () {
        applySelect2();
    };

    $scope.getMilestoneListID = function (arg) {
        $scope.projectIDForMilestone = arg;
        var promise = services.getMilestoneListByProject({ "project_id": arg });
        promise.success(function (result) {
            $scope.MilestonesLists = result.data.data;
            applySelect2();
            Utility.stopAnimation();
        });
    };

    $scope.getTasksFromMilestone = function (arg) {
        $scope.milestoneIdForTask = arg;
        var promise = services.getTaskByMilestoneId(arg);
        promise.success(function (response) {
            $scope.TasksLists = response.tasks;
            applySelect2();
            Utility.stopAnimation();
        });
    };

    $scope.getTaskID = function (taskListId) {
        $scope.taskListId = taskListId;
    }

    $scope.getProjectID = function (projectNewTask) {
        $scope.projectNewTask = projectNewTask;
    }

    $scope.resetAddTaskModal = function () {
        $scope.taskOptionSelected = null;
        $scope.projectNewTask = null;
        $scope.projectIDForMilestone = null;
        $scope.milestoneIdForTask = null;
        $scope.taskListId = null;
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        applySelect2();
    };

    $scope.resetMilestoneModal = function () {
        $scope.milestoneProjectId = null;
    }

    $scope.dismissModal = function () {
        $('.modal').modal('hide');
        $('select').val($('select option:eq(1)').val()).trigger('change');
    };
});

var arrow_down = 0;
// var multi_menu = 0;
var submenu = 0;
// Suvrat
function menu(e) {
    if ($(e).children("i").eq(1).hasClass("fa-angle-left") && arrow_down == 0) {
        $(e).children("i").eq(1).css("transform", "rotate(-90deg)");
        arrow_down = 1;
    }
    else if ($(e).children("i").eq(1).hasClass("fa-angle-left") && arrow_down == 1) {
        $(e).children("i").eq(1).css("transform", "rotate(0deg)");
        arrow_down = 0;
    }
    else if (!($(e).children("i").eq(1).hasClass("fa-angle-left")) && arrow_down == 1 && submenu == 0) {
        $(e).parent().siblings().children("ul").removeClass("menu-open");
        $(e).parent().siblings().children("ul").css("display", "none");
        $(e).parent().siblings().children("ul").parent().removeClass("active");
        $(e).parent().addClass("active");
        $(e).parent().siblings().children("a").children("i").eq(4).css("transform", "rotate(0deg)");
        $(e).parent().siblings().children("a").children("i").eq(2).css("transform", "rotate(0deg)");
        $(e).parent().siblings().children("a").children("i").eq(5).css("transform", "rotate(0deg)");
        arrow_down = 1;
        submenu = 1;
    }
    else if (!($(e).children("i").eq(1).hasClass("fa-angle-left")) && arrow_down == 1 && submenu == 1) {
        $(e).parent().siblings().children("ul").children("li").removeClass("active");
        $(e).parent().siblings().children("ul").parent().removeClass("active");
        $(e).parent().siblings().children("ul").removeClass("menu-open");
        $(e).parent().siblings().children("ul").css("display", "none");
        $(e).parent().siblings().children("a").children("i").eq(4).css("transform", "rotate(0deg)");
        $(e).parent().siblings().children("a").children("i").eq(3).css("transform", "rotate(0deg)");
        $(e).parent().addClass("active");

        submenu = 0;
        arrow_down = 0;
    }
    else if (!($(e).children("i").eq(1).hasClass("fa-angle-left")) && arrow_down == 0 && submenu == 0) {
        $(e).parent().addClass("active");
    }
    else {
        submenu = 0;
        arrow_down = 0;
    }
}


