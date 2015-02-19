/**
 * Created by acolodnitchii on 2/13/2015.
 */
define(["jquery", "underscore", "userService"], function ($, _, userService) {
    return {
        init: function (options) {

            var usersTemplate;

            //subscribing to DOM events
            $(options.addUser).on("click", toogleAndResetForm);
            $(options.userFormReset).on("click", toogleAndResetForm);
            $(options.userForm).submit(submitForm);
            $(document.body).on("click", options.deleteUser, deleteUser);
            $(document.body).on("click", options.editUser, editUser);

            //compiling template and trigger loading of initial data
            compileTemplate();
            refreshUsers();


            function editUser() {
                var userId = $(this).data("user-id");
                userService.getById(userId).then(function (data) {
                    $(options.userForm).trigger("reset");
                    fillUserData(data);
                    $(options.userForm).show();
                });
            }

            function deleteUser() {
                var userId = $(this).data("user-id");
                if (window.confirm("Are you sure want to delete user?")) {
                    userService.delete(userId).then(function () {
                        refreshUsers();
                    });
                }

            }

            function submitForm(e) {
                var user = getFormData($(this));

                //if user id is set then we are in edit mode otherwise in add mode
                var promise = user.id ? userService.update : userService.add;

                //calling promise and updating data
                promise(user).then(function(){
                    refreshUsers();
                    toogleAndResetForm();
                });

                e.preventDefault();
            }

            function toogleAndResetForm() {
                $(options.userForm).toggle();
                $(options.userForm).trigger("reset");
            }

            function compileTemplate() {
                var templateContent = $(options.usersTemplate).html();
                usersTemplate = _.template(templateContent);
            }

            function refreshUsers() {
                userService.getAll().done(function (users) {
                    var evaluated = usersTemplate({users: users});
                    $(options.usersListPlaceholder).html(evaluated);
                });
            }

            function fillUserData(data) {
                //filling data from the server to the client
                //do not do that on production instead map it manually
                _.each(data, function (value, key) {
                    var element = $("#" + key);
                    if (!element.length)
                        return;

                    if (element.is(":checkbox"))
                        element.prop("checked", value);
                    else
                        element.val(value)
                });
            }
        }
    };

    function getFormData(form) {
        //getting serialized data as array
        var formData = form.serializeArray();
        //converting it to object using underscore
        var result = _.object(_.map(formData, _.values));
        //checkboxes are not properly serialized in real life you would need something like this
        //https://github.com/marioizquierdo/jquery.serializeJSON
        result.active = result.active ? true : false;
        return result;
    }

});