// HOW TO USE:
// $screen.addTo($scope); => I SUGEST $rootScope
// THIS WILL ADD PROPERTIES TO THE $scope:
// $scope.$screen.__size__ (e.g. xs, sm...) === true when true.
// THIS ALLOWS (among others):
// <any ng-if="$screen.xs"> ... </any>
// IT WILL ALSO BROADCAST CERTAIN EVENTS DOWN THE SCOPE ADDED
// TO REGISTER TO AN EVENT:
// $scope.$on('__event__', function(){...}); (e.g. )

// IT WORKS CURRENTLY FOR WHEN THERE IS A CONTAINER.
// ALSO IF LAZY LOADING 
// -> TAKE A LOOK AT $WINDOW.READY 
// -> IT COULD PREVENT FROM ADDING THE RESIZE EVENT TO THE WINDOW
angular.module('boostrap-screen-sizes', [])
.service('$screen',['$window', function($window){
	this.addTo = function ($scope){
		if($scope.$screen) return;
		var $window = angular.element($window);
		$scope.$screen = {
			$size: {}
		};

		$scope.$watch('$screen.$size', function(screen){
			if(screen.xs) $scope.$broadcast('screen_size_xs');
			if(screen.sm) $scope.$broadcast('screen_size_sm');
			if(screen.md) $scope.$broadcast('screen_size_md');
			if(screen.lg) $scope.$broadcast('screen_size_lg');

			if(screen.gt_xs) $scope.$broadcast('screen_size_gt_xs'); // triggered when greater than xs => sm|md|lg
			if(screen.gt_sm) $scope.$broadcast('screen_size_gt_sm'); // triggered when greater than sm => md|lg

			if(screen.lt_md) $scope.$broadcast('screen_size_lt_md'); // triggered when less than md => xs|sm
			if(screen.lt_lg) $scope.$broadcast('screen_size_lt_lg'); // triggered when less than lg => xs|sm|md
		}, true);

		function resize(ev){
			var width = $('.container').eq(0).outerWidth();
			$scope.$screen.$size = {
				xs: width < 750 // extra small devices
				,sm: width >= 750 && width < 970 // small devices
				,md: width >= 970 && width < 1170 // medium devices
				,lg: width >= 1170 // large devices
				// greater than
				,gt_xs: width >= 750 // sm || md || lg
				,gt_sm: width >= 970 // md || lg
				// less than
				,lt_md: width < 970 // xs || sm
				,lt_lg: width < 1170 // xs || sm || md
				// extra
				,all: true
				,none: false
			};
			$scope.$digest(); // We need to do a digest because this is an event outside angular's environment.
		}
		$window.ready(function(){
			angular.element(window).resize(resize);
			resize();
		});
	};
}]);