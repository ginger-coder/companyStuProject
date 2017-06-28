var login = angular.module('loginCtrl', []);
login.controller('userMessage', ['$scope', '$rootScope', '$cookies', function($scope, $rootScope, $cookies) {
	$scope.outLogin = function() {

	}
}]);

login.controller('loginCtrl', ['$scope', '$rootScope', 'loginService', '$cookies', 'isLoginState', '$interval', function($scope, $rootScope, loginService, $cookies, isLoginState, $interval) {
	layer.closeAll('loading');
	$interval.cancel($rootScope.intelTime);
	$scope.isLoginText = '点击登录';

	$scope.isDisable = false; //点击登录防多次点击提交

	if($cookies.get('username')){
		$rootScope.$state.go('home');
	}


	$scope.loginData = {
		"OrgLink": "string"
	};

	//获取单选按钮的值
	$scope.checkDisabled = false;
	$scope.checkType = false;
	$('#switchCheck').change(function() {
		_czc.push(['_trackEvent', '登录记住密码按钮', '点击', '登录记住密码按钮']);
		$scope.checkType = $(this).prop('checked');
	});

	// console.log(isLgoinState.isTonten());
	// 
	// 判断是否保存密码


	if (isLoginState.isSave().password) {
		$scope.loginData.Password = isLoginState.isSave().password;
		$scope.loginData.UserName = isLoginState.isSave().username;
		if (isLoginState.isSave().btnstaus == 1) {
			$scope.checkType = true;
			$scope.checkDisabled = true;
			$('#switchCheck').trigger('click');
		}
	}



	// Timeout example

	$rootScope.isTemp = 1;
	$rootScope.isBuyMeal = false;
	$scope.loginGo = function() {
		_czc.push(['_trackEvent', '登录按钮', '点击', '登录页登录按钮']);
		layer.load();
		$scope.isLoginText = '登录中...';
		$scope.isDisable = true;
		$('#loginbtn').attr('disabled', true);
		loginService.post(_AjaxURL.login, $scope.loginData)
			.success(function(res) {
				if (res.result == 1) {
					$('#loginbtn').attr('disabled', false);
					$scope.isLoginText = '登录成功';

					// 判断是否显示引导
					$rootScope.isTemp = res.data.isShowGuide;

					var tempDate = new Date();
					tempDate.setDate(tempDate.getDate() + 30);

					$cookies.put('isTemp', $rootScope.isTemp, {
						'expires': tempDate
					});


					$scope.isDisable = false;
					var expiresDate = new Date();
					var isGuoQi = new　Date();
					if ($scope.checkType) {
						expiresDate.setDate(expiresDate.getDate() + 7);
						$cookies.put('btnstaus', '1', {
							'expires': expiresDate
						});
						$cookies.put('password', $scope.loginData.Password, {
							'expires': expiresDate
						});
						$cookies.put('username', $scope.loginData.UserName, {
							'expires': expiresDate
						});
					} else {
						$cookies.remove('password');
						$cookies.remove('btnstaus');
						$cookies.put('username', $scope.loginData.UserName);
					}


					$cookies.put('tonken', res.data.userToken);
					$cookies.put('isComplete', res.data.isComplete);
					$cookies.put('bookingId', res.data.bookingId);
					
					isGuoQi.setDate(isGuoQi.getHours() + 2);
					$cookies.put('isGuoQi','1', {
						'expires': isGuoQi
					})
					layer.closeAll('loading');

					$rootScope.$state.go('home');


				} else {

					layer.msg(res.msg, {
						icon: 2
					})
					$scope.isDisable = false;
					$('#loginbtn').attr('disabled', false);
					$scope.isLoginText = '点击登录';
					layer.closeAll('loading');
				}

			})
			.error(function(res) {
				layer.msg('登录失败', {
					icon: 2
				})
				$scope.isLoginText = '点击登录';
				$('#loginbtn').attr('disabled', false);
				layer.closeAll('loading');
			})
	}

	$(document).keydown(function(event) {
		if (event.keyCode == 13) { //绑定回车 
			$('#loginbtn').click(); //自动触发登录按钮 
		}
	});



}])

login.controller('registerCtrl', function($scope, $rootScope, loginService, $cookies) {
	$scope.regData = {
		"UserId": 0,
		"NickName": "未填写",
		"Sex": 3,
		"Birthday": "string",
		"OrgId": 0
	};
	$scope.isDisable = true;
	$scope.registerText = '下一步';

	$scope.register = function() {
		_czc.push(['_trackEvent', '注册按钮', '点击', '登录页注册按钮']);
		layer.load();
		$('#regbtn').attr('disabled', true);
		$scope.registerText = '注册中...';
		$('#regbtn').attr('disabled', true);
		loginService.post(_AjaxURL.AddUser, $scope.regData)
			.success(function(res) {
				if (res.result == 1) {
					$rootScope.isTemp = res.data.isShowGuide;

					var tempDate = new Date();
					tempDate.setDate(tempDate.getDate() + 30);

					$cookies.put('isTemp', $rootScope.isTemp, {
						'expires': tempDate
					});

					$('#regbtn').attr('disabled', false);
					$scope.registerText = '注册成功';
					layer.closeAll('loading');
					$rootScope.getTonken = res.data.userToken;

					$cookies.put('username', $scope.regData.Cell);

					$cookies.put('tonken', res.data.userToken);

					// $cookies.put('password',$scope.regData.Password);

					$cookies.put('isComplete', res.data.isComplete);

					$cookies.put('bookingId', 0);

					$rootScope.$state.go('index.wxregister');


				} else {
					$scope.registerText = '下一步';
					$('#regbtn').attr('disabled', false);
					layer.msg('该手机号已注册，请更换手机号', {
						icon: 2
					})
					layer.closeAll('loading');

				}
			})
			.error(function(res) {
				layer.msg(res.msg, {
					icon: 2
				})
				$('#regbtn').attr('disabled', false);
				layer.closeAll('loading');
			})
	}
})

login.controller('findpwdCtrl', ['$scope', '$rootScope', 'loginService', function($scope, $rootScope, loginService) {
	$scope.findPwdData = {

	};
	$scope.againPwd = {};
	$scope.isDisable = true;
	$scope.chageText = '点击修改';

	$scope.findpwd = function() {
		_czc.push(['_trackEvent', '修改密码按钮', '点击', '修改密码按钮']);
		layer.load();
		$('#findBtn').attr("disabled", true);

		$scope.isDisable = false;
		$scope.chageText = '正在修改...';
		loginService.post(_AjaxURL.chagePwd, $scope.findPwdData)
			.success(function(res) {
				if (res.result == 1) {
					$('#findBtn').attr("disabled", false);
					$scope.chageText = '修改成功';
					layer.closeAll('loading');
					$scope.isDisable = true;
					layer.msg('修改成功', {
						icon: 1
					});
					$rootScope.$state.go('index.login');
				} else if (res.result >= 1000) {
					$cookies.remove('tonken');
					$cookies.remove('username');
					$cookies.remove('isComplete');
					$cookies.remove('password');
					$cookies.remove('bookingId');
					$rootScope.$state.go('index.login');
					layer.closeAll('loading');
				} else {
					layer.msg(res.msg, {
						icon: 1
					});
					$scope.chageText = '点击修改';
					$('#findBtn').attr("disabled", false);
					layer.closeAll('loading');
				}
			})
			.error(function(res) {
				layer.msg(res.msg, {
					icon: 1
				});
				$scope.chageText = '点击修改';
				$('#findBtn').attr("disabled", false);
			})


	};
}])

login.controller('regjoinCtrl', ['$scope', '$rootScope', '$cookies', 'isLoginState', function($scope, $rootScope, $cookies, isLoginState) {

	// 判断登录状态
	$scope.goHome = function() {
		$cookies.put('tonken', $rootScope.getTonken);
		$rootScope.$state.go('home');
	}
}])

//