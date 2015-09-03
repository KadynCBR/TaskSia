var taskSia = angular.module('taskSia', []);

function mainController($scope, $http) {
  $scope.formData = {};

  $scope.sortType = 'urgency'; // Set default sort type
  $scope.sortReverse = false; // set default sort order
  $scope.searchTask = ''; // For using a filter to search for tasks

  // when landing on the page, get all todos and show them
  $http.get('/api/todos')
    .success(function(data) {
      $scope.todos = data;
      console.log(data);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // When submitting the add form, send the text to the node API
  $scope.createTodo = function() {
    $http.post('/api/todos', $scope.formData)
      .success(function(data) {
        $scope.formData = {}; // Clear the form so our user is ready to enter another
        $scope.todos = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // Delete a todo after checking it
  $scope.deleteTodo = function(id) {
    $http.delete('/api/todos/' + id)
      .success(function(data) {
        $scope.todos = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error :' + data);
      });
  };
}