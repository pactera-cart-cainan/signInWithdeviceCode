module.exports = function(app) {
    const deviceCode = require('../controllers/deviceCodeController');
  
    // deviceCode Routes
    app.route('/getDeviceCode')
      .get(deviceCode.getDeviceCode)
      .post(deviceCode.postDeviceCode);
  
    app.route('/getToken')
      .post(deviceCode.getToken);
    //   .put(todoList.updateTodo)
    //   .delete(todoList.deleteTodo);
  };