app.controller("loginCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore) {

    var lgc = this;
    lgc.email = null;
    lgc.password = null;
    lgc.remember = false;
    lgc.token = null;
    lgc.data = [];

    lgc.login = function () {

        if ($("#loginForm").valid()) {
            Utility.startAnimation();
            var promise = services.logIn(lgc.email, lgc.password);
            promise.then(function mySucces(r) {
                if (r.data != null) {
                    // set token in cookies
                    lgc.token = r.data.data.authToken;
                    // $cookieStore.put('authkey', lgc.token);
                    services.setAuthKey(lgc.token);
                    var role = 'admin';
                    var abilities = [];
                    var data = r.data.data;
                    // $.each(data.permissionGroupList, function (k, v) {
                    //     if (v.permissionList.length > 0) {
                    //         $.each(v.permissionList, function (k1, v1) {
                    //             abilities.push(v1.permissionTag);
                    //         })
                    //     }
                    // });

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
                } else {
                    /*console.log("Status code is not 200");*/
                }
            }, function myError(r) {
                if (r.hasOwnProperty("data")) {
                    if (r.data != null) {
                        toastr.error(r.data.message, 'Sorry!');
                    } else {
                        toastr.error('Sorry! Check server!!!');
                    }
                }
                Utility.stopAnimation();
            });
        } else {
            //console.log("Enter valid credentials");
        }
    };

    // forgot password
    lgc.forgotpassword = function () {
        $location.path('/site/forget-password');
    };
});
