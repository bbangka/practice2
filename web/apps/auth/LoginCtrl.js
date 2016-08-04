(function(module) {
    'use strict';

    /**
     * Login Controller
     *
     * @param $scope - angular scope.
     * @param $window - angular window service.
     * @param profile - profile service (from fbe.auth).
     * @param login - login service (from fbe.auth).
     */
    function LoginCtrl($scope, $window, profile, login) {

        /////////////////////////////////
        // Controller Initialization  ///
        ////////////////////////////////
        $scope.authenticating = false;
        $scope.info = null;
        $scope.username = Cookies.get('username') || '';
        $scope.password = '';
        $scope.remember = Cookies.get('username') != null;
        $scope.loading = false;
        $scope.facilities = profile.facilities || [];

        //looks for the recommended facility
        for(var i=0; i < $scope.facilities.length; i++){
            if($scope.facilities[i].recommended){
                $scope.recommendedFacility = $scope.facilities[i];
                $scope.preferredFacility = $scope.facilities[i];
            }
        }

        //if not preferred facility was found then this selects the
        // first facility as preferred facility
        if(!$scope.preferredFacility && $scope.facilities.length > 0) {
            $scope.preferredFacility = $scope.facilities[0];
        }

        /**
         * If the user wants the application to remember his/her settings,
         * then this function saves them in the cookie store.
         *
         * @private
         * @param {string} username - the preferred user name.
         */
        function updateCookies(username) {
            var cookieOptions = { expires: 604800 };
            if ($scope.remember) {
                Cookies.set('username', username, cookieOptions);
            } else {
                Cookies.expire('username');
            }
        }

        /**
         * Event handler activated when the login has been successful.
         *
         * @param {Object} authenticatedUser - the authenticated user's data.
         */
        function onLoginSuccess(authenticatedUser) {
            updateCookies(authenticatedUser.userId);
            $window.location.href = '';
        }

        /**
         * Event handler activated when login has failed.
         *
         * @param {{message:string,status:number=}} error - the login error details.
         */
        function onLoginFailure(error) {
            $scope.loading = false;
            $scope.info = error;
        }

        /**
         * Event handler that can be triggered several times as the login service
         * performs the login process. It is used to notify the user of the progress
         * of the cross-domain login as the different parties get involved in the
         * authentication process.
         *
         * @param {{message:string}} info - informational message.
         */
        function onLoginNotification(info) {
            $scope.info = info;
        }

        /**
         * Triggers login against the application server and if an interchange
         * URL is provided in the facility it also does cross-domain login to
         * Interchange.
         *
         * @param {boolean} valid - whether the login form is valid or not.
         */
        $scope.login = function(valid) {
            if (valid) {
                $scope.error = null;
                $scope.loading = true;
                var credentials = {
                    username: $scope.username,
                    password: $scope.password,
                    facility: {
                        name: $scope.preferredFacility.name
                    }
                };
                login.login(credentials, onLoginNotification, onLoginSuccess, onLoginFailure);
            } else {
                $scope.info = {message: 'Please fill in all required fields (*)'};
            }
        };
    }

    module.controller('LoginCtrl', ['$scope', '$window', 'profile', 'login', LoginCtrl]);

})(angular.module('product-data-ui', ['fbe.auth']));
